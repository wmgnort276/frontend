import { http } from '@/utils/http-client';

export const getCompanyGroupsPermission = () => {
  return http.get(`api/company/companyGroupPermission`);
}