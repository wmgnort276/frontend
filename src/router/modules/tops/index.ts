import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/plugins/i18n';
import AppLayout from '@/pages/layouts/AppLayout.vue';
import router from '@/router';
import LocalStorageService from '@/utils/localStorageService';
import { USER_TYPE } from '@/stores/constants/constant';

const topRoute: RouteRecordRaw = {
  path: '/',
  name: 'top',
  component: AppLayout,
  children: [
    {
      path: 'top',
      name: 'top',
      component: function () {
        const useType = LocalStorageService.getUserType();

        if (useType === USER_TYPE.MANAGER || useType === USER_TYPE.SYSTEM_ADMIN) {
          return import('@/pages/tops/TopMenuManager.vue');
        } else if (useType === USER_TYPE.FAQ) {
          router.push('/faq/search');
          return;
        } else {
          return import('@/pages/tops/TopMenuEmployee.vue');
        }
      },
      meta: {
        title: t('top.request.title'),
        requireAuth: true
      }
    },
    {
      path: 'top/menu',
      name: 'top-menu',
      component: () => import('@/pages/tops/TopMenuManager.vue'),
      meta: {
        title: t('top.request.title'),
        requireAuth: true
      }
    }
  ]
};

export default topRoute;
