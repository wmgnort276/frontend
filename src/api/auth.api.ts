import { http } from '@/utils/http-client';
import type { TLogin, TLoginFaq,TChangePassword } from '@/types/schemas/user.schema';
import type { TCurrentUser } from '@/types/schemas/auth.schema';

export const refreshToken = () => {
  return http.post('/oauth/token', {
    data: {}
  });
};

export const login = (param : any) => {
  return http.post('/api/Authentication/login', {
    data: param
  });
}


export const changePassword = ({ oldPassword, newPassword, confirmPassword } : TChangePassword) => {
  return http.post('/api/users/change-password', {
    data: {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword
    }
  });
}

export const me = () => {
  return http.get<TCurrentUser>(`api/users/info`);
};

export const forgotPassword = (param: any) => {
  return http.post(`api/users/forgetPassword`, {
    data: param
  });
}

export const validatePassword = (id:any) => {
  return http.get(`api/users/checkvalidatePassword?id=${id}`
  );
}

export const setNewPassword = (param:any) => {
  return http.post(`api/users/setNewPassword`, {
    data: param
  });
}

export const forgotId = (param: any) => {
  return http.post(`api/users/forgetId`, {
    data: param
  });
}
