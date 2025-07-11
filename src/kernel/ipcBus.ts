import EventEmitter from 'eventemitter3';
import { IPCMessage, KernelSubSystem } from './types';

export class IPCBus extends EventEmitter implements KernelSubSystem {
  name = 'IPCBus';
  private channels: Set<string> = new Set<string>();

  constructor() {
    super();
  }

  public async init(): Promise<void> {
    this.clear();

    this.channels.add('system'); // 시스템 채널
    this.channels.add('app'); // 앱 간 통신 채널
    this.channels.add('ui'); // UI 관련 채널

    return Promise.resolve();
  }

  public async shutdown(): Promise<void> {
    this.clear();
    this.removeAllListeners();
    return Promise.resolve();
  }

  /**
   * 메세지 발행
   */
  public publish(channel: string, topic: string, data: any): void {
    const message: IPCMessage = { channel, topic, data };
    if (!this.channels.has(channel)) {
      this.registerChannel(channel);
    }

    // 특정 토픽 이벤트
    this.emit(`${channel}:${topic}`, message);

    // 채널 전체 이벤트
    this.emit(channel, message);

    // 모든 이벤트
    this.emit('message', message);
  }

  /**
   * 메세지 구독
   */
  public subscribe(
    channel: string,
    topic: string,
    callback: (message: IPCMessage) => void,
  ): () => void {
    const handler = (message: IPCMessage) => {
      if (message.channel === channel && message.topic === topic) {
        callback(message);
      }
    };

    this.on(channel, handler);

    return () => {
      this.off(channel, handler);
    };
  }

  /**
   * 특정 토픽에 대한 메세지 구독
   */
  public subscribeTopic(
    channel: string,
    topic: string,
    callback: (message: IPCMessage) => void,
  ): () => void {
    const eventName = `${channel}:${topic}`;
    const handler = (message: IPCMessage) => {
      callback(message.data);
    };

    this.on(eventName, handler);

    // 구독 취소 함수 반환
    return () => {
      this.off(eventName, handler);
    };
  }

  /**
   * 채널 등록
   */
  public registerChannel(channel: string): void {
    if (this.channels.has(channel)) {
      console.log(`IPCBus: 이미 등록된 채널입니다: ${channel}`);
    }

    this.channels.add(channel);
  }

  /**
   * 채널 제거
   */
  public unregisterChannel(channel: string): boolean {
    // 기본 채널은 제거 불가
    if (channel === 'system' || channel === 'app' || channel === 'ui') {
      console.log(`IPCBus: 기본 채널은 제거할 수 없습니다: ${channel}`);
      return false;
    }

    return this.channels.delete(channel);
  }

  private clear() {
    this.channels.clear();
  }
}
