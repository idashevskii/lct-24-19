export const ROUTE_REPORT = 'report'

export const routes = [
  { path: '/', redirect: '/reports' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: '/dashboard/analytics',
        component: () => import('@/pages/dashboard.vue'),
      },

      {
        path: 'reports',
        component: () => import('@/views/ReportsView.vue'),
      },

      {
        path: 'settings/account',
        component: () => import('@/pages/account-settings.vue'),
      },

      {
        path: 'settings/3rd-party',
        component: () => import('@/views/ApiSettingsView.vue'),
      },

      {
        path: 'sources/urls',
        component: () => import('@/views/SourcesView.vue'),
      },
      {
        path: 'sources/documents',
        component: () => import('@/views/SourceDocumentsView.vue'),
      },

      {
        name: ROUTE_REPORT,
        path: 'report/:id',
        component: () => import('@/views/ReportView.vue'),
      },
      {
        path: 'templates',
        component: () => import('@/views/ReportTemplatesView.vue'),
      },

      {
        path: 'help/faq',
        component: () => import('@/views/FaqView.vue'),
      },

      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
      },
      {
        path: 'icons',
        component: () => import('@/pages/icons.vue'),
      },
      {
        path: 'cards',
        component: () => import('@/pages/cards.vue'),
      },
      {
        path: 'tables',
        component: () => import('@/pages/tables.vue'),
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
