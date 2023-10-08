import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/plugins/i18n';
import AppLayout from '@/pages/layouts/AppLayout.vue';
import LocalStorageService from '@/utils/localStorageService';
import { USER_TYPE } from '@/stores/constants/constant';
import router from '@/router';
import { message } from 'ant-design-vue';
const faqRoute: RouteRecordRaw = {
  path: '/',
  name: 'faq',
  component: AppLayout,
  children: [
    {
      path: 'faq/search',
      name: 'faq-search',
      component: () => import('@/pages/faq/FAQSearch.vue'),
      meta: {
        title: t('faq.common.title'),
        // role: [1],
        requireAuth: true
      }
    },
    {
      path: 'faq/export',
      name: 'faq-export',
      component: () => import('@/pages/faq/Export.vue'),
      meta: {
        title: t('faq.common.title'),
        // role: [1],
        requireAuth: true
      }
    },
    {
      path: 'faq/preview',
      name: 'faq-preview',
      component: () => import('@/pages/faq/FAQPreview.vue'),
      meta: {
        title: 'FAQDetails',
        requireAuth: true
      }
    },
    {
      path: 'faq/create',
      name: 'faq-create',
      component: () => import('@/pages/faq/FAQCreate.vue'),
      meta: {
        title: 'FQA create',
        requireAuth: true
      }
    },
    {
      path: '/faq/detail',
      name: 'FQADetails',
      component: () => import('@/pages/faq/FAQDetails.vue'),
      meta: {
        title: 'FQADetails',
        requireAuth: true
      }
    },
    {
      path: 'faq/upload',
      name: 'faq-upload',
      component: () => import('@/pages/faq/BulkUpload.vue'),
      meta: {
        title: 'Upload FAQ',
        requireAuth: true
      }
    },
    {
      path: 'faq/preview-upload',
      name: 'faq-preview-upload',
      component: function () {
        const useType = LocalStorageService.getUserType();
        if (useType === USER_TYPE.MANAGER || useType === USER_TYPE.SYSTEM_ADMIN) {
          return import('@/pages/faq/PreviewUpload.vue');
        } else if (useType === USER_TYPE.FAQ) {
          message.error(t('faq-detail.user_not_permission'));
          router.push('/faq/search');
        } else {
          message.error(t('faq-detail.user_not_permission'));
          router.push('/top');
        }
      },
      meta: {
        title: 'Upload FAQ',
        requireAuth: true
      }
    },
    {
      path: 'faq/update/:id',
      name: 'faq-update',
      component: () => import('@/pages/faq/FAQUpdate.vue'),
      meta: {
        title: 'Update FAQ',
        requireAuth: true
      }
    },
    {
      path: 'faq/search-result',
      name: 'faq-search-result',
      component: () => import('@/pages/faq/FAQSearchResult.vue'),
      meta: {
        title: t('faq.common.title'),
        // role: [1],
        requireAuth: true
      }
    },
    {
      path: 'faq/preview-update',
      name: 'faq-preview-update',
      component: () => import('@/pages/faq/FAQUpdatePreview.vue'),
      meta: {
        title: 'FAQ Update Details',
        requireAuth: true
      }
    },
    {
      path: 'faq/search-category',
      name: 'faq-search-category',
      component: () => import('@/pages/faq/FAQSearchCategory.vue'),
      meta: {
        title: t('faq.common.title'),
        // role: [1],
        requireAuth: true
      }
    },
  ]
};

export default faqRoute;
