import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/plugins/i18n';
import AppLayout from '@/pages/layouts/AppLayout.vue';
const dashboardRoute: RouteRecordRaw = {
  path: '/dashboard',
  component: AppLayout,
  children: [
    {
      path: '',
      component: () => import('@/pages/dashboards/DashboardPage.vue'),
      name: 'dashboard',
      meta: {
        requireAuth: true,
        roles: [1],
        title: t('common.page.dashboard.title')
      }
    }
  ]
};

export default dashboardRoute;
