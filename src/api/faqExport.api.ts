import { http } from '@/utils/http-client';

export const getDataExport = (param: any) => {
  let qs: any = [];
  Object.entries(param).forEach((entry) => {
    const [key, value] = entry;
    qs.push(key + '=' + value);
  });
  return http.get(`api/faq/exportFaq?${qs.join('&')}`);
};
