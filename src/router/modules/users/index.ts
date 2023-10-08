import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/plugins/i18n';
import AppLayout from '@/pages/layouts/AppLayout.vue';

const usersRoute: RouteRecordRaw = {
  path: '/users',
  name: 'users',
  component: AppLayout,
  children: [
    {
      path: '',
      name: 'users-index',
      component: () => import('@/pages/users/UserPage.vue'),
      meta: {
        title: t('common.page.user.title'),
        role: [1],
        requireAuth: true
      }
    }
  ]
};

export default usersRoute;
