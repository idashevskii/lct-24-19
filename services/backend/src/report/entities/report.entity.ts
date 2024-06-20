import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class ReportSourceDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  name: string;

  @Column()
  mime: string;

  @Column({
    type: 'bytea',
    transformer: {
      to: (value: string) => Buffer.from(atob(value)),
      from: (value: Buffer) => btoa(value.toString()),
    },
  })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

@Entity()
export class ReportSource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column()
  description: string;

  @Column({ default: true })
  available: boolean;

  @Column({ type: 'timestamp', nullable: true })
  checkedAt?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: false })
  authRequred: boolean;

  @Column({ nullable: true })
  authCredentials?: string;
}

@Entity()
export class ReportTopic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  code: string; // code for external apis

  @OneToMany(() => ReportTemplate, (entity) => entity.topic)
  @JoinColumn()
  templates?: ReportTemplate[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

@Entity()
export class ReportTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  topicId: number;

  @ManyToOne(() => ReportTopic, (entity) => entity.templates)
  @JoinColumn({ name: 'topicId' })
  topic?: ReportTopic;

  @OneToMany(() => Report, (entity) => entity.template)
  @JoinColumn()
  reports?: Report[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  parameters?: string;
}

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  templateId: number;

  @ManyToOne(() => ReportTemplate, (entity) => entity.reports)
  @JoinColumn({ name: 'templateId' })
  template?: ReportTemplate;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  parameters?: string;

  @OneToMany(() => ReportDocument, (entity) => entity.report)
  @JoinColumn()
  documents?: ReportDocument[];
}

@Entity()
export class ReportDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reportId: number;

  @Column()
  name: string;

  @Column()
  content: string;

  @Column({nullable: true})
  metadata?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Report, (entity) => entity.documents)
  @JoinColumn({ name: 'reportId' })
  report?: Report;
}

export const entities = [
  Report,
  ReportTemplate,
  ReportSource,
  ReportSourceDocument,
  ReportTopic,
  ReportDocument,
];
