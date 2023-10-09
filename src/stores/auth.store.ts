import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { AuthUser } from '@/types/interfaces/auth';
import { message } from 'ant-design-vue';
import { login, loginFaq, me, refreshToken, changePassword } from '@/api/auth.api';
import AuthSchema, { MeSchemaResponse } from '@/types/schemas/auth.schema';
import { store } from '@/stores';
import LocalStorageService from '@/utils/localStorageService';
import localStorageService from '@/utils/localStorageService';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  const authUser = ref<AuthUser>();
  const token = localStorageService.getAccessToken();

  const isAuthenticated = computed(() => authUser.value !== undefined);
  const handleRefreshToken = () => {
    return refreshToken()
      .then((response) => {
        const { token } = AuthSchema.parse(response);

        LocalStorageService.setAccessToken(token);
        return { token };
      })
      .catch((error) => {
        clearAuthInfo();
        router.push('/login');

        return Promise.reject(error);
      });
  };

  const getAuthInfo = () => {
    return me()
      .then((response) => {
        const currentUser = response.user;
        authUser.value = currentUser;
        localStorageService.clearUserType();
        localStorageService.setUserType(currentUser.UserType);
        return authUser.value;
      })
      .catch((error) => {
        Promise.reject(error);
      });
  };

  const handleLogin = ({
    username,
    password,
    type
  }: {
    username: string;
    password: string;
    type: string;
  }) => {
    return login({ username, password, type })
      .then(async (response) => {
        const data = AuthSchema.parse(response);
        localStorageService.setAccessToken(data?.token);
        // message.success('Login success');
        await router.push('/top');
        return;
      })
      .catch((error) => {
        const dataError = error.response.data;
        message.error(dataError.message);
      });
  };

  const handleLoginFaq = ({ faqCode, password }: { faqCode: string; password: string }) => {
    return loginFaq({ faqCode, password })
      .then(async (response) => {
        const data = AuthSchema.parse(response);
        localStorageService.setAccessToken(data?.token);
        // message.success('Login success');
        await router.push('/faq/search?isFaqCode=1');
      })
      .catch((error) => {
        const dataError = error.response.data;
        message.error(dataError.message);
      });
  };

  const clearAuthInfo = () => {
    authUser.value = undefined;
    LocalStorageService.clearAccessToken();
    LocalStorageService.clearUserType();
  };


  const handleChangePassword = async ({
    oldPassword,
    newPassword,
    confirmPassword
  }: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    return changePassword({ oldPassword, newPassword, confirmPassword })
      .then(async (response) => {
        message.success('Change password success');
        clearAuthInfo();
        await router.push('/top');
        return;
      })
      .catch((error) => {
        const dataError = error.response.data;
        message.error(dataError.message);
      });
  };

 
  return {
    authUser,
    isAuthenticated,
    handleRefreshToken,
    getAuthInfo,
    handleLogin,
    handleLoginFaq,
    clearAuthInfo,
    handleChangePassword,
  };
});

export function useAuthStoreHook() {
  return useAuthStore(store);
}
