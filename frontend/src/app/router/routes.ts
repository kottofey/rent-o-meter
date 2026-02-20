import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home.show',
    component: () => import('@/pages/home'),
    meta: {},
  },
  {
    path: '/agreements',
    name: 'agreements.show',
    component: () => import('@/pages/agreements'),
    meta: {},
  },
  {
    path: '/bills',
    name: 'bills.show',
    component: () => import('@/pages/bills'),
    meta: {},
  },
  {
    path: '/counters',
    name: 'counters.show',
    component: () => import('@/pages/counters'),
    meta: {},
  },
  {
    path: '/rentees',
    name: 'rentees.show',
    component: () => import('@/pages/rentees'),
    meta: {},
  },
  {
    path: '/tarifs',
    name: 'tarifs.show',
    component: () => import('@/pages/tarifs'),
    meta: {},
  },
  {
    path: '/login',
    name: 'login.show',
    component: () => import('@/pages/auth'),
  },
];

export default routes;
