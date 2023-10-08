import { http } from '@/utils/http-client';
import type { TBusiness } from '@/types/schemas/faqCreate.schema';

export const getBusiness = () => {
  return http.get<any>(`api/business/getBusiness`);
};

export const getAvaiableBusiness = (param: any) => {
  let url = 'api/faq/getBusiness';

  if (param) {
    url = url + '?' + param;
  }

  return http.get<any>(url);
};

export const getEndYearCategory = (param: any) => {
  let url = 'api/faq/getCategoryEndYear';

  if (param) {
    url = url + '?' + param;
  }

  return http.get<any>(url);
};

export const getAvaiableCategory = (param: any) => {
  let url = 'api/faq/getCategory';

  if (param) {
    url = url + '?' + param;
  }

  return http.get<any>(url);
};

export const getCategoryLevelOne = (param: any) => {
  let qs: any = [];
  Object.entries(param).forEach((entry) => {
    const [key, value] = entry;
    qs.push(key + '=' + value);
  });
  return http.get(`api/faq/getFaqCategories?${qs.join('&')}`);
};

export const getCategoryLevelTwo = (param: any) => {
  let qs: any = [];
  Object.entries(param).forEach((entry) => {
    const [key, value] = entry;
    qs.push(key + '=' + value);
  });
  return http.get(`api/faq/getFaqCategories?${qs.join('&')}`);
};

export const getCompanies = () => {
  return http.get(`api/company/getCompanyGroups`);
};

export const getCompanyFaqCodes = () => {
  return http.get(`api/company/getFaqCodes`);
};

export const createFaq = (param: any) => {
  return http.post('/api/faq/createFaq', {
    data: param
  });
};

export const searchFaq = (param: any) => {
  let url = 'api/faq/searchFaq';

  if (param) {
    url = url + '?' + param;
  }

  return http.get(url);
};

export const getKeywords = (param: any) => {
  let url = 'api/faq/getFaqKeywords';

  if (param) {
    url = url + '?' + param;
  }

  return http.get(url);
};

export const getCategoryTree = (param: any) => {
  let url = 'api/faq/getFaqCategoryTree';

  if (param) {
    url = url + '?' + param;
  }

  return http.get(url);
};

export const getFeatureFaq = (param: any) => {
  let url = 'api/faq/getFeatureFaq';

  if (param) {
    url = url + '?' + param;
  }

  return http.get(url);
};

export const checkCompanyOfBusiness = (param: any) => {
  return http.post('/api/faq/checkCompGroupOfBusiness', {
    data: param
  });
};

export const getPermisionBussiness = () => {
  return http.get<any>(`api/business/getPermisionBussiness`);
};

export const getPermisionCompanyGroup = () => {
  return http.get<any>(`api/business/getPermisionCompanyGroup`);
};
