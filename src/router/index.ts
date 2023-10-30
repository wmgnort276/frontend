import { createRouter, createWebHistory } from 'vue-router';
import authRoute from '@/router/modules/auth';
import NProgress from '@/utils/progress';
import { useAuthStoreHook } from '@/stores/auth.store';
import errorsRoute from '@/router/modules/errors';
import LocalStorageService from '@/utils/localStorageService';
import homeRoute from './modules/home/home';
import userRoute from './modules/user'

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
  if(!WHITE_LIST_ROUTER_NAME.includes(to.path) && !localStorage.getItem("accessToken")) {
    return next("/login");
  }

  next();
})


//   const { isAuthenticated } = useAuthStoreHook();
//   const token = LocalStorageService.getAccessToken();
//   const useType = LocalStorageService.getUserType();

//   NProgress.start();

//   if (!useAuthStoreHook().isAuthenticated && token) {
//     await useAuthStoreHook().getAuthInfo();
//   }

//   if (to.path === '/login-menu') {
//     // if (
//     //   useType === USER_TYPE.MANAGER ||
//     //   useType === USER_TYPE.SYSTEM_ADMIN ||
//     //   useType === USER_TYPE.EMPLOYEE
//     // ) {
//     //   await router.push('/top');
//     // } else if (useType === USER_TYPE.FAQ) {
//     //   await router.push('/faq/search');
//     // }
//   }

//   if (to?.meta?.roles) {
//     const roles = to?.meta?.roles;
//     roles?.forEach((role) => {
//       // if ((role !== USER_TYPE.MANAGER && role != USER_TYPE.SYSTEM_ADMIN) && to.name === 'sharefiles-edit') {
//       //   return next('/sharefiles/search');
//       // }
//       return next();
//     });
//   }

//   if (!to?.meta?.requireAuth) {
//     if (WHITE_LIST_ROUTER_NAME.includes((to?.name as string) || '') && token) {
//       return next('/top');
//     }
//     if ((to?.name as string) === 'login-faq' && token) {
//       return next('/faq/search');
//     }
//     return next();
//   }
//   if (
//     ['login-menu', 'top'].includes((to?.name as string) || '') &&
//     token 
//     // &&
//     // useType === USER_TYPE.FAQ
//   ) {
//     return next('/faq/search');
//   }

//   if (!isAuthenticated && to?.meta?.requireAuth && !token) {
//     return next('/login-menu');
//   }
//   next();
// });

router.afterEach(() => {
  NProgress.done();
});
export default router;
