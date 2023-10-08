import { http } from '@/utils/http-client';

const setQuery = (param: any) => {
  const query: any = [];
  Object.entries(param).forEach((entry) => {
    const [key, value] = entry;
    query.push(key + '=' + value);
  });
  return query;
};

export const getShareFileDetail = (param: any) => {
  const qs: any = [];
  Object.entries(param).forEach((entry) => {
    const [key, value] = entry;
    qs.push(key + '=' + value);
  });
  return http.get(`api/sharefile/getShareFile?${qs.join('&')}`);
};

export const createShareFile = (param: any) => {
  return http.post('/api/sharefile/createShareFile', {
    data: param
  });
};

export const getShareFileDetailForEdit = (param: any) => {
  const query = setQuery(param);
  return http.get(`api/sharefile/detail?${query.join('&')}`);
};

export const updateShareFile = (param: any) => {
  return http.post('/api/sharefile/update', { data: param });
};

export const checkPermissionShareFile = () => {

  return http.get('/api/sharefile/checkPermissionShareFile');
};

export const getUserAssignerShareFile = (param: any) => {
  const query = setQuery(param);
  return http.get(`/api/users/getUserAssigner?${query.join('&')}`);
};

export const assignShareFile = (param: any) => {
  return http.post('/api/sharefile/assignShareFile', { data: param });
};

export const searchShareFileApi = (param: any) => {
  let url = '/api/sharefile/searchSharefile';

  if (param) {
    url = url + '?' + param;
  }

  return http.get(url);
};

export const feedbackShareFile = (param: any) => {
  return http.post('/api/sharefile/feedbackShareFile', { data: param });
};

export const approvedShareFile = (param: any) => {
  return http.post('/api/sharefile/approvedShareFile', { data: param });
};

export const shareFileReferences = (param: any) => {
  const query = setQuery(param);
  return http.get(`api/sharefile/shareFileReferences?${query.join('&')}`);
};

export const shareFileHistories = (param: any) => {
  const query = setQuery(param);
  return http.get(`api/sharefile/getShareFileHistories?${query.join('&')}`);
};

export const shareFileDelete = (param: any) => {
  return http.post(`api/sharefile/deleteShareFile`, {data: param});
}
