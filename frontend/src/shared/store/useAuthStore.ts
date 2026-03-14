import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { type IUser } from '@/entities/user';
export const useAuthStore = defineStore('auth', () => {
  // -----------------------------------------------------------------------------
  // State
  // -----------------------------------------------------------------------------

  const userData = ref<Partial<IUser> | null>(null);
  // -----------------------------------------------------------------------------
  // Getters
  // -----------------------------------------------------------------------------

  const user = computed(() => {
    if (userData.value) {
      return userData.value;
    }

    return null;
  });

  const full_name = computed(
    () =>
      user.value &&
      `${userData.value?.surname} ${userData.value?.firstname} ${userData.value?.patronymic}`,
  );

  const isAuthorized = computed(() => {
    if (!!user.value && user.value.status) {
      return true;
    }

    deleteUser();
    return false;
  });

  const isAdmin = computed(() => user.value?.roles?.includes('admin'));

  // -----------------------------------------------------------------------------
  // Actions
  // -----------------------------------------------------------------------------

  function setUser(user: Partial<IUser> | null) {
    userData.value = user;
  }

  function deleteUser() {
    userData.value = null;
  }

  return {
    //State
    // userData,

    // Getters
    user,
    isAuthorized,
    isAdmin,
    full_name,

    // Actions
    setUser,
    deleteUser,
  };
});
