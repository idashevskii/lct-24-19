import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { DataSource, EntityManager, ILike } from 'typeorm';
import { dto } from './dto';
import { samples } from './samples';
import { Response } from 'express';
import { ReportService } from 'src/report/report.service';
import {
  Report,
  ReportSource,
  ReportSourceDocument,
  ReportTemplate,
  ReportTopic,
} from 'src/report/entities/report.entity';

type EntityClass = (typeof entities)[EntityName];

const entities = {
  report: Report,
  'report-template': ReportTemplate,
  'report-source': ReportSource,
  'report-source-documents': ReportSourceDocument,
  'report-topic': ReportTopic,
};

type EntityName = keyof typeof entities;

const entitySearchFields = {
  report: ['title'],
  'report-template': ['title'],
  'report-source': ['title', 'url', 'description'],
  'report-source-documents': ['title', 'name', 'mime'],
  'report-topic': ['title'],
};

@Controller('v1/generic')
export class GenericController {
  constructor(
    private readonly reportService: ReportService,
    private readonly entityManager: EntityManager,
    private readonly dataSource: DataSource,
  ) {}

  @Post('load-samples')
  async loadSampleData() {
    for (const entityName of Object.keys(samples) as EntityName[]) {
      const entityClass = this.parseEntityClass(entityName);
      for (const item of samples[entityName]) {
        await this.entityManager.save(entityClass, item);
      }
    }
    return 'OK';
  }

  @Post('clear')
  async clearData() {
    if (true || process.env.NODE_ENV === 'development') {
      await this.dataSource.dropDatabase();
      await this.dataSource.synchronize();
      return 'OK';
    } else {
      return 'IGNORED in ' + process.env.NODE_ENV;
    }
  }

  @Get(':entity')
  async findAll(
    @Res({ passthrough: true }) res: Response,
    @Param('entity') entityName: EntityName,
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('sorting') sorting?: string,
    @Query('search') search?: string,
    @Query('fields') fields?: string,
  ) {
    const entityClass = this.parseEntityClass(entityName);
    // const entity=

    const order = sorting
      ? sorting
          .split(',')
          .map((str) => {
            const [key, direction] = str.split(':');
            return { key, direction };
          })
          .reduce(
            (res, { key, direction }) => ({
              ...res,
              [key]: direction.toUpperCase(),
            }),
            {},
          )
      : undefined;

    const where = search
      ? entitySearchFields[entityName].map((field) => ({
          [field]: ILike(`%${search}%`),
        }))
      : undefined;

    const [items, total] = await this.entityManager.findAndCount(entityClass, {
      take: +perPage || undefined,
      skip: +(+page - 1) * +perPage || undefined,
      where,
      order,
      select: fields
        ? fields
            .split(',')
            .reduce((res, field) => ({ ...res, [field]: true }), {})
        : undefined,
    });

    res.header('X-Total', String(total));

    return items;
  }

  @Get(':entity/:id')
  async findOne(
    @Param('entity') entityName: EntityName,
    @Param('id') id: string,
  ) {
    const entityClass = this.parseEntityClass(entityName);
    return this.entityManager.findOneBy(entityClass, { id: +id });
  }

  @Post(':entity')
  async create(@Param('entity') entityName: EntityName, @Body() data: any) {
    const entityClass = this.parseEntityClass(entityName);
    delete data.id;
    delete data.createdAt;

    return this.entityManager.save(entityClass, data);
  }

  @Patch(':entity/:id')
  update(
    @Param('entity') entityName: EntityName,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    const entityClass = this.parseEntityClass(entityName);
    return this.entityManager.update(entityClass, +id, data);
  }

  @Delete('report/:id') // special handling
  async removeReport(@Param('id') id: string) {
    await this.reportService.remove(+id);
    return {};
  }

  @Delete(':entity/:id')
  async remove(
    @Param('entity') entityName: EntityName,
    @Param('id') id: string,
  ) {
    const entityClass = this.parseEntityClass(entityName);
    await this.entityManager.delete(entityClass, +id);
    return {};
  }

  private parseEntityClass(entityName: EntityName): EntityClass {
    const entityClass = entities[entityName];
    if (!entityClass) {
      throw new HttpException(
        `Invalid Entity ${entityName}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return entityClass;
  }
}
