import { injectable, inject } from 'inversify';
import { AppConfig } from './AppConfig';
import {
  type Report,
  type ReportSource,
  type ReportSourceDocument,
  type ReportTemplate,
  type ReportTopic,
} from '@/models/entities';

export interface ApiConfig {
  dummyApi: boolean;
  llmKey: string;
  tavilyApiKey: string;
  llmPreset: string;
}

export interface CrudLoadOpts {
  page?: number;
  perPage?: number;
  sorting?: { key: string; reverse: boolean }[];
  searchQuery?: string;
}

export interface CrudApiProvider<T> {
  keyProp: keyof T;
  create: (item: T) => Promise<void>;
  update: (item: T) => Promise<void>;
  read: (opts: CrudLoadOpts) => Promise<{ items: T[]; total: number }>;
  delete: (item: T) => Promise<void>;
}

type FetchOpts<R> = {
  data?: R;
  query?: { [k: string]: string };
  fetchTotal?: (total: number) => void;
};

const parameterSerde = {
  deser: (parameters: string): any => (parameters ? JSON.parse(parameters) : {}),
  ser: (parameters: any): string => JSON.stringify(parameters || {}),
};

@injectable()
export class ApiService {
  public constructor(@inject(AppConfig) private appConfig: AppConfig) {}

  private async fetch<R>(method: string, endpoint: string, { data, query, fetchTotal }: FetchOpts<R> = {}) {
    if (query) {
      endpoint += '?' + new URLSearchParams(query).toString();
    }
    const request: RequestInit = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    if (data) {
      request.body = JSON.stringify(data);
    }
    const url = this.appConfig.getApiBaseUrl() + '/' + endpoint;

    const res = await fetch(url, request);
    if (res.status < 200 || 299 < res.status) {
      alert(`API error ${res.status}`);
      return null as never;
    }
    try {
      if (fetchTotal) {
        fetchTotal(Number(res.headers.get('X-Total') || 0));
      }
      return await res.json();
    } catch (e) {
      alert(`Response parse error ${res.status}`);
      return null as never;
    }
  }

  public async getApiConfig() {
    return this.fetch('GET', 'v1/app/config');
  }

  public async setApiConfig(config: ApiConfig) {
    return this.fetch('PUT', 'v1/app/config', { data: config });
  }

  public async getUserSettings(): Promise<Map<string, string>> {
    const res = await this.fetch<{ key: string; value: string }[]>('GET', 'v1/user/1/settings');
    const ret: Map<string, string> = new Map();
    for (const { key, value } of res) {
      ret.set(key, value);
    }
    return ret;
  }

  public async setUserSettings(config: Map<string, string>) {
    const data: { key: string; value: string }[] = [];
    for (const [key, value] of config.entries()) {
      data.push({ key, value })
    }
    return this.fetch('PUT', 'v1/user/1/settings', { data });
  }

  private makeCrudApiProvider<T extends { id: number }>({
    endpoint,
    parser,
    serializer,
    fields,
  }: {
    endpoint: string;
    parser?: (items: T[]) => T[];
    serializer?: (item: T) => T;
    fields?: string[];
  }): CrudApiProvider<T> {
    const keyProp = 'id';
    const fetch = <R>(method: string, ep: string, opts: FetchOpts<R> = {}) => this.fetch(method, ep, opts);
    return {
      keyProp,
      async read({ page, perPage, sorting, searchQuery }: CrudLoadOpts) {
        let total = 0;
        const query: Record<string, string> = {};
        if (page) {
          query['page'] = String(page);
        }
        if (perPage) {
          query['perPage'] = String(perPage);
        }
        if (sorting) {
          query['sorting'] = sorting.map(({ key, reverse }) => `${key}:${reverse ? 'desc' : 'asc'}`).join(';');
        }
        if (fields) {
          query['fields'] = fields.join(',');
        }
        if (searchQuery) {
          query['search'] = String(searchQuery);
        }
        const items = await fetch('GET', endpoint, {
          fetchTotal: _total => (total = _total),
          query,
        });
        return { items: parser ? parser(items) : items, total };
      },
      async create(item: T) {
        if (serializer) {
          item = serializer(item);
        }
        await fetch('POST', endpoint, { data: item });
      },
      async delete(item: T) {
        await fetch('DELETE', endpoint + '/' + item.id);
      },
      async update(item: T) {
        if (serializer) {
          item = serializer(item);
        }
        await fetch('PATCH', endpoint + '/' + item.id, { data: item });
      },
    };
  }

  public async getTemplateParams() {
    return [
      { id: 1, title: 'Объем рыночной ниши' },
      { id: 2, title: 'Перечень ключевых игроков' },
      { id: 3, title: 'Перечень ключевых потребителей' },
      { id: 4, title: 'Перечень ключевых продуктов' },
      { id: 5, title: 'Сравнительный анализ продуктов' },
    ];
  }

  public getReport(id: number, query: { withDocuments: boolean }) {
    return this.fetch('GET', `v1/report/${id}`, {
      query: {
        withDocuments: query.withDocuments ? '1' : '',
      },
    });
  }

  public generateReport(id: number) {
    return this.fetch('POST', `v1/report/${id}/generate`);
  }

  public regenerateReport(
    id: number,
    params: {
      prompt: string;
      reportDocId: number;
      selectionStart: number;
      selectionLength: number;
    },
  ) {
    return this.fetch('POST', `v1/report/${id}/regenerate`, { data: params });
  }

  public getReportsCrud() {
    return this.makeCrudApiProvider<Report>({
      parser: items => {
        return items.map(item => ({
          ...item,
          createdAt: new Date(item.createdAt),
          parameters: parameterSerde.deser(item.parameters),
        }));
      },
      serializer: item => ({ ...item, parameters: parameterSerde.ser(item.parameters) }),
      endpoint: 'v1/generic/report',
    });
  }

  public getReportTopicsCrud() {
    return this.makeCrudApiProvider<ReportTopic>({
      endpoint: 'v1/generic/report-topic',
    });
  }

  public getReportTemplatesCrud() {
    return this.makeCrudApiProvider<ReportTemplate>({
      parser: items => {
        return items.map(item => ({
          ...item,
          createdAt: new Date(item.createdAt),
          parameters: parameterSerde.deser(item.parameters),
        }));
      },
      serializer: item => ({ ...item, parameters: parameterSerde.ser(item.parameters) }),
      endpoint: 'v1/generic/report-template',
    });
  }

  public getSourcesCrud() {
    return this.makeCrudApiProvider<ReportSource>({
      endpoint: 'v1/generic/report-source',
    });
  }

  public getSourceDocDownloadUrl(item: ReportSourceDocument, download: boolean) {
    return `${this.appConfig.getApiBaseUrl()}/v1/report-source-documents/${item.id}/download${
      download ? '?download=1' : ''
    }`;
  }

  public getSourceDocsCrud() {
    return this.makeCrudApiProvider<ReportSourceDocument>({
      parser: items => {
        return items.map(item => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));
      },
      endpoint: 'v1/generic/report-source-documents',
      fields: ['id', 'title', 'name', 'mime', 'createdAt'],
    });
  }
}
