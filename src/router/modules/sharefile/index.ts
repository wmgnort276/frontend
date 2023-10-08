import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/plugins/i18n';
import AppLayout from '@/pages/layouts/AppLayout.vue';
import { USER_TYPE } from '@/stores/constants/constant';

const sharefileRoute: RouteRecordRaw = {
  path: '/',
  name: 'sharefiles',
  component: AppLayout,
  children: [
    {
      path: 'sharefiles/search',
      name: 'sharefiles-search',
      component: () => import('@/pages/sharefiles/Search.vue'),
      meta: {
        title: t('faq.common.title'),
        requireAuth: true
        // role: [1],
      }
    },
    {
      path: 'sharefiles/create',
      name: 'sharefiles-create',
      component: () => import('@/pages/sharefiles/CreateShareFile.vue'),
      meta: {
        title: t('faq.common.title'),
        requireAuth: true
        // role: [1],
      }
    },
    {
      path: 'sharefiles/edit',
      name: 'sharefiles-edit',
      component: () => import('@/pages/sharefiles/EditShareFile.vue'),
      meta: {
        title: t('faq.common.title'),
        requireAuth: true,
        roles: [USER_TYPE.MANAGER] || [USER_TYPE.SYSTEM_ADMIN]
      }
    },
    {
      path: 'sharefiles/download',
      name: 'sharefiles-download',
      component: () => import('@/pages/sharefiles/DownloadShareFile.vue'),
      meta: {
        title: t('faq.common.title')
        // role: [1],
      }
    },
    {
      path: 'sharefiles/detail',
      name: 'sharefiles-detail',
      component: () => import('@/pages/sharefiles/ShareFileDetail.vue'),
      meta: {
        title: t('faq.common.title'),
        requireAuth: true,
        roles: [USER_TYPE.MANAGER] || [USER_TYPE.SYSTEM_ADMIN]
      }
    }
  ]
};

export default sharefileRoute;
