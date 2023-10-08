import { http } from '@/utils/http-client';
import type { TBusiness } from '@/types/schemas/faqCreate.schema';

export const getBusiness = () => {
  return http.get<any>(`api/business/getBusiness`);
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
