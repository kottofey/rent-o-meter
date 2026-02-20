import { useLocalStorage } from '@vueuse/core';

import { useApi, httpMethod } from '@/shared/api';
import { IUser } from '@/entities/user';
import { router } from '@/app/router';
import { useAuthStore } from '@/shared/store';

export interface IAuthResponse {
  success: boolean;
  message: string;
  user: Partial<IUser>;
}

export default function useAuth() {
  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const authStore = useAuthStore();
    const me = useLocalStorage<string>('me', null);

    try {
      const result = await useApi<IAuthResponse>({
        route: 'auth/login',
        method: httpMethod.POST,
        body: JSON.stringify({ email, password }),
      });

      if (result) {
        me.value = JSON.stringify(result.user);
        authStore.setUser(result.user);
        await router.push({ name: 'home.show' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const logout = async () => {
    try {
      await useApi<IAuthResponse>({
        route: 'auth/logout',
        method: httpMethod.DELETE,
      });
      // Очищаем состояние аутентификации
      clearAuthState();
      await router.push({ name: 'login.show' });
    } catch (e) {
      console.error(e);
    }
  };

  const clearAuthState = () => {
    const authStore = useAuthStore();
    const storedUserData = useLocalStorage('me', null);

    // Очищаем данные пользователя из Pinia
    authStore.deleteUser();

    // Очищаем данные пользователя из localStorage
    storedUserData.value = null;
  };

  const initializeAuthState = () => {
    const authStore = useAuthStore();
    const storedUserData = useLocalStorage('me', null);

    // Проверяем, есть ли данные пользователя в localStorage
    if (storedUserData.value) {
      try {
        // Парсим данные пользователя из localStorage
        const parsedUserData = storedUserData.value
          ? JSON.parse(storedUserData.value as string)
          : null;

        if (parsedUserData) {
          // Устанавливаем данные пользователя в Pinia
          authStore.setUser(parsedUserData);
        }
      } catch (error) {
        console.error(
          'Ошибка при инициализации состояния аутентификации:',
          error,
        );
        // Очищаем некорректные данные из localStorage
        storedUserData.value = null;
        authStore.setUser(null);
      }
    }
  };

  return { login, logout, clearAuthState, initializeAuthState };
}
