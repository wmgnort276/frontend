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
        title: "Not found!",
        requireAuth: true
      }
    }
  ]
};

export default errorsRoute;
