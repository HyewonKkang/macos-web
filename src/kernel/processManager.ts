import { KernelSubSystem } from './types';

export class ProcessManager implements KernelSubSystem {
  name = 'processManager';

  async init(): Promise<void> {}

  async shutdown(): Promise<void> {}
}
