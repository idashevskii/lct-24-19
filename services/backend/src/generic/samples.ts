import {
  Report,
  ReportSource,
  ReportTemplate,
  ReportTopic,
} from 'src/report/entities/report.entity';

const sampleTopics: ReportTopic[] = [
  {
    id: 1,
    title: 'Анализ новостей по инновационной деятельности компаний',
    code: 'INNOVATION_NEWS',
  },
  {
    id: 2,
    title: 'Анализ рынка',
    code: 'MARKET_ANALYSIS',
  },
  {
    id: 3,
    title: 'Обзор по предприятию-конкуренту',
    code: 'COMPETITOR_REVIEW',
  },
  {
    id: 4,
    title: 'Сравнение продуктов и услуг',
    code: 'PRODUCT_COMPARISON', 
  },
  {
    id: 5,
    title: 'Обзор по предприятиям-конкурентам',
    code: 'COMPETITORS_REVIEW',
  },
  {
    id: 42,
    title: 'Пользовательский запрос',
    code: 'CUSTOM',
  },
].map((item, i) => ({ ...item, createdAt: new Date() }));

const sampleSources: ReportSource[] = [
  {
    title: '36Kr',
    url: 'https://36kr.com',
    description:
      'Ведущая китайская платформа для новостей о технологиях и стартапах.',
  },
  {
    title: 'EdTech Magazine',
    url: 'https://edtechmagazine.com',
    description: 'Идеи и тренды в области образовательных технологий.',
  },
  {
    title: 'Habr',
    url: 'https://habr.com',
    description:
      'Российская платформа для техноэнтузиастов, созданная пользователями.',
  },
  {
    title: 'Rusbase',
    url: 'https://rusbase.com',
    description:
      'Российский новостной портал, сосредоточенный на стартапах и бизнесе.',
  },
  {
    title: 'Startup.ru',
    url: 'https://startup.ru',
    description: 'Ресурсы и новости для российской стартап-экосистемы.',
  },
  {
    title: 'TechCrunch',
    url: 'https://techcrunch.com',
    description: 'Глобальный источник новостей о стартапах и технологиях.',
  },
  {
    title: 'Tech.eu',
    url: 'https://techeu.com',
    description: 'Европейская платформа новостей о технологиях и стартапах.',
  },
  {
    title: 'TechNode',
    url: 'https://technode.com',
    description:
      'Китайские медиа о технологиях, охватывающие стартапы и инновации.',
  },
  {
    title: 'VC.ru',
    url: 'https://vc.ru',
    description:
      'Российский портал для новостей стартапов и индустрии технологий.',
  },
  {
    title: 'VentureBeat',
    url: 'https://venturebeat.com',
    description: 'Ведущий источник новостей о трансформирующих технологиях.',
  },
  {
    title: 'Bloomberg',
    url: 'https://www.bloomberg.com',
    description: 'Комплексные мировые новости о бизнесе и финансах.',
  },
  {
    title: 'Business Insider',
    url: 'https://www.businessinsider.com',
    description: 'Бизнес-новости и анализ глобальных трендов.',
  },
  {
    title: 'CIO',
    url: 'https://www.cio.com',
    description: 'Новости и инсайты о технологиях для IT-лидеров.',
  },
  {
    title: 'CNews',
    url: 'https://www.cnews.ru',
    description: 'Российский портал для новостей в IT и бизнесе.',
  },
  {
    title: 'ComNews',
    url: 'https://www.comnews.ru',
    description: 'Российский новостной сайт для IT и телекоммуникаций.',
  },
  {
    title: 'Computerworld',
    url: 'https://www.computerworld.com',
    description: 'Новости IT, анализы и руководства для профессионалов.',
  },
  {
    title: 'Digital Trends',
    url: 'https://www.digitaltrends.com',
    description:
      'Последние новости в области технологий, гаджетов и потребительской электроники.',
  },
  {
    title: 'EdSurge',
    url: 'https://www.edsurge.com',
    description: 'Новости и ресурсы об образовательных технологиях.',
  },
  {
    title: 'Forbes Technology',
    url: 'https://www.forbes.com/technology',
    description: 'Глубокие новости и анализы технологий от Forbes.',
  },
  {
    title: 'Interfax',
    url: 'https://www.interfax.ru',
    description:
      'Крупное российское информационное агентство, освещающее различные темы.',
  },
  {
    title: 'IT Pro Today',
    url: 'https://www.itprotoday.com',
    description: 'Новости и инсайты о технологиях для IT-профессионалов.',
  },
  {
    title: 'Коммерсантъ',
    url: 'https://www.kommersant.ru',
    description: 'Российская ежедневная газета с акцентом на бизнес-новости.',
  },
  {
    title: 'PSFK',
    url: 'https://www.psfk.com',
    description:
      'Новости об инновациях в розничной торговле и потребительском опыте.',
  },
  {
    title: 'РБК',
    url: 'https://www.rbc.ru',
    description:
      'Ведущая российская платформа бизнес- и экономических новостей.',
  },
  {
    title: 'Springwise',
    url: 'https://www.springwise.com',
    description: 'Глобальная платформа для инновационных бизнес-идей.',
  },
  {
    title: 'TAdviser',
    url: 'https://www.tadviser.ru',
    description: 'Российские новости в области IT и бизнес-технологий.',
  },
  {
    title: 'ТАСС',
    url: 'https://www.tass.ru',
    description:
      'Крупное российское информационное агентство, освещающее национальные и мировые события.',
  },
  {
    title: 'The Verge',
    url: 'https://www.theverge.com',
    description: 'Новости технологий, науки, искусства и культуры.',
  },
  {
    title: 'Ведомости',
    url: 'https://www.vedomosti.ru',
    description:
      'Российская бизнес-ежедневная газета с комплексным освещением.',
  },
  {
    title: 'Wunderman Thompson',
    url: 'https://www.wundermanthompson.com',
    description: 'Инсайты о маркетинге, инновациях и цифровой трансформации.',
  },
  {
    title: 'ZDNet',
    url: 'https://www.zdnet.com',
    description: 'Новости технологий, анализы и обзоры продуктов.',
  },
].map((item, i) => ({
  ...item,
  id: i + 1,
  authRequred: false,
  available: true,
  authCredentials: null,
  checkedAt: new Date(),
  createdAt: new Date(),
}));

