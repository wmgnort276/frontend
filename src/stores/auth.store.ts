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
  // const handleRefreshToken = () => {
  //   return refreshToken()
  //     .then((response) => {
  //       const { token } = AuthSchema.parse(response);

  //       LocalStorageService.setAccessToken(token);
  //       return { token };
  //     })
  //     .catch((error) => {
  //       clearAuthInfo();
  //       router.push('/login');

  //       return Promise.reject(error);
  //     });
  // };

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
      message.error("Login failed");
    } catch (error) {
      message.error("Login failed");
    }
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

  const signUp = async (payload : FormSignUp) => {
    try {
      await signUpApi(payload).then(res => {
        message.success("Create account success!");
        return true;
      }).catch((error : any) => {
        let messageError = error?.response?.data?.message ?? error?.response?.data?.errors?.Email?.[0] ?? '';
        message.error(`Sign up fail! ${messageError}`);
        return false;
      });
    } catch(error) {
      message.error("Server error!");
      return false;
    }
  } 


  return {
    authUser,
    isAuthenticated,
    // handleRefreshToken,
    getAuthInfo,
    handleLogin,
    clearAuthInfo,
    handleChangePassword,
    signUp,
  };
});

export function useAuthStoreHook() {
  return useAuthStore(store);
}
