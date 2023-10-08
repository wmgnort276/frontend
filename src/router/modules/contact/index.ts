import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/plugins/i18n';
import AppLayout from '@/pages/layouts/AppLayout.vue';

const contactRoute: RouteRecordRaw = {
  path: '/contact',
  name: 'contact',
  component: AppLayout,
  children: [
    {
      path: '',
      name: 'contactRegister',
      component: () => import('@/pages/contact/ContactRegister.vue'),
      meta: {
        title: t('contact.pageTitle')
        // role: [1],
        // requireAuth: true
      }
    },
    {
      path: 'preview',
      name: 'contactPreview',
      component: () => import('@/pages/contact/ContactPreview.vue'),
      meta: {
        title: t('contact.pageTitle')
        // role: [1],
        // requireAuth: true
      }
    },
    {
      path: 'success',
      name: 'contactSuccess',
      component: () => import('@/pages/contact/ContactSuccess.vue'),
      meta: {
        title: t('contact.pageTitle')
      }
    }
  ]
};

export default contactRoute;
