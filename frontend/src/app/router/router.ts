import { createRouter, createWebHistory } from 'vue-router';

import routes from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'link--active',
  linkExactActiveClass: 'link--active',
});

export default router;
