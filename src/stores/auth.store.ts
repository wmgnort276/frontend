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
import { USER_TYPE, USER_FUNCTION_TYPE, USER_FUNCTION_FLAG_VALUE, COMPANY_FUNCTION_FLAG_VALUE, TRUE_VALUE } from '@/stores/constants/constant';

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
    type: string[];
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

  const isViewFaqNormal = () => {
    let userFunctions = authUser.value?.functions;

    let userFunctionsFaqNormal = userFunctions?.filter((item) => {
      return item.functionCode == USER_FUNCTION_TYPE.FAQ;
    });

    if (userFunctionsFaqNormal?.length == 0) {
      return false;
    }

    let validFAQUser = userFunctions?.filter((item) => {
      return item.functionCode == USER_FUNCTION_TYPE.FAQ && (item.flag == USER_FUNCTION_FLAG_VALUE.NOT_ACCESS);
    });

    if (Number(validFAQUser?.length) > 0) {
      return false;
    }

    return true;
  }

  const isCompanyViewNormalFaq = () => {
    let companyFunctions = authUser.value?.companyFunctions;

    let validFAQ = companyFunctions?.filter((item) => {
      return item.functionCode == USER_FUNCTION_TYPE.FAQ && item.flag == COMPANY_FUNCTION_FLAG_VALUE.ACCESS;
    });

    if (validFAQ && validFAQ?.length > 0) {
      return true;
    }
    return false;

  }
  
  const isViewFaqEndYear = () => {

    if (authUser.value?.UserType == USER_TYPE.FAQ) {
      return true;
    }

    let userFunctions = authUser.value?.functions;

    let userFunctionsFaqNormal = userFunctions?.filter((item) => {
      return item.functionCode == USER_FUNCTION_TYPE.FAQ_END_YEAR;
    });

    if (userFunctionsFaqNormal?.length == 0) {
      return false;
    }

    let validFAQUser = userFunctions?.filter((item) => {
      return item.functionCode == USER_FUNCTION_TYPE.FAQ_END_YEAR && (item.flag == USER_FUNCTION_FLAG_VALUE.NOT_ACCESS);
    });

    if (Number(validFAQUser?.length) > 0) {
      return false;
    }

    return true;
  }

  const isCompanyViewEndYearFaq = () => {
    let companyFunctions = authUser.value?.companyFunctions;

    let validFAQ = companyFunctions?.filter((item) => {
      return item.functionCode == USER_FUNCTION_TYPE.FAQ && item.flag == COMPANY_FUNCTION_FLAG_VALUE.NOT_ACCESS;
    });

    if (validFAQ && validFAQ?.length > 0) {
      return true;
    }
    return false;

  }

  const isEditFaqNormal = () => {
    if (authUser.value?.UserType != USER_TYPE.MANAGER && authUser.value?.UserType != USER_TYPE.SYSTEM_ADMIN) {
      return false;
    }

    let userFunctions = authUser.value?.functions;

    let userFunctionsFaqNormal = userFunctions?.filter((item) => {
      return item.functionCode == USER_FUNCTION_TYPE.FAQ;
    });

    if (userFunctionsFaqNormal?.length == 0) {
      return false;
    }

    let validFAQUser = userFunctions?.filter((item) => {
      return item.functionCode == USER_FUNCTION_TYPE.FAQ && (item.flag == USER_FUNCTION_FLAG_VALUE.FULL_ACCESS);
    });

    if (Number(validFAQUser?.length) > 0) {
      return true;
    }

    return false;
  }

  const isEditFaqEndYear = () => {
    if (authUser.value?.UserType != USER_TYPE.MANAGER && authUser.value?.UserType != USER_TYPE.SYSTEM_ADMIN) {
      return false;
    }

    let userFunctions = authUser.value?.functions;

    let userFunctionsFaqNormal = userFunctions?.filter((item) => {
      return item.functionCode == USER_FUNCTION_TYPE.FAQ_END_YEAR;
    });

    if (userFunctionsFaqNormal?.length == 0) {
      return false;
    }

    let validFAQUser = userFunctions?.filter((item) => {
      return item.functionCode == USER_FUNCTION_TYPE.FAQ_END_YEAR && (item.flag == USER_FUNCTION_FLAG_VALUE.FULL_ACCESS);
    });

    if (Number(validFAQUser?.length) > 0) {
      return true;
    }

    return false;
  }

  const isManagerUser = () => {
    return authUser.value?.UserType == USER_TYPE.MANAGER || authUser.value?.UserType == USER_TYPE.SYSTEM_ADMIN;
  }

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

  const isUserEmployee = () => {
    return authUser.value?.UserType == USER_TYPE.EMPLOYEE;
  }

  const isUserFaq = () => {
    return authUser.value?.UserType == USER_TYPE.FAQ;
  }
  
  const isViewShareFile = () => {
    if (authUser.value?.UserType != USER_TYPE.MANAGER && authUser.value?.UserType != USER_TYPE.SYSTEM_ADMIN) {
      return false;
    }
    let userFunctions = authUser.value?.functions;

    let validShareFileUser = userFunctions?.some((item) => {
      return item.functionCode == USER_FUNCTION_TYPE.SHARE_FILE 
      && (item.flag == USER_FUNCTION_FLAG_VALUE.FULL_ACCESS || item.flag == USER_FUNCTION_FLAG_VALUE.READ_ONLY);
    });

    if (validShareFileUser) {
      return true;
    }
    return false;
  }

  const isCreateShareFile = () => {
    if (authUser.value?.UserType != USER_TYPE.MANAGER && authUser.value?.UserType != USER_TYPE.SYSTEM_ADMIN) {
      return false;
    }

    if(authUser.value?.UserType == USER_TYPE.MANAGER && authUser.value?.IsAuthority == TRUE_VALUE) {
      return false;
    }

    let userFunctions = authUser.value?.functions;

    let validShareFileUser = userFunctions?.some((item) => {
      return item.functionCode == USER_FUNCTION_TYPE.SHARE_FILE 
        && (item.flag == USER_FUNCTION_FLAG_VALUE.FULL_ACCESS);
    });
      
    if (validShareFileUser) {
      return true;
    }

    return false;
  }

  return {
    authUser,
    isAuthenticated,
    handleRefreshToken,
    getAuthInfo,
    handleLogin,
    handleLoginFaq,
    clearAuthInfo,
    isViewFaqNormal,
    isEditFaqNormal,
    isViewFaqEndYear,
    isEditFaqEndYear,
    isManagerUser,
    handleChangePassword,
    isUserEmployee,
    isCompanyViewNormalFaq,
    isCompanyViewEndYearFaq,
    isViewShareFile,
    isUserFaq,
    isCreateShareFile,
  };
});

export function useAuthStoreHook() {
  return useAuthStore(store);
}
