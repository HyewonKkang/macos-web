import EventEmitter from 'eventemitter3';
import { Kernel } from '@kernel';

export interface Window {
  id: number;
  appId: string;
  title: string;
  pid: number;
  visible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isMaximized: boolean;
  isMinimized: boolean;
}

export class WindowManager extends EventEmitter {
  private static instance: WindowManager | null = null;
  private kernel: Kernel;

  private windows: Map<number, Window> = new Map();
  private nextWindowId: number = 1;
  private maxZIndex: number = 0;
  private activeWindowId: number | null = null;

  constructor() {
    super();
    this.kernel = Kernel.getInstance();
  }

  public static getInstance(): WindowManager {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }

    return WindowManager.instance;
  }

  /**
   * 새 윈도우 생성
   */
  public createWindow(
    appId: string,
    pid: number,
    options: {
      title?: string;
      position?: { x: number; y: number };
      size?: { width: number; height: number };
      visible?: boolean;
    },
  ): number {
    const windowId = this.nextWindowId++;
    this.maxZIndex++;

    const window: Window = {
      id: windowId,
      appId,
      pid,
      title: options.title || 'Untitled',
      visible: options.visible || true,
      position: options.position || { x: 100, y: 100 },
      size: options.size || { width: 800, height: 600 },
      zIndex: this.maxZIndex,
      isMaximized: false,
      isMinimized: false,
    };

    this.windows.set(windowId, window);

    this.kernel.processManager.attachWindow(pid, windowId);

    this.emit('window:created', window);

    if (window.visible && !window.isMinimized) {
      this.focusWindow(windowId);
    }

    return windowId;
  }

  /**
   * 윈도우 닫기
   */
  public closeWindow(windowId: number): void {
    const window = this.windows.get(windowId);
    if (!window) return;

    this.windows.delete(windowId);

    this.kernel.processManager.detachWindow(window.pid, windowId);

    this.emit('window:closed', window);

    if (this.activeWindowId === windowId) {
      this.activeWindowId = null;

      // 닫힌 윈도우가 활성화 상태였다면 다음으로 z-index가 높은 윈도우 활성화
      const nextWindow = Array.from(this.windows.values()).find(
        (w) => w.zIndex > window.zIndex,
      );

      if (nextWindow) {
        this.focusWindow(nextWindow.id);
      }
    }
  }

  /**
   * 윈도우 포커스
   */
  public focusWindow(windowId: number): void {
    const window = this.windows.get(windowId);
    if (!window || window.isMinimized) return;

    // 이미 포커스된 상태면 무시
    if (this.activeWindowId === windowId) return;

    if (this.activeWindowId) {
      this.emit('window:blur', { id: this.activeWindowId });
    }

    // 최상위로 가져오기
    this.maxZIndex++;
    window.zIndex = this.maxZIndex;

    // 포커스 상태 업데이트
    this.activeWindowId = windowId;

    this.emit('window:focused', window);
  }

  /**
   * 윈도우 최대화
   */
  public maximizeWindow(windowId: number): void {
    const window = this.windows.get(windowId);
    if (!window) return;

    window.isMaximized = !window.isMaximized;
    window.isMaximized = true;

    this.emit('window:maximized', window);
    this.focusWindow(windowId);
  }

  /**
   * 윈도우 최소화
   */
  public minimizeWindow(windowId: number): void {
    const window = this.windows.get(windowId);
    if (!window) return;

    window.isMinimized = true;
    window.isMaximized = false;

    // 활성화 상태였다면 다음으로 z-index가 높은 윈도우 활성화
    if (this.activeWindowId === windowId) {
      const nextWindow = Array.from(this.windows.values()).find(
        (w) => w.zIndex > window.zIndex,
      );

      if (nextWindow) {
        this.focusWindow(nextWindow.id);
      }
    }

    this.emit('window:minimized', window);
  }

  /**
   * 윈도우 복원
   */
  public restoreWindow(windowId: number): void {
    const window = this.windows.get(windowId);
    if (!window) return;

    window.isMinimized = false;
    window.isMaximized = false;

    this.emit('window:restored', window);

    this.focusWindow(windowId);
  }

  /**
   * 윈도우 이동
   */
  public moveWindow(
    windowId: number,
    position: { x: number; y: number },
  ): void {
    const window = this.windows.get(windowId);
    if (!window || window.isMinimized || window.isMaximized) return;

    window.position = position;

    this.emit('window:moved', window);
  }

  /**
   * 윈도우 크기 조절
   */
  public resizeWindow(
    windowId: number,
    size: { width: number; height: number },
  ): void {
    const window = this.windows.get(windowId);
    if (!window || window.isMinimized || window.isMaximized) return;

    window.size = size;

    this.emit('window:resized', window);
  }

  public getActiveWindow(): Window | null {
    return this.activeWindowId
      ? this.windows.get(this.activeWindowId) || null
      : null;
  }

  public getWindows(): Window[] {
    return Array.from(this.windows.values());
  }
}
