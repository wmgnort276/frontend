import type { RouteRecordRaw } from 'vue-router';
import AppLayout from '@/pages/layouts/AppLayout.vue';
const authRoute: RouteRecordRaw = {
  path: '/',
  name: 'auth',
  component: AppLayout,
  children: [
    {
      path: '/login-menu',
      component: () => import('@/pages/auth/LoginMenu.vue'),
      name: 'login-menu',
      meta: {
        requireAuth: false,
        title: 'Login menu'
      }
    },
    {
      path: '/login',
      component: () => import('@/pages/auth/LoginPage.vue'),
      name: 'login',
      meta: {
        requireAuth: false,
        title: 'Login'
      }
    },
    {
      path: '/login-hrOne',
      component: () => import('@/pages/auth/LoginHrOne.vue'),
      name: 'login-hrOne',
      meta: {
        requireAuth: false,
        title: 'Login'
      }
    },
    {
      path: '/login-faq',
      component: () => import('@/pages/auth/LoginFaq.vue'),
      name: 'login-faq',
      meta: {
        requireAuth: false,
        title: 'Login'
      }
    },
    {
      path: '/forgot-password',
      component: () => import('@/pages/auth/ForgotPasswordPage.vue'),
      name: 'forgot-password',
      meta: {
        requireAuth: false,
        title: 'Forgot Password'
      }
    },
    {
      path: '/change-password',
      component: () => import('@/pages/auth/ChangePasswordPage.vue'),
      name: 'change-password',
      meta: {
        requireAuth: false,
        title: 'Change password'
      }
    },
    {
      path: '/forgot-id',
      name: 'forgot-id',
      component: () => import('@/pages/auth/ForgotID.vue'),
      meta: {
        requireAuth: false,
        title: 'Forgot ID'
      }
    },
    {
      path: '/reset-password-success',
      component: () => import('@/pages/auth/ResetPasswordSuccessPage.vue'),
      name: 'reset-password-success',
      meta: {
        requireAuth: false,
        title: 'Reset password'
      },
      beforeEnter: (to, from, next) => {
        if (from.name !== 'forgot-password' && from.name !== 'forgot-id') {
          next('/login-menu');
        }
        next();
      }
    },
    {
      path: '/set-new-password/:id',
      name: 'set-new-password',
      component: () => import('@/pages/auth/SetNewPassword.vue'),
      meta: {
        requireAuth: false,
        title: 'Set New Password'
      }
    },
  ]
};

export default authRoute;
