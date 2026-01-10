import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home'),
    meta: {},
  },
  {
    path: '/rentees',
    name: 'rentees.show',
    component: () => import('@/pages/rentees'),
    meta: {},
  },
];

export default routes;
