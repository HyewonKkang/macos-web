import EventEmitter from 'eventemitter3';
import { KernelSubSystem } from './types';

type LaunchdEvents = {
  'launchd:booted': void;
  'launchd:shutdown': void;
};

// TODO: 추후 서비스 관리 기능 추가
export class Launchd
  extends EventEmitter<LaunchdEvents>
  implements KernelSubSystem
{
  name = 'launchd';
  private booted: boolean = false;

  constructor() {
    super();
  }

  public async init(): Promise<void> {
    this.booted = false;
    return Promise.resolve();
  }

  public async shutdown(): Promise<void> {
    this.booted = false;
    this.emit('launchd:shutdown');
  }

  public async boot(): Promise<void> {
    this.booted = true;
    this.emit('launchd:booted');
  }
}
