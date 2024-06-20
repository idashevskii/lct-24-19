import { Module } from '@nestjs/common';
import { GenericController } from './generic.controller';
import { ReportModule } from 'src/report/report.module';

@Module({
  imports: [ReportModule],
  controllers: [GenericController],
})
export class GenericModule {}
