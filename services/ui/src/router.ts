import { createRouter, createWebHistory } from 'vue-router';

export const Route = {
  DASHBOARD: 'DASHBOARD',
  FAQ: 'FAQ',
  REPORTS: 'REPORTS',
  REPORT: 'REPORT',
  REPORT_TEMPLATES: 'REPORT_TEMPLATES',
  SOURCE_URLS: 'SOURCE_URLS',
  SOURCE_DOCS: 'SOURCE_DOCS',
  USER_PROFILE: 'USER_PROFILE',
  API_SETTINGS: 'API_SETTINGS',
  DOCS: 'DOCS',
};

const makeRoute = (name: string, path: string, component: () => Promise<unknown>) => {
  return { path, name, component };
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    makeRoute(Route.DASHBOARD, '/', () => import('@/views/DashboardView.vue')),
    makeRoute(Route.REPORTS, '/reports', () => import('@/views/ReportsView.vue')),
    makeRoute(Route.REPORT, '/report/:id', () => import('@/views/ReportView.vue')),
    makeRoute(
      Route.REPORT_TEMPLATES,
      '/report-templates',
      () => import('@/views/ReportTemplatesView.vue'),
    ),
    makeRoute(Route.FAQ, '/faq', () => import('@/views/FaqView.vue')),
    makeRoute(Route.SOURCE_URLS, '/source-urls', () => import('@/views/SourcesView.vue')),
    makeRoute(Route.SOURCE_DOCS, '/source-documents', () => import('@/views/SourceDocumentsView.vue')),
    makeRoute(Route.USER_PROFILE, '/settings/profile', () => import('@/views/UserProfileView.vue')),
    makeRoute(Route.API_SETTINGS, '/settings/saas', () => import('@/views/ApiSettingsView.vue')),
    makeRoute(Route.DOCS, '/docs', () => import('@/views/DocsView.vue')),
  ],
});

export default router;
