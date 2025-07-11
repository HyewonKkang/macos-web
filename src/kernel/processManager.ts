import EventEmitter from 'eventemitter3';
import { KernelSubSystem, Process, ProcessEventType } from '@kernel';

export class ProcessManager
  extends EventEmitter<ProcessEventType, any>
  implements KernelSubSystem
{
  name = 'processManager';
  private processes: Map<number, Process> = new Map();
  private nextPid: number = 1000; // 1은 launchd용

  constructor() {
    super();
  }

  async init(): Promise<void> {
    this.clear();

    // PID 1 - launchd 프로세스 생성
    this.processes.set(1, {
      pid: 1,
      name: 'launchd',
      appId: 'system.launchd',
      state: 'running',
      startTime: Date.now(),
    });

    this.nextPid = 1000;
    return Promise.resolve();
  }

  async shutdown(): Promise<void> {
    // launchd 제외한 모든 프로세스 종료
    for (const pid of this.processes.keys()) {
      if (pid === 1) continue;
      this.killProcess(pid);
    }

    // 마지막으로 launchd 프로세스 종료
    this.processes.delete(1);

    this.clear();
    this.removeAllListeners();
    return Promise.resolve();
  }

  public createProcess(name: string, appId: string): number {
    const pid = this.nextPid++;
    const process: Process = {
      pid,
      name,
      appId,
      state: 'ready',
      startTime: Date.now(),
      windows: [],
    };

    this.processes.set(pid, process);

    setTimeout(() => {
      if (this.processes.has(pid)) {
        process.state = 'running';
        this.emit('process:started', { pid, appId, name });
      }
    }, 500);

    this.emit('process:created', { pid, appId, name });

    return pid;
  }

  public killProcess(pid: number): void {
    const process = this.processes.get(pid);
    if (!process) return;

    if (pid === 1) {
      console.log('launchd 프로세스는 종료할 수 없습니다.');
      return;
    }

    this.emit('process:terminated', {
      pid,
      name: process.name,
      appId: process.appId,
    });
    this.processes.delete(pid);
  }

  /**
   * 윈도우를 프로세스에 연결
   */
  public attachWindow(pid: number, windowId: number): boolean {
    const process = this.processes.get(pid);
    if (!process) return false;

    if (!process.windows) {
      process.windows = [];
    }

    if (!process.windows.includes(windowId)) {
      process.windows.push(windowId);
      return true;
    }

    return false;
  }

  /**
   * 윈도우를 프로세스에서 분리
   */
  public detachWindow(pid: number, windowId: number): boolean {
    const process = this.processes.get(pid);
    if (!process || !process.windows) return false;

    const index = process.windows.indexOf(windowId);
    if (index >= 0) {
      process.windows.splice(index, 1);
      return true;
    }

    return false;
  }

  private clear() {
    this.processes.clear();
  }

  public getProcessesByAppId(appId: string): Process[] {
    return Array.from(this.processes.values()).filter(
      (process) => process.appId === appId,
    );
  }
}
