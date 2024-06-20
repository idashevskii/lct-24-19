import { Injectable } from '@nestjs/common';

export class AppConfig {
  dummyApi: boolean;
  llmKey: string;
  tavilyApiKey: string;
  llmPreset: string;

  static default() {
    const ret = new AppConfig();
    ret.dummyApi = true;
    ret.llmPreset = 'openai_base'
    return ret;
  }
}

@Injectable()
export class AppConfigService {
  private appConfig: AppConfig = AppConfig.default();

  public getConfig() {
    return this.appConfig;
  }

  public setConfig(config: AppConfig) {
    this.appConfig = config;
  }
}
