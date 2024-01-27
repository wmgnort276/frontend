import { createRouter, createWebHistory } from 'vue-router';
import authRoute from '@/router/modules/auth';
import NProgress from '@/utils/progress';
import { useAuthStoreHook } from '@/stores/auth.store';
import errorsRoute from '@/router/modules/errors';
import LocalStorageService from '@/utils/localStorageService';
import homeRoute from './modules/home/home';
import userRoute from './modules/user'
import adminRoute from './modules/admin';
import localStorageService from '@/utils/localStorageService';

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

const listAdminRoute = ['/exercise-create', '/exercise-edit', '/compiler']

router.beforeEach(async (to, from, next) => {
  if (!WHITE_LIST_ROUTER_NAME.includes(to.path) && !localStorage.getItem("accessToken")) {
    return next("/login");
  }

  const token = LocalStorageService.getAccessToken();
  const { isAuthenticated } = useAuthStoreHook();

  if (!isAuthenticated && token) {
    try {
      await useAuthStoreHook().getAuthInfo();
    } catch (error) {
      localStorageService.clearAccessToken();
    }
  }

  if (!useAuthStoreHook().isAdmin && listAdminRoute.includes(to.path)) {
    return next("/home");
  }

  next();
})


router.afterEach(() => {
  NProgress.done();
});
export default router;
