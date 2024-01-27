import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { message } from 'ant-design-vue';
import { login, me, changePassword, signUpApi } from '@/api/auth.api';
import { store } from '@/stores';
import LocalStorageService from '@/utils/localStorageService';
import localStorageService from '@/utils/localStorageService';
import router from '@/router';
import type { FormSignUp } from '@/types/interfaces/auth'

export const useAuthStore = defineStore('auth', () => {
  const authUser = ref<any>();
  // const token = localStorageService.getAccessToken();
  const isAuthenticated = computed(() => authUser.value !== undefined);
  const isAdmin = computed(() => authUser.value?.role?.includes('Admin'));
  const userName = computed(() => authUser.value?.userName ? authUser.value?.userName : '');

  const getAuthInfo = async () => {
    return me()
      .then((response: any) => {
        const currentUser = response.data;
        authUser.value = currentUser;
      })
    // .catch((error) => {
    //   Promise.reject(error);
    // });
  };

  const handleLogin = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      let data: any = await login({ username, password });
      if (data?.token) {
        localStorageService.setAccessToken(data?.token);
        message.success('Login success');
        await router.push('/home');
        return;
      }
      message.error("Wrong username or password");
    } catch (error) {
      message.error("Wrong username or password");
    }
  };

  const clearAuthInfo = () => {
    authUser.value = undefined;
    LocalStorageService.clearAccessToken();
    LocalStorageService.clearUserType();
  };


  const signUp = async (payload: FormSignUp) => {
    try {
      await signUpApi(payload).then(res => {
        message.success("Create account success!");
        return true;
      }).catch((error: any) => {
        let messageError = error?.response?.data?.message ?? error?.response?.data?.errors?.Email?.[0] ?? '';
        message.error(`Sign up fail! ${messageError}`);
        return false;
      });
    } catch (error) {
      message.error("Server error!");
      return false;
    }
  }


  return {
    authUser,
    isAuthenticated,
    isAdmin,
    userName,
    // handleRefreshToken,
    getAuthInfo,
    handleLogin,
    clearAuthInfo,
    signUp,
  };
});

export function useAuthStoreHook() {
  return useAuthStore(store);
}