const sampleTemplates: ReportTemplate[] = [
  {
    id: 1,
    title: 'Новости по Yandex',
    topicId: 1,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    parameters: JSON.stringify({
      sources: [
        'https://habr.com',
        'https://rusbase.com',
        'https://startup.ru',
        'https://technode.com',
        'https://vc.ru',
        'https://www.cnews.ru',
        'https://www.comnews.ru',
        'https://www.computerworld.com',
        'https://www.digitaltrends.com',
      ],
      field: 'ИТ-компания',
      company: 'Yandex',
      employee_grade: 'Начальник отдела маркетинга',
      importance: 'Подробно',
      news_amount: 3,
      date: '2000-06-15',
    }),
  },
  {
    id: 2,
    title: 'Анализ конкурентов по металл. компаниям',
    topicId: 3,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    parameters: JSON.stringify({
      sources: [
        'https://technode.com',
        'https://vc.ru',
        'https://www.kommersant.ru',
        'https://www.rbc.ru',
        'https://www.tadviser.ru',
      ],
      field: 'Металлургическая компания',
      company: 'Металл Про',
      employee_grade: 'Экономический директор',
      date: '2022-01-15',
      company_location: 'Зарубежные',
      specific_products: 'Стальные листы, Рельсы',
      report_length: 'Краткий',
      competitor_urls: [
        'https://nlmk.com/ru/media-center/',
        'https://mmk.ru/ru/press-center/',
        'https://www.evraz.com/ru/news-and-media/',
        'https://www.metalloinvest.com/media/news/',
        'https://corporate.arcelormittal.com/media/news',
        'https://newsroom.posco.com/en/',
        'https://www.nipponsteel.com/news/index.html',
      ].join('\n'),
    }),
  },
  {
    id: 3,
    title: 'Сравнительный анализ основной продукции Северсталь и НЛМК',
    topicId: 4,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    parameters: JSON.stringify({
      field: "Металлургическая компания",
      products: "1. Горячекатаная сталь\n2. Холоднокатаная сталь\n3. Оцинкованная сталь\n4. Прокат с покрытием\n5. Трансформаторная сталь",
      to_compare_companies: "Северсталь, НЛМК",
      criteries: "1. Ценовая политика: Конкурентоспособность цен на рынке. (руб)\n2.  Логистика и дистрибуция: Возможности доставки и географическое покрытие.\n3.  Финансовые показатели: Выручка, чистая прибыль, рентабельность. (руб)",
      date: "1970-01-01",
      report_structure: "(Для каждого продукта) \n1. Название продукта\n(Для каждого критерия)\n2. Название критерия.\n3. Сравнительная таблица продукта для компании 1 и компании 2.\n4. Краткий вывод о продукте в обеих компаниях.\n",
      product_links: [
        'http://www.tc-evraz.com/sites/tdeam.ru/files/Evraz_catalog_2021_new_compressed.pdf',
        'https://tmc.evraz.com/?hello_token=0',                                               
        'https://evrazsteelengineering.ru/products/',                                         
        'https://evraz.market/',                                                              
        'https://mbn-market.ru/brands/evraz/?utm_referrer=https%3A%2F%2Fyandex.ru%2F',        
        'https://hardhub.ru/articles/metallurgicheskie-kompanii/evraz/',                      
    
        'https://nlmk.com/ru/products/',                                                      
        'https://nlmk.com/ru/our-business/products-and-innovations/products/',                
        'https://nlmk.shop/',
        'https://steelprokat.ru/upload/iblock/b40/b40385a159c8e98a931632714d419a33.pdf',
        'https://mbn-market.ru/brands/nlmk/',
    
        'https://mmk.ru/ru/products/',                                                        
        'https://hardhub.ru/articles/metallurgicheskie-kompanii/pao-magnitogorskiy-metallurgicheskiy-kombinat/',
    
        'https://products.metalloinvest.com/',                                                
        'https://products.metalloinvest.com/catalog/',
    
        'https://europe.arcelormittal.com/europeproducts/productshomepage',                   
        'https://лидеркровля.рф/manufacturer/arcelor',                                        
    
        'https://www.posco.com.pl/en/products/',                                              
        'http://product.posco.com/homepage/product/eng/jsp/s91m0000001i.jsp',                 
        'https://ru.made-in-china.com/tag_search_product/Posco_ysuhnign_1.html',              
    
        'https://www.nipponsteel.com/product/',                                               
    ].join('\n'),
    }),
  },

  // {
  //   id: 2,
  //   title: 'Краткий рыночный анализ 1.0',
  //   topicId: 2,
  //   createdAt: new Date('2023-01-01T00:00:00.000Z'),
  // },
  // {
  //   id: 3,
  //   title: 'Общие новости по Севсталь',
  //   topicId: 3,
  //   createdAt: new Date('2023-01-01T00:00:00.000Z'),
  // },
  // {
  //   id: 4,
  //   title: 'Сравнение продукции мет. компаний 3.0',
  //   topicId: 4,
  //   createdAt: new Date('2024-01-01T00:00:00.000Z'),
  // },
  // {
  //   id: 5,
  //   title: 'Сравнение услуг перевозчиков 5.1',
  //   topicId: 4,
  //   createdAt: new Date('2021-01-01T00:00:00.000Z'),
  // },
  // {
  //   id: 6,
  //   title: 'Сравнение технологий холодной сварки 3.1',
  //   topicId: 5,
  //   createdAt: new Date('2022-01-01T00:00:00.000Z'),
  // },
];

