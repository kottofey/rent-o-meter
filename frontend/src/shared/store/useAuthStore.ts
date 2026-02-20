import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { IUser } from '@/entities/user';

export const useAuthStore = defineStore('auth', () => {
  // -----------------------------------------------------------------------------
  // State
  // -----------------------------------------------------------------------------

  const userData = ref<Partial<IUser> | null>(null);
  // const isAuthorized = ref(false);

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
      `${userData.value?.surname} ${userData.value?.firstname} ${userData.value?.patronymic}`,
  );

  const isAuthorized = computed(() => !!user.value);

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
    full_name,

    // Actions
    setUser,
    deleteUser,
  };
});
