import { Kernel } from '@kernel';
import { WindowManager } from './windowManager';
import { appRegistry } from '../apps/registry';

export class AppLaunchService {
  private static instance: AppLaunchService | null = null;

  private kernel: Kernel;
  private windowManager: WindowManager;
  private runningApps: Map<string, Set<number>> = new Map(); // appId -> pid sets 매핑

  constructor() {
    this.kernel = Kernel.getInstance();
    this.windowManager = WindowManager.getInstance();

    // app:launched 이벤트 구독
    this.kernel.ipc.subscribe(
      'app',
      'launched',
      this.handleAppLaunched.bind(this),
    );

    // process 종료 이벤트 구독 (해당 앱의 모든 프로세스가 종료되면 runningApps에서 제거)
    this.kernel.processManager.on(
      'process:terminated',
      this.handleProcessTerminated.bind(this),
    );
  }

  public static getInstance(): AppLaunchService {
    if (!AppLaunchService.instance) {
      AppLaunchService.instance = new AppLaunchService();
    }
    return AppLaunchService.instance;
  }

  private handleAppLaunched(data: any): void {
    const { appId, pid } = data.data;

    if (!this.runningApps.has(appId)) {
      this.runningApps.set(appId, new Set());
    }

    this.runningApps.get(appId)?.add(pid);

    // 싱글 인스턴스 앱인 경우 이미 실행 중인 윈도우가 있는지 확인
    if (appRegistry[appId].singleInstance) {
      const existingWindow = this.windowManager
        .getWindows()
        .find((window) => window.appId === appId);

      if (existingWindow) {
        this.windowManager.focusWindow(existingWindow.id);

        // 최소화된 경우 윈도우 복원
        if (existingWindow.isMinimized) {
          this.windowManager.restoreWindow(existingWindow.id);
        }

        return;
      }
    }

    // 새 윈도우 생성
    const windowId = this.windowManager.createWindow(
      appId,
      pid,
      appRegistry[appId].windowDefaults,
    );

    this.windowManager.focusWindow(windowId);
  }

  private handleProcessTerminated(data: any): void {
    const { pid } = data;

    // 어떤 앱의 프로세스인지 확인
    for (const [appId, pids] of this.runningApps.entries()) {
      if (pids.has(pid)) {
        pids.delete(pid);

        // 해당 앱의 모든 프로세스가 종료되면 runningApps에서 제거
        if (pids.size === 0) {
          this.runningApps.delete(appId);
        }
      }
      break;
    }
  }
}
