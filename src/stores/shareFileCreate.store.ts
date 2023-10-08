import { defineStore } from 'pinia';
import { ref } from 'vue';

import type {
  Category,
  Business,
  Company,
  FaqCode,
  ShareFile,
  RelationCompaniesAndFaqCodes
} from '@/types/interfaces/faq';

import {
  getBusiness,
  getCategoryLevelTwo,
  getCompanies,
  getCompanyFaqCodes,
  getPermisionBussiness,
  getPermisionCompanyGroup
} from '@/api/faq.api';
import { FAQ_CONDITION_TYPE } from './constants/constant';
import { getCompanyGroupByBusinessCode } from '@/api/common.api';

export const useShareFileCreateStore = defineStore('sharefileCreate', () => {
  const mapCategories = ref<Category[][]>([[], [], [], [], []]);
  const businesses = ref<Business[]>([]);
  const companies = ref<Company[]>([]);
  const faqCodes = ref<FaqCode[]>([]);
  const companiesAndFaqCodes = ref<RelationCompaniesAndFaqCodes[]>([]);

  const formState = ref<ShareFile>({
    fileNumber: null,
    department: null,
    businessCode: null,
    companyGroupCode: [],
    note: null,
    title: null,
    description: null,
    attachments: []
  });

  const getBusinessData = () => {
    return getPermisionBussiness()
      .then((response) => {
        businesses.value = response.data;
      })
      .catch((error) => {
        Promise.reject(error);
      });
  };

  const getCompaniesData = async (param: any) => {
    try {
      const response : any = await getCompanyGroupByBusinessCode(param);
      companies.value = response.data;
    } catch (error) {
      Promise.reject(error);
    }
  };

  const getListCategories = async (params: any): Promise<Category[]> => {
    try {
      const res: any = await getCategoryLevelTwo(params);
      return res.data.result;
    } catch (error) {
      return [];
    }
  };

  const isEmptyOrNull = (value: any) => {
    return value === null || value === '' || value === undefined;
  };

  const getFaqCodes = () => {
    return getCompanyFaqCodes()
      .then((response: any) => {
        faqCodes.value = response.data;
      })
      .catch((error) => {
        Promise.reject(error);
      });
  };

  const getCompaniesAndFaqCodes = async (param: any) => {
    if (companiesAndFaqCodes.value.length > 0) {
      return;
    } else {
      await getCompaniesData(param);
      // await getFaqCodes();

      companies.value.map((item) => {
        companiesAndFaqCodes.value.push({
          name: item.companyGroupCode + '_' + item.companyGroupName,
          code: item.companyGroupCode,
          type: FAQ_CONDITION_TYPE.IS_COMPANYGROUP
        });
      });

      // faqCodes.value.map((item) => {
      //   companiesAndFaqCodes.value.push({
      //     name: item.faqCode + '_' + item.faqName,
      //     code: item.faqCode,
      //     type: FAQ_CONDITION_TYPE.IS_FAQCODE
      //   });
      // });
    }
  };

  return {
    mapCategories,
    businesses,
    companies,
    formState,
    faqCodes,
    companiesAndFaqCodes,
    getBusinessData,
    getCompaniesData,
    getListCategories,
    isEmptyOrNull,
    getFaqCodes,
    getCompaniesAndFaqCodes
  };
});
