import { http } from '@/utils/http-client';

export const submitCode = (param: any) => {
    return http.post('/api/CompileCode', {
      data: param
    });
  };

export const login = (param : any) => {
  return http.post('/api/Authentication/login', {
    data: param
  });
}