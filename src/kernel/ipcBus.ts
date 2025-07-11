import { KernelSubSystem } from './types';

export class IPCBus implements KernelSubSystem {
  name = 'ipc';

  async init(): Promise<void> {}

  async shutdown(): Promise<void> {}
}
