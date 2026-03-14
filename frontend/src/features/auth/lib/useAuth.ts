import { useApi, httpMethod } from '@/shared/api';
import { type IUser } from '@/entities/user';
import { router } from '@/app/router';
import { useAuthStore } from '@/shared/store';
import { notification } from '@/shared/lib';

export interface IAuthResponse {
  success: boolean;
  message: string;
  user: Partial<IUser>;
}

export default function useAuth() {
  const authStore = useAuthStore();

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const authStore = useAuthStore();

    try {
      const result = await useApi<IAuthResponse>({
        route: 'auth/login',
        method: httpMethod.POST,
        body: JSON.stringify({ email, password }),
      });

      if (result?.user) {
        authStore.setUser(result.user);
        await router.push({ name: 'home.show' });
      }
    } catch (e) {
      if (e instanceof Error) {
        notification.error({
          content: e.message,
          closable: true,
          duration: 5000,
        });
      } else {
        notification.error({
          content: 'Ошибка! Подробности в консоли!',
          closable: true,
          duration: 5000,
        });
        console.error(e);
      }
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
    authStore.deleteUser();
  };

  const initializeAuthState = async () => {
    const authStore = useAuthStore();
    try {
      const me = await useApi<IAuthResponse>({
        route: 'me',
        method: httpMethod.GET,
      });

      if (me?.user.id) {
        authStore.setUser(me.user);
      } else {
        authStore.setUser(null);
      }
    } catch (e) {
      console.error('init auth error', e);
    }
  };

  return { login, logout, clearAuthState, initializeAuthState };
}
