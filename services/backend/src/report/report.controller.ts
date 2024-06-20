import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Logger,
  Res,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { EntityManager, In } from 'typeorm';
import {
  Report,
  ReportDocument,
  ReportSourceDocument,
  ReportTemplate,
} from './entities/report.entity';
import { AppConfigService } from 'src/app-config/app-config.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Readable } from 'stream';
import { Response } from 'express';

export const SOURCE_DOCS_ELEMENT = 'source_docs';
type PromptParams = Record<string, any>;

interface ResearchResultMetadata {
  source_urls: string[];
}

interface ReportGeneratorResult {
  metadata: ResearchResultMetadata;
  markdown: string;
}

interface GeneratorConfig {
  dummyApi: boolean;
  llmKey: string;
  tavilyApiKey: string;
  llmPreset: string;
}

interface ReportGenerateRequest {
  config: GeneratorConfig;
  reportTopic: string;
  promptParams: PromptParams;
}

interface ReportRegeneratePayload {
  prompt: string;
  reportDocId: number;
  selectionStart: number;
  selectionLength: number;
}

interface ReResearchRequest {
  config: GeneratorConfig;
  promptParams: PromptParams;
  document: string;
  medatada: ResearchResultMetadata;
  prompt: string;
  selectionStart: number;
  selectionLength: number;
}

@Controller('v1')
export class ReportController {
  private readonly logger = new Logger(ReportController.name);

  constructor(
    private readonly reportService: ReportService,
    private readonly entityManager: EntityManager,
    private readonly appConfigService: AppConfigService,
    private readonly httpService: HttpService,
  ) {}

  @Get('report-source-documents/:id/download')
  async downloadReportSourceDocument(
    @Param('id') id: string,
    @Query('download') download: string,
    @Res() res: Response,
  ) {
    const doc = await this.entityManager.findOne(ReportSourceDocument, {
      where: { id: +id },
    });

    const fileBuffer = Buffer.from(doc.content, 'base64');
    const fileStream = Readable.from(fileBuffer);

    if (download === '1') {
      res.header(
        'Content-Disposition',
        `attachment; filename="${encodeURI(doc.name)}"`,
      );
    }
    res.header('Content-Type', doc.mime);
    fileStream.pipe(res);
  }

  @Get('report/:id')
  async findOne(
    @Param('id') id: string,
    @Query('withDocuments') withDocuments: string,
  ) {
    return this.reportService.getOne(+id, {
      withDocuments: withDocuments === '1',
    });
  }

  private async fetchSourceDocs(ids: number[]) {
    const docs = await this.entityManager.find(ReportSourceDocument, {
      where: { id: In(ids) },
      select: ['id', 'name', 'content'],
    });
    return docs.map(({ name, content }) => ({ name, content }));
  }

  @Post('report/:id/generate')
  async generate(@Param('id') id: string) {
    const report = await this.reportService.getOne(+id);
    const template = await this.entityManager.findOne(ReportTemplate, {
      where: { id: report.templateId },
      relations: ['topic'],
    });

    const promptParams = this.makeReportPromptParamsRequest(report);
    if (promptParams[SOURCE_DOCS_ELEMENT]) {
      const sourceDocs = promptParams[SOURCE_DOCS_ELEMENT];
      if (sourceDocs.length) {
        promptParams[SOURCE_DOCS_ELEMENT] = await this.fetchSourceDocs(
          promptParams[SOURCE_DOCS_ELEMENT],
        );
      }
    }

    const request: ReportGenerateRequest = {
      config: this.makeGenerateConfigRequest(),
      reportTopic: template?.topic.code,
      promptParams,
    };

    const data = await this.fetch('research', request);

    return await this.createReportDocument('markdown', {
      content: data.markdown,
      metadata: data.metadata,
      reportId: report.id,
    });
  }

  @Post('report/:id/regenerate')
  async regenerate(
    @Param('id') id: string,
    @Body() input: ReportRegeneratePayload,
  ) {
    const report = await this.reportService.getOne(+id);
    const docEntity = await this.entityManager.findOne(ReportDocument, {
      where: { reportId: report.id, id: input.reportDocId },
    });

    const request: ReResearchRequest = {
      config: this.makeGenerateConfigRequest(),
      document: docEntity.content,
      medatada: docEntity.metadata
        ? JSON.parse(docEntity.metadata)
        : {
            source_urls: [],
          },
      prompt: input.prompt,
      promptParams: this.makeReportPromptParamsRequest(report),
      selectionStart: input.selectionStart,
      selectionLength: input.selectionLength,
    };

    const data = await this.fetch('re-research', request);

    return await this.createReportDocument('regenerated_markdown', {
      content: data.markdown,
      metadata: data.metadata,
      reportId: report.id,
    });
  }

  private makeGenerateConfigRequest(): GeneratorConfig {
    const config = this.appConfigService.getConfig();
    return {
      dummyApi: config.dummyApi,
      llmKey: config.llmKey || '',
      tavilyApiKey: config.tavilyApiKey || '',
      llmPreset: config.llmPreset || '',
    };
  }

  private makeReportPromptParamsRequest(report: Report): PromptParams {
    return report.parameters ? JSON.parse(report.parameters) : {};
  }

  private async fetch(endpoint: string, payload: any) {
    const { data } = await firstValueFrom(
      this.httpService
        .post<ReportGeneratorResult>(
          'http://researcher:80/' + endpoint,
          payload,
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              error + '. Response: ' + JSON.stringify(error.response?.data),
            );
            throw error;
          }),
        ),
    );
    return data;
  }

  private async createReportDocument(
    name: string,
    params: {
      content: string;
      reportId: number;
      metadata: ResearchResultMetadata;
    },
  ) {
    const doc = new ReportDocument();
    doc.content = params.content;
    doc.reportId = params.reportId;
    doc.name = name;
    doc.metadata = JSON.stringify(params.metadata || {});

    const resDoc = await this.entityManager.save(doc);

    return { id: resDoc.id };
  }
}
