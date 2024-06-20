import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ReportSource, ReportTopic, ReportTemplate, Report } from 'src/report/entities/report.entity';

export class CreateReportSourceDto extends OmitType(ReportSource, ['createdAt']){}
export class UpdateReportSourceDto extends PartialType(CreateReportSourceDto){}

export class CreateReportTopicDto extends OmitType(ReportTopic, ['templates']){}
export class UpdateReportTopicDto extends PartialType(CreateReportTopicDto){}

export class CreateReportTemplateDto extends OmitType(ReportTemplate, ['topic', 'reports', 'createdAt']){}
export class UpdateReportTemplateDto extends PartialType(CreateReportTemplateDto){}

export class CreateReportDto extends OmitType(Report, ['createdAt']){}
export class UpdateReportDto extends PartialType(CreateReportDto){}

export const dto={
  'report-source': {'create': CreateReportSourceDto, 'update': UpdateReportSourceDto},
  'report-topic': {'create': CreateReportTopicDto, 'update': UpdateReportTopicDto},
  'report-template': {'create': CreateReportTemplateDto, 'update': UpdateReportTemplateDto},
  'report': {'create': CreateReportDto, 'update': UpdateReportDto},
};
