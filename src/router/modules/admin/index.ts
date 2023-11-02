import type { RouteRecordRaw } from 'vue-router';
import AppLayout from '@/pages/layouts/AppLayout.vue';
const adminRoute: RouteRecordRaw = {
  path: '/',
  name: 'exercise',
  component: AppLayout,
  children: [
    {
      path: '/exercise-create',
      name: "exercise-create",
      component: () => import("@/pages/admin/CreateExercise.vue")
    }
  ]
};

export default adminRoute;
