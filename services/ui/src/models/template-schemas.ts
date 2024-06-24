import { formatDate } from '@/utils/dates';
import { type FormKitSchemaNode } from '@formkit/core';
import {
  mdiAccountDetails,
  mdiChartBoxOutline,
  mdiChartLine,
  mdiCompare,
  mdiNewspaper,
} from '@mdi/js';

export const DEFAULT_SCHEMA = 'DEFAULT';
export const SOURCES_ELEMENT = 'sources';
export const SOURCE_DOCS_ELEMENT = 'source_docs';

export const defaultSchema=[
  {
    $formkit: 'select',
    name: SOURCES_ELEMENT,
    label: 'Источники',
    options: [],
    help: 'Веб-сайты и другие источники в Интернете',
    multiple: true,
  },
  {
    $formkit: 'select',
    name: SOURCE_DOCS_ELEMENT,
    label: 'Документы-источники',
    options: [],
    help: 'Предварительно загруженные документы',
    multiple: true,
  },
]

export const templateIcons: Record<string, string> = {
  [DEFAULT_SCHEMA]: mdiChartBoxOutline,
  CUSTOM: mdiAccountDetails,
  INNOVATION_NEWS: mdiNewspaper,
  MARKET_ANALYSIS: mdiChartLine,
  COMPETITOR_REVIEW: mdiCompare,
};
