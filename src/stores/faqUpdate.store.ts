import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {
  Category,
  Business,
  Company,
  FormResponse,
  AnswerResponse,
  FaqCode,
  RelationCompaniesAndFaqCodes
} from '@/types/interfaces/faq';
import {
  getFaqDetails,
  getBusiness,
  getCompanies,
  getCompanyFaqCodes,
  getCategoryLevelTwo,
} from '@/api/faqUpdate.api';

import { getKeywords } from '@/api/faq.api';

import { FAQ_CONDITION_TYPE, URL_TYPE } from './constants/constant';

export const useFaqUpdateStore = defineStore('faqUpdate', () => {
  const getDetails = async (params: any) => {
    const res: any = await getFaqDetails(params);
    return res.data;
  };

  const businesses = ref<Business[]>([]);
  const mapCategories = ref<Category[][]>([[], [], [], [], []]);
  const companies = ref<Company[]>([]);
  const faqCodes = ref<FaqCode[]>([]);
  const relationCompaniesAndFaqCodes = ref<RelationCompaniesAndFaqCodes[]>([]);

  const formUpdate = ref<FormResponse>({
    businessCode: null,
    categories: [undefined, undefined, undefined, undefined, undefined],
    firstLevelCategories: [],
    faqCategoryCode1: undefined,
    faqCategoryCode2: undefined,
    faqCategoryCode3: undefined,
    faqCategoryCode4: undefined,
    faqCategoryCode5: undefined,
    faqCode: null,
    faqNumber: null,
    relatedKeywords: null,
    ambiguouKeywords: null,
    listBreadcrumb: [],
    sortOrder: null,
    iId: null,
    content: null,
    displayEndDate: null,
    displayStartDate: null,
    oldAnswerId: null,
    isFaqCode: false,
    answer: [
      {
        key: 1,
        iId: null,
        answerCode: null,
        answerNumber: null,
        sortOrder: 1,
        startTime: null,
        endTime: null,
        answerCondition: 'Include',
        answerRelationCompanies: [],
        answerRelationCompaniesExclude: [],
        companyCodes: [],
        faqCodes: [],
        answerRelationCompaniesAndFaqCodes: [],
        answerRestriction: null,
        content: undefined,
        attachments: [],
        oldUrls: [],
        oldFileId: [],
        oldCompanyCodes: [],
        urls: [
          {
            key: Date.now(),
            type: URL_TYPE.NORMAL,
            title: null,
            link: undefined
          }
        ]
      }
    ],
    value: undefined,
    keywords: [],
  });

  const getBusinessData = () => {
    return getBusiness()
      .then((response) => {
        response.data.map((item: any) => {
          businesses.value.push({
            businessCode: item.businessCode,
            businessName: item.businessName,
            isFaqCode: item.isFaqCode,
            displayName: item.businessCode + '_' + item.businessName
          });
        });
      })
      .catch((error) => {
        Promise.reject(error);
      });
  };

  const getCompaniesData = () => {
    return getCompanies()
      .then((response: any) => {
        companies.value = response.data;
      })
      .catch((error) => {
        Promise.reject(error);
      });
  };

  const isEmptyOrNull = (value: any) => {
    return value === null || value === '' || value === undefined;
  };

  const hasInputData = (value: any) => {
    return value !== null && value !== '' && value !== undefined;
  };

  const checkNullForm = () => {
    return (
      isEmptyOrNull(formUpdate.value.businessCode) ||
      isEmptyOrNull(formUpdate.value.categories[0]) ||
      isEmptyOrNull(formUpdate.value.content) ||
      isEmptyOrNull(formUpdate.value.displayStartDate)
    );
  };

  const checkEmptyAnswers = () => {
    return formUpdate.value.answer.some((item: AnswerResponse) => {
      const isEmptyorNullUrlLink = item.urls.some((url) => {
        return !isEmptyOrNull(url.title) && isEmptyOrNull(url.link);
      });
      const isEmptyOrNullUrlName = item.urls.some((url) => {
        return !isEmptyOrNull(url.title) && isEmptyOrNull(url.link);
      });
      return (
        isEmptyOrNull(item.sortOrder) ||
        isEmptyOrNull(item.startTime) ||
        isEmptyOrNull(item.answerCondition) ||
        item.faqCodes.length === 0 ||
        isEmptyOrNull(item.content) ||
        isEmptyorNullUrlLink ||
        isEmptyOrNullUrlName
      );
    });
  };

  const checkExistForm = () => {
    return (
      formUpdate.value.businessCode ||
      formUpdate.value.categories[0] ||
      formUpdate.value.sortOrder ||
      formUpdate.value.content ||
      formUpdate.value.displayEndDate ||
      formUpdate.value.displayStartDate ||
      formUpdate.value.ambiguouKeywords ||
      formUpdate.value.relatedKeywords ||
      checkExistAnswers()
    );
  };

  const checkExistAnswers = () => {
    return formUpdate.value.answer.some((item: AnswerResponse) => {
      const isExistUrl = item.urls.some((url) => {
        return url.title || url.link;
      });

      return (
        (item.sortOrder && item.sortOrder !== 1) ||
        item.startTime ||
        item.endTime ||
        item.answerRelationCompanies.length > 0 ||
        item.attachments.length > 0 ||
        item.content ||
        isExistUrl
      );
    });
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

  const getRelationCompaniesAndFaqCodes = async () => {
    if (relationCompaniesAndFaqCodes.value.length > 0) {
      return;
    } else {
      await getCompaniesData();
      await getFaqCodes();

      companies.value.map((item) => {
        relationCompaniesAndFaqCodes.value.push({
          name: item.companyGroupCode + '_' + item.companyGroupName,
          code: item.companyGroupCode,
          type: FAQ_CONDITION_TYPE.IS_COMPANYGROUP,
          originalName: item.companyGroupName
        });
      });

      faqCodes.value.map((item) => {
        relationCompaniesAndFaqCodes.value.push({
          name: item.faqCode + '_' + item.faqName,
          code: item.faqCode,
          type: FAQ_CONDITION_TYPE.IS_FAQCODE,
          originalName: item.faqName
        });
      });
    }
  };

  const getListCategories = async (params: any): Promise<Category[]> => {
    try {
      const res: any = await getCategoryLevelTwo(params);
      return res.data.result.map((item :any) => {
        return {
          categoryCode: item.categoryCode,
          categoryName: item.categoryName,
          displayName: item.categoryCode + '_' + item.categoryName
        };
      });
    } catch (error) {
      return [];
    }
  };

  const getKeywordByBusiness = async (): Promise<string[]> =>{

    try {
      let param = `businessCode=${formUpdate.value.businessCode}`;

      const res: any = await getKeywords(param);
      return res.data;

    } catch (error) {
      return [];
    }
  }

  return {
    mapCategories,
    businesses,
    companies,
    formUpdate,
    faqCodes,
    relationCompaniesAndFaqCodes,
    getDetails,
    getBusinessData,
    getCompaniesData,
    checkNullForm,
    checkEmptyAnswers,
    checkExistAnswers,
    checkExistForm,
    isEmptyOrNull,
    getFaqCodes,
    getRelationCompaniesAndFaqCodes,
    getListCategories,
    getKeywordByBusiness,
  };
});
