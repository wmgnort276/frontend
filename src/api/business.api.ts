import { http } from '@/utils/http-client';

export const getPermisionBusiness = () => {
    return http.get<any>(`api/business/getPermisionBussiness`);
};