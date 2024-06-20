import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities/report.entity';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    AppConfigModule,
    HttpModule.register({
      timeout: 300000,
      maxRedirects: 5,
    }),
  ],
  exports: [ReportService],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
