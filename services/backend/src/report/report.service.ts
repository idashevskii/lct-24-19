import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { EntityManager } from 'typeorm';
import { Report, ReportDocument } from './entities/report.entity';

@Injectable()
export class ReportService {
  constructor(private readonly entityManager: EntityManager) {}

  async remove(id: number) {
    await this.entityManager.delete(ReportDocument, {reportId: +id})
    await this.entityManager.delete(Report, +id);
  }

  async getOne(id: number, opts?: {withDocuments: boolean}) {
    return this.entityManager.findOne(Report, {
      where: { id: +id },
      relations: opts?.withDocuments ? ['documents'] : undefined,
    });
  }
  
  
  
}
