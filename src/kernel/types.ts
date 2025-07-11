export interface KernelSubSystem {
  name: string;
  init(): Promise<void>;
  shutdown(): Promise<void>;
}

export type KernelState = 'starting' | 'running' | 'stopping' | 'error';
export type KernelEventType =
  | 'kernel:start'
  | 'kernel:ready'
  | 'kernel:shutdown'
  | 'kernel:error';

export interface KernelEvent {
  type: KernelEventType;
  timestamp: number;
  data?: any;
}

export type ProcessState = 'ready' | 'running' | 'waiting' | 'terminated';

export interface Process {
  pid: number;
  state: ProcessState;
  startTime: number;
  appId: string;
}
