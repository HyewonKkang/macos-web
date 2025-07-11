import EventEmitter from 'eventemitter3';
import { Desktop } from '@system';
import { Kernel } from '@kernel';

export interface DockItem {
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

  private items: DockItem[] = [];

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
    this.addItem({
      id: 'finder',
      appId: 'system.finder',
      name: 'Finder',
      icon: 'finder-icon.png',
      isRunning: false,
      windowCount: 0,
    });
  }

  public addItem(item: DockItem): void {
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
}
