import EventEmitter from 'eventemitter3';
import { Kernel } from 'src/kernel';

export class Desktop extends EventEmitter {
  private static instance: Desktop | null = null;
  private kernel: Kernel;

  constructor() {
    super();
    this.kernel = Kernel.getInstance();

    // 커널 이벤트 구독
    this.kernel.on('kernel:ready', this.handleKernelReady);

    // // ipc 이벤트 구독
    this.kernel.ipc.subscribe(
      'desktop',
      'ready',
      this.handleDesktopReady.bind(this),
    );
    this.kernel.ipc.subscribe('app', 'launch', this.handleAppLaunch.bind(this));
  }

  public static getInstance(): Desktop {
    if (!Desktop.instance) {
      Desktop.instance = new Desktop();
    }
    return Desktop.instance;
  }

  /**
   * 앱 실행
   */
  public launchApp(appId: string): number | null {
    try {
      const pid = this.kernel.processManager.createProcess(
        `App:${appId}`,
        appId,
      );

      // 앱 시작 이벤트 발행
      this.kernel.ipc.publish('app', 'launched', {
        appId,
        pid,
        timestamp: Date.now(),
      });

      return pid;
    } catch (error) {
      console.error(`Failed to launch app ${appId}:`, error);
      return null;
    }
  }

  /**
   * 앱 종료
   */
  public terminateApp(appId: string): void {
    const processes = this.kernel.processManager.getProcessesByAppId(appId);

    // 앱의 모든 프로세스 종료
    for (const process of processes) {
      this.kernel.processManager.killProcess(process.pid);
    }

    // 앱 종료 이벤트 발행
    this.kernel.ipc.publish('app', 'terminated', {
      appId,
      timestamp: Date.now(),
    });
  }

  private handleKernelReady = () => {
    console.log('Desktop: Kernel ready');

    this.kernel.ipc.publish('desktop', 'ready', {
      timestamp: Date.now(),
    });
  };

  private handleDesktopReady = () => {
    console.log('Desktop: Desktop ready');
    this.emit('desktop:ready');
  };

  private handleAppLaunch(data: any): void {
    if (!data.appId) return;

    const pid = this.launchApp(data.appId);
    console.log(`Launched app ${data.appId} with PID ${pid}`);
  }
}
