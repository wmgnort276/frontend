import { http } from '@/utils/http-client';

export const submitCode = (param: any) => {
    return http.post('/api/CompileCode/docker', {
      data: param
    });
  };
