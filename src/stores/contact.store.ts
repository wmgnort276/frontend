import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { FormInput, ContactType, UserEmail } from '@/types/interfaces/contact';
import { useAuthStore } from '@/stores/auth.store';
import dayjs from 'dayjs';
import { EmailField } from './constants/constant';
import { getUserEmails, getContactTypes } from '@/api/contact.api'

export const useContactStore = defineStore('contact', () => {
  const formatDate = computed(() => dayjs(form.value.createDate).format('YYYY/MM/DD'));
  const auth = useAuthStore();
  const userEmails = ref<UserEmail[]>([]);

  const getContactInfo = async () => {
    await auth.getAuthInfo();
    form.value.companyName = auth.authUser?.CompanyCode;
    form.value.companyGroup = auth.authUser?.CompanyGroupCode;
    form.value.creatorId = auth.authUser?.LoginUserId;
    if(auth.authUser?.Email) {
      form.value.selectedMail = auth.authUser?.Email;
    }
    form.value.creatorName =(auth.authUser?.LastNameKanji ?? '') + ' ' + (auth.authUser?.NameKanji ?? '')
  };

  const cbMailSelected = ref<EmailField>(EmailField.Registed);

  const contactTypes = ref<ContactType[]>([]);

  const form = ref<FormInput>({
    ...{
      companyGroup: '',
      companyName: '',
      creatorId: '',
      creatorName: '',
      userEmail: null,
      selectedMail: null,
      editMail: null,
      classifiedBusiness: null,
      toMailAddress: '',
      titleMail: null,
      contentMail: null,
      createDate: new Date(),
      mailConfirm: null,
      contactDomain: null,
      contactTypeName: null,
      contactTypeCode: null,
      relatedCode: null
    }
  });

  const onEmailSelected = (value: string) => {
    form.value.userEmail = value;
  };

  const onEmailEdited = (value: string) => {
    form.value.userEmail = value;
  };

  const onContactTypeSelected = (value: string) => {
    const contactDomain = contactTypes.value.find((item : ContactType) => item.contactTypeCode === value)?.contactDomain;
    form.value.contactDomain = contactDomain;
  };

  const getUserEmailsData = async () => {
    try {
      let userEmailData : any = await getUserEmails();
      userEmails.value = userEmailData.data;
      if(userEmails.value.length) {
        // Check if email logged in was in list or not
       if(auth.authUser?.Email && !userEmails.value.some((item : UserEmail) => item.userEmail == auth.authUser?.Email)) {
         userEmails.value.unshift({
          userEmail: auth.authUser?.Email,
          userEmailCode: null
         })
       }
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  const getContactTypesData = async () => {
    try {
      if(auth.authUser) {
        let contactTypeData : any = await getContactTypes(auth.authUser?.CompanyGroupCode);
        contactTypes.value = contactTypeData.data;
        return true;
      }
    } catch(err) {
      return false;
    }
  }

  const isEmptyOrNull = (value: any) => {
    return value === null || value === '' || value === undefined;
  };

  const checkNullForm = () => {
    return (
      isEmptyOrNull(form.value.userEmail) ||
      isEmptyOrNull(form.value.contactTypeCode) || 
      isEmptyOrNull(form.value.titleMail) || 
      isEmptyOrNull(form.value.contentMail)
    );
  }

  const clearForm = () => {
    form.value = {
      companyGroup: '',
      companyName: '',
      creatorId: '',
      creatorName: '',
      userEmail: null,
      selectedMail: null,
      editMail: null,
      classifiedBusiness: null,
      toMailAddress: '',
      titleMail: null,
      contentMail: null,
      createDate: new Date(),
      mailConfirm: null,
      contactDomain: null,
      contactTypeName: null,
      contactTypeCode: null,
      relatedCode: null
    }
  }

  return {
    form,
    formatDate,
    getContactInfo,
    cbMailSelected,
    contactTypes,
    onEmailSelected,
    onContactTypeSelected,
    onEmailEdited,
    userEmails,
    getUserEmailsData,
    getContactTypesData,
    checkNullForm,
    clearForm
  };
});
