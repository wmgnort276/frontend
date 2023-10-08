import type { ContactType, UserEmail } from '@/types/interfaces/contact';
import { http } from '@/utils/http-client';

export const getUserEmails = () => {
    return http.get(`api/contact/userEmails`);
}

export const getContactTypes = (param: string) => {
    return http.get(`api/contact/contactTypes?companyGroupCode=${param}`);
}

export const createContact = (param: any) => {
    return http.post('/api/contact/create', {
      data: param
    });
  };