import type { RouteRecordRaw } from 'vue-router';
import AppLayout from '@/pages/layouts/AppLayout.vue';
const homeRoute: RouteRecordRaw = {
  path: '/',
  name: 'home',
  component: AppLayout,
  children: [
    {
      path: '/home',
      name: 'home1',
      component: () => import("@/pages/home/HomePage.vue")
    },
    {
      path: '/compiler',
      name: 'compiler',
      component: () => import("@/pages/home/Compiler.vue")
    },
    {
      path: '/exercises',
      name: 'exercises',
      component: () => import("@/pages/home/Exercise.vue")
    }
  ]
};

export default homeRoute;
