import { http } from '@/utils/http-client';

// Only use with docker
// export const submitCode = (param: any) => {
//   return http.post('/api/CompileCode/docker', {
//     data: param
//   });
// };


export const submitCode = (param: any) => {
  return http.post('/api/CompileCode', {
    data: param
  });
};


export const getSubmissionDetailApi = (id: string) => {
  return http.get(`/api/Submission/${id}`);
}