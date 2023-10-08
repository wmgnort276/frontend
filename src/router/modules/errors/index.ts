import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/plugins/i18n';

const errorsRoute: RouteRecordRaw = {
  path: '/errors',
  children: [
    {
      path: '403',
      name: 'errors',
      component: () => import('@/pages/errors/403.vue'),
      meta: {
        title: t('common.page.user.title'),
        requireAuth: true
      }
    }
  ]
};

export default errorsRoute;
