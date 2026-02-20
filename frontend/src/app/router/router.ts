import { createRouter, createWebHistory } from 'vue-router';

import routes from './routes';
import { requireAuth } from './requireAuth';

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'link--active',
  linkExactActiveClass: 'link--active',
});

router.beforeEach((to) => {
  return requireAuth(to);
});

export default router;
