import { http } from '@/utils/http-client';
import type { TBusiness } from '@/types/schemas/faqCreate.schema';

export const getCompanies = () => {
  return http.get(`api/company/getCompanyGroups`);
};

export const updateFaq = (param: any) => {
  return http.post('/api/faq/updateFaq', {
    data: param
  });
};

export const getBusiness = () => {
  return http.get<any>(`api/business/getBusiness`);
};

export const getFaqDetails = (param: any) => {
  const query: any = [];
  Object.entries(param).forEach((entry) => {
    const [key, value] = entry;
    query.push(key + '=' + value);
  });
  return http.get(`api/faq/getFaqDetails?${query.join('&')}`);
};

export const getCompanyFaqCodes = () => {
  return http.get(`api/company/getFaqCodes`);
};

export const getCategoryLevelTwo = (param: any) => {
  const qs: any = [];
  Object.entries(param).forEach((entry) => {
    const [key, value] = entry;
    qs.push(key + '=' + value);
  });
  return http.get(`api/faq/getFaqCategories?${qs.join('&')}`);
};

export const deleteFaq = (param: any) => {
  const qs: any = [];
  Object.entries(param).forEach((entry) => {
    const [key, value] = entry;
    qs.push(key + '=' + value);
  });
  return http.post(`api/faq/deleteFaq?${qs.join('&')}`);
}
