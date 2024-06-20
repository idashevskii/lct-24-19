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

const schemaSources: FormKitSchemaNode[] = [
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
];

const schemaField: FormKitSchemaNode[] = [
  {
    $formkit: 'text',
    name: 'field',
    label: 'Сфера деятельности',
    help: 'Примеры: Металургическая комапания, Нефтедобывающее предприятие',
    value: 'ИТ-компания',
  },
];

const schemaCompany: FormKitSchemaNode[] = [
  { $formkit: 'text', name: 'company', label: 'Компания', value: 'GitHub' },
];

// const dateRange: FormKitSchemaNode[] = [
//   { $formkit: 'date', name: 'date_from', label: 'Дата, от', value: formatDate(new Date()) },
//   { $formkit: 'date', name: 'date_to', label: 'Дата, по', value: formatDate(new Date()) },
// ];

const schemaEmployeeGrade: FormKitSchemaNode[] = [
  {
    $formkit: 'select',
    name: 'employee_grade',
    label: 'Ранг сотрудника',
    options: [
      'Генеральный директор',
      'Экономический директор',
      'Финансовый директор',
      'Начальник отдела маркетинга',
      'Начальник отдела кадров',
      'Начальник отдела информации',
      'Начальник отдела закупок',
    ],
  },
];

export const templateSchemas: Record<string, FormKitSchemaNode[]> = {
  CUSTOM: [
    ...schemaSources,
    {
      $formkit: 'textarea',
      name: 'prompt',
      label: 'Запрос',
      help: 'Запрос к LLM в свободной форме',
      value: '',
    },
  ],
  INNOVATION_NEWS: [
    ...schemaSources,
    ...schemaField,
    ...schemaCompany,
    ...schemaEmployeeGrade,
    {
      $formkit: 'select',
      name: 'importance',
      label: 'Важность',
      options: ['Кратко', 'Подробно'],
      help: 'Пояснение важности для области',
      value: 'Кратко',
    },
    {
      $formkit: 'number',
      name: 'news_amount',
      label: 'Количество новостей',
      number: 'integer',
      value: 5,
    },
    { $formkit: 'date', name: 'date', label: 'Новости на дату', value: formatDate(new Date()) },
  ],
  COMPETITOR_REVIEW: [
    ...schemaSources,
    ...schemaCompany,
    ...schemaEmployeeGrade,
    { $formkit: 'date', name: 'date', label: 'Начальная дата', value: formatDate(new Date()) },
    {
      $formkit: 'select',
      name: 'report_length',
      label: 'Подробность отчёта',
      options: ['Краткий', 'Средний', 'Подробный'],
      value: 'Краткий',
    },
    {
      $formkit: 'textarea',
      name: 'competitor_urls',
      label: 'Сайты конкурента',
      help: 'По одному на каждой строке',
      value: 'https://github.com/\nhttps://google.com/',
    },
  ],
  COMPETITORS_REVIEW: [
    ...schemaSources,
    ...schemaField,
    ...schemaCompany,
    ...schemaEmployeeGrade,
    { $formkit: 'date', name: 'date', label: 'Начальная дата', value: formatDate(new Date()) },
    {
      $formkit: 'select',
      name: 'company_location',
      label: 'Расположение компании',
      options: ['Россия', 'Россия, СНГ', 'Зарубежные', 'Зарубежные, Азия'],
      value: 'Россия',
    },
    {
      $formkit: 'text',
      name: 'specific_products',
      label: 'Продукция',
      help: 'Пример: Упаковка, Автомобильные шины, Гвозди',
      value: 'Стальные листы, Рельсы',
    },
    {
      $formkit: 'select',
      name: 'report_length',
      label: 'Подробность отчёта',
      options: ['Краткий', 'Средний', 'Подробный'],
      value: 'Кратко',
    },
    {
      $formkit: 'textarea',
      name: 'competitor_urls',
      label: 'Сайты конкурентов',
      help: 'По одному на каждой строке',
      value: 'https://github.com/\nhttps://google.com/',
    },
  ],
  PRODUCT_COMPARISON: [
    ...schemaSources,
    ...schemaField,
    { $formkit: 'date', name: 'date', label: 'Начальная дата', value: formatDate(new Date()) },
    {
      $formkit: 'textarea',
      name: 'products',
      label: 'Продукты и услуги на анализ',
      help: 'Пример: Металлические балки, IT, Заводские помещения',
      value:
        '1. Горячекатаная сталь\n2. Холоднокатаная сталь\n3. Оцинкованная сталь\n4. Прокат с покрытием\n5. Трансформаторная сталь',
    },
    {
      $formkit: 'textarea',
      name: 'criteries',
      label: 'Критерии анализа продуктов и услуг',
      help: 'Пример: Качество продукции, Производственные мощности, Экологичность',
      value:
        '1. Ценовая политика: Конкурентоспособность цен на рынке. (руб)\n2.  Логистика и дистрибуция: Возможности доставки и географическое покрытие.\n3.  Финансовые показатели: Выручка, чистая прибыль, рентабельность. (руб)',
    },
    {
      $formkit: 'text',
      name: 'to_compare_companies',
      label: 'Компании для сравнения продуктов и услуг',
      help: 'Пример: Северсталь и НЛМК',
      value: 'Северсталь, НЛМК',
    },
    {
      $formkit: 'textarea',
      name: 'report_structure',
      label: 'Структура отчёта о сравнении',
      help: 'Пример: 1. Продукт.\n2. Сравнительная таблица продукта.\n3. Краткий вывод',
      value:
        '(Для каждого продукта) \n1. Название продукта\n\n(Для каждого критерия)\n2. Название критерия.\n3. Сравнительная таблица продукта для компании 1 и компании 2.\n4. Краткий вывод о продукте в обеих компаниях.\n',
    },
    {
      $formkit: 'textarea',
      name: 'product_links',
      label: 'Ссылки на исследование',
      help: 'По одной ссылке в строку',
      value:
        'https://severstal.com/rus/clients/products-catalog/\nhttps://nlmk.com/ru/our-business/products-and-innovations/products/',
    },
  ],
  MARKET_ANALYSIS: [
    ...schemaSources,
    ...schemaEmployeeGrade,
    { $formkit: 'date', name: 'date', label: 'Начальная дата', value: formatDate(new Date()) },
    {
      $formkit: 'select',
      name: 'report_length',
      label: 'Подробность отчёта',
      options: ['Краткий', 'Средний', 'Подробный'],
      value: 'Краткий',
    },
    {
      $formkit: 'text',
      name: 'market',
      label: 'Название отрасли на анализ',
      help: 'К примеру: IT, Металлургия, Авиаперевозки',
      value: 'IT',
    },
    {
      $formkit: 'textarea',
      name: 'competitor_urls',
      label: 'Сайты на анализ отрасли',
      help: 'По одному на каждой строке',
      value: 'https://github.com/\nhttps://google.com/',
    },
  ],
  [DEFAULT_SCHEMA]: [...schemaSources],
};

export const templateIcons: Record<string, string> = {
  [DEFAULT_SCHEMA]: mdiChartBoxOutline,
  CUSTOM: mdiAccountDetails,
  INNOVATION_NEWS: mdiNewspaper,
  MARKET_ANALYSIS: mdiChartLine,
  COMPETITOR_REVIEW: mdiCompare,
};
