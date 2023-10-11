import type { RouteRecordRaw } from 'vue-router';
import AppLayout from '@/pages/layouts/AppLayout.vue';
const homeRoute : RouteRecordRaw = {
  path: '/',
  name: 'home',
  component: AppLayout,
  children: [
    {
      path: '/home',
      name: "home",
      component: () => import("@/pages/home/HomePage.vue")
    }
  ]
};

export default homeRoute;
