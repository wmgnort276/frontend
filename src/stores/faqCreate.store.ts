import { defineStore } from 'pinia';
import { ref, onMounted, h } from 'vue';
import { FAQ_CONDITION_TYPE, URL_TYPE } from '@/stores/constants/constant';
import type {
  FormRequest,
  Category,
  Business,
  Company,
  Answer,
  FaqCode,
  RelationCompaniesAndFaqCodes
} from '@/types/interfaces/faq';
import { getBusiness, getCategoryLevelTwo, getCompanies, getCompanyFaqCodes, getKeywords } from '@/api/faq.api';
import { BusinessesSchema } from '@/types/schemas/faqCreate.schema';
import dayjs from 'dayjs';
import { boolean } from 'zod';

export const useFaqCreateStore = defineStore('faqCreate', () => {
  const mapCategories = ref<Category[][]>([[], [], [], [], []]);
  const businesses = ref<Business[]>([]);
  const companies = ref<Company[]>([]);
  const faqCodes = ref<FaqCode[]>([]);
  const relationCompaniesAndFaqCodes = ref<RelationCompaniesAndFaqCodes[]>([]);
  const chosenCompaniesAndFaqCodes = ref<string[]>([]);

  const formState = ref<FormRequest>({
    businessDepartment: null,
    categories: [undefined, undefined, undefined, undefined, undefined],
    firstLevelCategories: [],
    category_1: null,
    category_2: null,
    category_3: null,
    category_4: null,
    category_5: null,
    relatedKeywords: null,
    ambiguouKeywords: null,
    listBreadcrumb: [],
    question: {
      questionOrder: null,
      questionStartDate: null,
      isQuestionStartClear: false,
      questionEndDate: null,
      isQuestionEndClear: false,
      questionContent: ''
    },
    answer: [
      {
        key: 1,
        answerOrder: 1,
        answerStartDate: null,
        isAnswerStartClear: false,
        answerEndDate: null,
        isAnswerEndClear: false,
        answerCondition: 'Include',
        answerRelationCompanies: [],
        answerRelationCompaniesExclude: [],
        faqCodes: [],
        answerRelationCompaniesAndFaqCodes: [],
        chosenCompaniesAndFaqCodes: [],
        answerRestriction: null,
        answerContent: undefined,
        answerFiles: [],
        answerReferenceUrl: [
          {
            key: Date.now(),
            urlType: URL_TYPE.NORMAL,
            urlName: null,
            urlLink: undefined
          }
        ]
      }
    ],
    isFaqCode: false,
    keywords: [],
  });

  const getBusinessData = () => {
    if (businesses.value.length > 0) {
      return;
    }
    return getBusiness()
      .then((response) => {
        // businesses.value = response.data;
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

  const getListCategories = async (params: any): Promise<Category[]> => {
    try {
      const res: any = await getCategoryLevelTwo(params);
      return res.data.result.map((item: any) => {
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
      let param = `businessCode=${formState.value.businessDepartment}`;

      const res: any = await getKeywords(param);
      return res.data;
     
    } catch (error) {
      return [];
    }
  }

  const isEmptyOrNull = (value: any) => {
    return value === null || value === '' || value === undefined;
  };
  const hasInputData = (value: any) => {
    return value !== null && value !== '' && value !== undefined;
  };
  const checkNullForm = () => {
    return (
      isEmptyOrNull(formState.value.businessDepartment) ||
      isEmptyOrNull(formState.value.categories[0]) ||
      isEmptyOrNull(formState.value.question.questionContent) ||
      isEmptyOrNull(formState.value.question.questionStartDate)
    );
  };

  const checkEmptyAnswers = () => {
    return formState.value.answer.some((item: Answer) => {
      const isEmptyorNullUrlLink = item.answerReferenceUrl.some((url) => {
        return !isEmptyOrNull(url.urlName) && isEmptyOrNull(url.urlLink);
      });
      const isEmptyOrNullUrlName = item.answerReferenceUrl.some((url) => {
        return !isEmptyOrNull(url.urlLink) && isEmptyOrNull(url.urlName);
      });
      return (
        isEmptyOrNull(item.answerOrder) ||
        isEmptyOrNull(item.answerStartDate) ||
        isEmptyOrNull(item.answerCondition) ||
        item.answerRelationCompaniesAndFaqCodes.length === 0 ||
        isEmptyOrNull(item.answerContent) ||
        isEmptyorNullUrlLink ||
        isEmptyOrNullUrlName
      );
    });
  };

  const checkExistForm = () => {
    return (
      formState.value.businessDepartment ||
      formState.value.categories[0] ||
      formState.value.question.questionOrder ||
      formState.value.question.questionContent ||
      formState.value.question.questionEndDate ||
      formState.value.question.questionStartDate ||
      formState.value.ambiguouKeywords ||
      formState.value.relatedKeywords ||
      checkExistAnswers()
    );
  };

  const checkExistAnswers = () => {
    return formState.value.answer.some((item: Answer) => {
      const isExistUrl = item.answerReferenceUrl.some((url) => {
        return url.urlName || url.urlLink;
      });

      return (
        (item.answerOrder && item.answerOrder !== 1) ||
        item.answerStartDate ||
        item.answerEndDate ||
        item.answerRelationCompanies.length > 0 ||
        item.answerFiles.length > 0 ||
        item.answerContent ||
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

  return {
    mapCategories,
    businesses,
    companies,
    formState,
    faqCodes,
    getBusinessData,
    getCompaniesData,
    getListCategories,
    checkNullForm,
    checkEmptyAnswers,
    checkExistAnswers,
    checkExistForm,
    isEmptyOrNull,
    getFaqCodes,
    relationCompaniesAndFaqCodes,
    getRelationCompaniesAndFaqCodes,
    chosenCompaniesAndFaqCodes,
    getKeywordByBusiness,
  };
});
