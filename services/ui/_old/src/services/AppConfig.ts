import { injectable, inject } from 'inversify';
import configUrl from '/env.js?url';

@injectable()
export class AppConfig {
  private config: Record<string, string> = {};

  public constructor() {}

  async init() {
    this.config = typeof configUrl === 'string' ? (await import(/* @vite-ignore */ configUrl)).default : configUrl;
  }

  getBaseUrl(): string {
    return this.config.baseUrl;
  }

  getApiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

}
