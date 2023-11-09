import { createRouter, createWebHistory } from 'vue-router';
import authRoute from '@/router/modules/auth';
import NProgress from '@/utils/progress';
import { useAuthStoreHook } from '@/stores/auth.store';
import errorsRoute from '@/router/modules/errors';
import LocalStorageService from '@/utils/localStorageService';
import homeRoute from './modules/home/home';
import userRoute from './modules/user'
import adminRoute from './modules/admin';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    errorsRoute,
    authRoute,
    homeRoute,
    userRoute,
    adminRoute,
    {
      path: '/not-found',
      component: () => import('@/pages/errors/404.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/pages/errors/404.vue')
    }
  ]
});

const WHITE_LIST_ROUTER_NAME = ['/login', '/forgot-password', '/signup'];

router.beforeEach(async (to, from, next) => {
  if (!WHITE_LIST_ROUTER_NAME.includes(to.path) && !localStorage.getItem("accessToken")) {
    return next("/login");
  }

  const token = LocalStorageService.getAccessToken();
  const { isAuthenticated } = useAuthStoreHook();

  if (!isAuthenticated && token) {
    await useAuthStoreHook().getAuthInfo();
  }

  next();
})


router.afterEach(() => {
  NProgress.done();
});
export default router;
