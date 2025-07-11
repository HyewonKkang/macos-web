import { KernelSubSystem } from './types';

export class Launchd implements KernelSubSystem {
  name = 'launchd';

  async init(): Promise<void> {}

  async shutdown(): Promise<void> {}

  async boot(): Promise<void> {}
}
