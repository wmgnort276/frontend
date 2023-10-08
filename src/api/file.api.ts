import { http } from '@/utils/http-client';

export const uploadFiles = (param: any) => {
  return http.upload('/api/file/upload-files', {
    data: param
  });
};

export const uploadFilesMemory = (param: any) => {
  return http.upload('/api/file/uploadFiles', {
    data: param
  });
};

export const uploadFilesFaq = (param: any) => {
  return http.upload('/api/file/uploadFileFaq', {
    data: param
  });
};

export const bulkUploadFaq = (param: any) => {
  return http.upload('/api/faq/importFaq', { data: param });
};

export const downloadFiles = (param: any) => {
  const query: any = [];
  Object.entries(param).forEach((entry) => {
    const [key, value] = entry;
    query.push(key + '=' + value);
  });
  return http.get(`/api/file/download-file?${query.join('&')}`, {
    responseType: 'arraybuffer'
  });
};

export const bulkUploadPreview = (param: any) => {
  return http.upload('/api/faq/preview-import', { data: param });
};

export const getFileAttachmentList = () => {
  return http.get('/api/file/getFileAttachmentList');
};
