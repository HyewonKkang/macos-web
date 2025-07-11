import EventEmitter from 'eventemitter3';
import { IPCBus } from './ipcBus';
import { Launchd } from './launchd';
import { ProcessManager } from './processManager';
import {
  KernelEvent,
  KernelEventType,
  KernelState,
  KernelSubSystem,
} from './types';

export class Kernel extends EventEmitter<KernelEventType, any> {
  private static instance: Kernel | null = null;
  private state: KernelState = 'starting';
  private startTime: number = 0;

  // 커널 서브 시스템
  public ipc: IPCBus;
  public processManager: ProcessManager;
  public launchd: Launchd;

  private subsystems: KernelSubSystem[] = [];

  private constructor() {
    super();

    this.ipc = new IPCBus();
    this.processManager = new ProcessManager();
    this.launchd = new Launchd();

    this.subsystems = [this.ipc, this.processManager, this.launchd];
  }

  public static getInstance(): Kernel {
    if (!Kernel.instance) {
      Kernel.instance = new Kernel();
    }
    return Kernel.instance;
  }

  /**
   * 커널 시작
   */
  public async boot(): Promise<void> {
    console.log('Booting kernel...');

    try {
      this.startTime = Date.now();
      console.log('🚀 Kernel booting...');

      // 서브시스템 초기화
      for (const subsystem of this.subsystems) {
        console.log(`🔄 Initializing ${subsystem.name}...`);
        await subsystem.init();
      }

      // launchd 시작
      console.log('🔄 Starting launchd...');
      await this.launchd.boot();

      // 커널 준비 완료
      this.state = 'running';

      this.emit('kernel:start', {
        type: 'kernel:start',
        timestamp: Date.now(),
      } as KernelEvent);

      // 약간의 지연 후 준비 완료 이벤트 발생
      setTimeout(() => {
        this.emit('kernel:ready', {
          type: 'kernel:ready',
          timestamp: Date.now(),
        } as KernelEvent);
        const bootTime = Date.now() - this.startTime;
        console.log(`🚀 Kernel booted in ${bootTime}ms`);
      }, 3000);
    } catch (error) {
      this.state = 'error';
      this.emit('kernel:error', {
        type: 'kernel:error',
        timestamp: Date.now(),
        data: { error },
      } as KernelEvent);
    }
  }

  /**
   * 커널 종료
   */
  public async shutdown(): Promise<void> {
    console.log('Shutting down kernel...');

    try {
      this.state = 'stopping';

      // 서브시스템 종료
      for (const subsystem of this.subsystems) {
        console.log(`🔄 Shutting down ${subsystem.name}...`);
        await subsystem.shutdown();
      }

      // 커널 종료
      this.emit('kernel:shutdown', {
        type: 'kernel:shutdown',
      });

      Kernel.instance = null;
    } catch (error) {
      this.state = 'error';
      this.emit('kernel:error', {
        type: 'kernel:error',
        timestamp: Date.now(),
        data: { error },
      } as KernelEvent);
    }
  }

  /**
   * 커널 재시작
   */
  public async restart(): Promise<void> {
    console.log('Restarting kernel...');

    await this.shutdown();
    await this.boot();
  }

  /**
   * 커널 상태 확인
   */
  public getState(): KernelState {
    return this.state;
  }
}