const sampleReports: Report[] = [
  // {
  //   id: 1,
  //   title: 'Короткие новости по Yandex за 2023',
  //   templateId: 1,
  //   createdAt: new Date('2023-01-01T00:00:00Z'),
  // },
  // {
  //   id: 4,
  //   title: 'Сравнение марок нержавеющей стали 2024',
  //   templateId: 4,
  //   createdAt: new Date('2024-01-01T00:00:00Z'),
  // },
  // {
  //   id: 3,
  //   title: 'Рынок облачных сервисов и ERP систем 2017-2024',
  //   templateId: 3,
  //   createdAt: new Date('2024-01-01T00:00:00Z'),
  // },
  // {
  //   id: 2,
  //   title: 'Обзор конкурентов по меди за 2023',
  //   templateId: 2,
  //   createdAt: new Date('2023-01-01T00:00:00Z'),
  // },
  // {
  //   id: 5,
  //   title: 'Сравнение перевозок токсичных катализаторов 2021',
  //   templateId: 5,
  //   createdAt: new Date('2021-01-01T00:00:00Z'),
  // },
  // {
  //   id: 6,
  //   title: 'Сравнение ультразвуковой дефектоскопии 2019-2022',
  //   templateId: 6,
  //   createdAt: new Date('2022-01-01T00:00:00Z'),
  // },
  // {
  //   id: 7,
  //   title: 'Обзор конкурентов по меди за 2024',
  //   templateId: 2,
  //   createdAt: new Date('2024-01-01T00:00:00Z'),
  // },
  // {
  //   id: 8,
  //   title: 'Обзор конкурентов по меди за 2019',
  //   templateId: 2,
  //   createdAt: new Date('2019-01-01T00:00:00Z'),
  // },
];

export const samples = {
  'report-source': sampleSources,
  'report-topic': sampleTopics,
  'report-template': sampleTemplates,
  report: sampleReports,
};
