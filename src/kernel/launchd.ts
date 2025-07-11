import { KernelSubSystem } from './types';

export class Launchd implements KernelSubSystem {
  name = 'launchd';

  public async init(): Promise<void> {}

  public async shutdown(): Promise<void> {}

  public async boot(): Promise<void> {}
}
