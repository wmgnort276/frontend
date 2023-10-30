import type { RouteRecordRaw } from 'vue-router';
import AppLayout from '@/pages/layouts/AppLayout.vue';
const userRoute: RouteRecordRaw = {
  path: '/',
  name: 'user',
  component: AppLayout,
  children: [
    {
      path: '/user/:name',
      name: "user-page",
      component: () => import("@/pages/user/UserPage.vue")
    }
  ]
};

export default userRoute;
