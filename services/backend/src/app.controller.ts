import { Body, Controller, Get, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { AppConfig, AppConfigService } from './app-config/app-config.service';



@Controller('/v1/app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly appConfigService: AppConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/config')
  getConfig() {
    return this.appConfigService.getConfig();
  }
  
  @Put('/config')
  setConfig(@Body() data: AppConfig){
    this.appConfigService.setConfig(data);
    return {}
  }
}
