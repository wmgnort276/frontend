import { http } from '@/utils/http-client';

export const getFaqDetail = (param: any) => {
  let qs: any = [];
  Object.entries(param).forEach((entry) => {
    const [key, value] = entry;
    qs.push(key + '=' + value);
  });
  return http.get(`api/faq/getDetailFaq?${qs.join('&')}`);
};

export const sendVoteResult = (param: any) => {
  return http.post('/api/faq/voteFaqAnswer', {
    data: param
  });
};

export const downloadFile = (param: any) => {
  let qs: any = [];
  Object.entries(param).forEach((entry) => {
    const [key, value] = entry;
    qs.push(key + '=' + value);
  });
  return http.get(`api/file/download-file?${qs.join('&')}`, {
    responseType: 'arraybuffer'
  });
};

export const updateViewCountAPI = (data: any) => {
  return http.post('/api/faq/updateViewCount', {
    data
  });
}
