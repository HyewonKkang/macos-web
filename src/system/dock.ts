import EventEmitter from 'eventemitter3';
import { Desktop } from '@system';
import { Kernel } from '@kernel';
import { appRegistry, AppMetadata } from '../apps/registry';

export interface DockItemType {
  id: string;
  appId: string;
  name: string;
  icon: string;
  isRunning: boolean;
  windowCount: number;
}

export class Dock extends EventEmitter {
  private static instance: Dock | null = null;
  private kernel: Kernel;
  private desktop: Desktop;

  private items: DockItemType[] = [];

  constructor() {
    super();
    this.kernel = Kernel.getInstance();
    this.desktop = Desktop.getInstance();

    // 앱 실행/종료 이벤트 구독
    this.kernel.processManager.on(
      'process:created',
      this.handleProcessCreated.bind(this),
    );
    this.kernel.processManager.on(
      'process:terminated',
      this.handleProcessTerminated.bind(this),
    );

    this.initializeDefaultItems();
  }

  public static getInstance(): Dock {
    if (!Dock.instance) {
      Dock.instance = new Dock();
    }
    return Dock.instance;
  }

  private initializeDefaultItems(): void {
    // appRegistry에서 dock.show가 true인 앱들을 가져와서 dock item으로 추가
    const dockApps = Object.values(appRegistry)
      .filter((app) => app.dock.show)
      .sort((a, b) => (a.dock.position || 0) - (b.dock.position || 0));

    dockApps.forEach((app) => {
      const dockItem = createDockItemFromApp(app);
      this.addItem(dockItem);
    });
  }

  public addItem(item: DockItemType): void {
    if (this.items.some((i) => i.appId === item.appId)) {
      return;
    }

    this.items.push(item);
  }

  /**
   *
   * Dock 아이템 클릭 (앱 실행)
   */
  public clickItem(id: string): void {
    const item = this.items.find((i) => i.id === id);
    if (!item) return;

    if (item.isRunning) {
      // 앱이 실행 중이면 윈도우 표시
      this.kernel.ipc.publish('app', 'focus', { appId: item.appId });
    } else {
      this.desktop.launchApp(item.appId);
    }

    this.emit('dockitem:clicked', item);
  }

  private handleProcessCreated(event: any): void {
    const { appId } = event;

    const item = this.items.find((i) => i.appId === appId);
    if (item) {
      item.isRunning = true;
      item.windowCount++;

      this.emit('dockitem:updated', item);
    }
  }

  private handleProcessTerminated(event: any): void {
    const { appId } = event;

    // 실행 중인 같은 앱의 프로세스 확인
    const runningProcesses =
      this.kernel.processManager.getProcessesByAppId(appId);

    const item = this.items.find((i) => i.appId === appId);
    if (item) {
      item.isRunning = runningProcesses.length > 0;
      item.windowCount = runningProcesses.length;

      this.emit('dockitem:updated', item);
    }
  }

  public getItems(): DockItemType[] {
    return this.items;
  }
}

function createDockItemFromApp(appMetadata: AppMetadata): DockItemType {
  return {
    id: appMetadata.id, // dock item id는 appId와 동일하게
    appId: appMetadata.id,
    name: appMetadata.name,
    icon: appMetadata.icon,
    isRunning: false,
    windowCount: 0,
  };
}
