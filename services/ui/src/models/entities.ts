export interface Settings {
  id: number;
  key: string;
  value: string;
}

export interface ReportSource {
  id: number;
  title: string;
  url: string;
  description: string;
  available: boolean;
  authRequred: boolean;
  createdAt: Date;
}

export interface ReportSourceDocument {
  id: number;
  title: string;
  name: string;
  mime: string;
  content?: string;
  createdAt: Date;
}

export interface ReportTopic {
  id: number;
  title: string;
  code: string;
  createdAt: Date;
}

export interface ReportTemplate {
  id: number;
  title: string;
  topicId: number;
  createdAt: Date;
  parameters: any;
}

export interface Report {
  id: number;
  title: string;
  templateId: number;
  createdAt: Date;
  parameters: any;
  documents?: ReportDocument[];
}

export interface ReportDocument {
  id: number;
  reportId: number;
  name: string;
  content: string;
  createdAt: Date;
}
