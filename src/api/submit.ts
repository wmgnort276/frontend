import { http } from '@/utils/http-client';

export const submitCode = (param: any) => {
    return http.post('/api/Example', {
      data: param
    });
  };

export const login = (param : any) => {
  return http.post('/api/login', {
    data: param
  });
}