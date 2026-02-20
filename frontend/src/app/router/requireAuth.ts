import type { RouteLocationNormalizedGeneric } from 'vue-router';

import { useAuthStore } from '@/shared/store';

export const requireAuth = (to: RouteLocationNormalizedGeneric) => {
  const { isAuthorized } = useAuthStore();

  if (!isAuthorized && to.name !== 'login.show') {
    return { path: '/login' };
  } else if (isAuthorized && to.name === 'login.show') {
    return { name: 'home.show' };
  } else {
    return true;
  }
};
