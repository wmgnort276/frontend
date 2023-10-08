import { defineStore } from 'pinia';
import { ref } from 'vue';

import type {
  SearchFormRequest,
  Category,
  Business,
  Company,
  FaqCode,
  CategoryTreeItem,
  FaqTable,
  CategoryParent,
  FaqBreadCrumb
} from '@/types/interfaces/faq';

import {
  getBusiness,
  getCategoryLevelTwo,
  getCompanies,
  getCompanyFaqCodes,
  searchFaq,
  getKeywords,
  getCategoryTree,
  getFeatureFaq,
  getAvaiableBusiness,
  getAvaiableCategory,
  getEndYearCategory,
} from '@/api/faq.api';

import dayjs, { Dayjs } from 'dayjs';

import {
  T_TIME_END_DEFAULT,
  BREAD_CRUMB_TYPE
} from '@/stores/constants/constant';
import { useAuthStoreHook } from '@/stores/auth.store';

import { USER_TYPE, USER_FUNCTION_TYPE, USER_FUNCTION_FLAG_VALUE } from '@/stores/constants/constant';

export const useFaqSearchStore = defineStore('faqSearch', () => {
  const mapCategories = ref<Category[][]>([[], [], [], [], []]);
  const businesses = ref<Business[]>([]);

  const faqCategories = ref<Category[]>([]);

  const faqBreadCrumbs = ref<FaqBreadCrumb[]>([]);
  const faqBreadCrumbsDetail = ref<FaqBreadCrumb[]>([]);

  const companies = ref<Company[]>([]);
  const faqCodes = ref<FaqCode[]>([]);

  const relatedKeywords = ref<string[]>([]);

  const categoryTree = ref<CategoryTreeItem[]>([]);

  const parentCategories = ref<CategoryParent[]>([]);

  const faqSearchPageSize = ref(10);

  const isSearch = ref<boolean>(false);

  const currentCategory = ref<string>("");

  const faqSearchTable = ref<FaqTable>({
    pageSize: 10,
    currentPage: 1,
    pageSizeOptions: ['10', '30', '50'],
    totalItem: 0,
    data: []
  });

  const faqFeatureTable = ref<FaqTable>({
    pageSize: 5,
    currentPage: 1,
    pageSizeOptions: ['10', '30', '50'],
    totalItem: 0,
    data: []
  });

  const formState = ref<SearchFormRequest>({
    companyGroupCode: '',
    faqCode: '',
    selectedDate: null,
    searchText: '',
    selectBusiness: '',
    selectCategory: '',
    isFaqCode: false,
    selectedTree: [],
    searchTextDisplay: ''
  });

  const clearData = () => {
    formState.value.searchText = "";
    formState.value.selectBusiness = "";
    formState.value.selectCategory = "";

    formState.value.selectedTree = [];
    faqFeatureTable.value.data = [];
    faqFeatureTable.value.pageSize = 5;
    faqFeatureTable.value.totalItem = 0;
    faqFeatureTable.value.currentPage = 1;

    faqSearchTable.value.currentPage = 1;
    faqSearchTable.value.totalItem = 0;
    faqSearchTable.value.pageSize = 10;
    faqSearchTable.value.data = [];

    parentCategories.value = [];
    businesses.value = [];
    relatedKeywords.value = [];
  };

  const clearAllData = () => {
    formState.value.selectedDate = null;
    formState.value.faqCode = "";
    formState.value.companyGroupCode = "";

    formState.value.searchText = "";
    formState.value.selectBusiness = "";
    formState.value.selectCategory = "";

    formState.value.selectedTree = [];
    faqFeatureTable.value.data = [];
    faqFeatureTable.value.pageSize = 5;
    faqFeatureTable.value.totalItem = 0;
    faqFeatureTable.value.currentPage = 1;

    faqSearchTable.value.currentPage = 1;
    faqSearchTable.value.totalItem = 0;
    faqSearchTable.value.pageSize = 10;
    faqSearchTable.value.data = [];

    parentCategories.value = [];
    businesses.value = [];
    relatedKeywords.value = [];
  };

  const clearSearchData = () => {
    formState.value.selectedTree = [];
    faqFeatureTable.value.data = [];
    faqFeatureTable.value.pageSize = 5;
    faqFeatureTable.value.totalItem = 0;
    faqFeatureTable.value.currentPage = 1;

    faqSearchTable.value.currentPage = 1;
    faqSearchTable.value.totalItem = 0;
    faqSearchTable.value.pageSize = 10;
    faqSearchTable.value.data = [];

    parentCategories.value = [];
    businesses.value = [];
    relatedKeywords.value = [];
    faqCategories.value = [];
  }

  const getBusinessData = () => {
    return getBusiness()
      .then((response) => {
        businesses.value = response.data;
      })
      .catch((error) => {
        Promise.reject(error);
      });
  };

  const getCompaniesData = () => {
    return getCompanies()
      .then((response: any) => {
        companies.value = [];

        for (let index = 0; index <= response.data.length - 1; index++) {
          let company = response.data[index];

          companies.value.push({
            companyGroupCode: company.companyGroupCode,
            companyGroupName: company.companyGroupCode + "_" + company.companyGroupName
          });
        }
      })
      .catch((error) => {
        Promise.reject(error);
      });
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
        faqCodes.value = [];
        for (let index = 0; index <= response.data.length - 1; index++) {
          let companyFaq = response.data[index];

          faqCodes.value.push({
            faqCode: companyFaq.faqCode,
            faqName: companyFaq.faqCode + "_" + companyFaq.faqName
          });
        }
      })
      .catch((error) => {
        Promise.reject(error);
      });
  };

  const doSearchFaq = () => {
    let param = '';
    param += `pageIndex=${faqSearchTable.value.currentPage}`;
    param += `&pageSize=${faqSearchTable.value.pageSize}`;

    if (formState.value.companyGroupCode && formState.value.companyGroupCode != '') {
      param += `&companyGroupCode=${formState.value.companyGroupCode}`;
    } else if (formState.value.faqCode && formState.value.faqCode != '') {
      param += `&faqCode=${formState.value.faqCode}`;
    }

    if (formState.value.searchText && formState.value.searchText != '') {
      param += `&searchKey=${formState.value.searchText}`;
    }

    if (formState.value.selectCategory && formState.value.selectCategory != '') {
      param += `&faqCategoryCode=${formState.value.selectCategory}`;
    }

    if (formState.value.selectBusiness && formState.value.selectBusiness != '') {
      param += `&businessCode=${formState.value.selectBusiness}`;
    }

    if (formState.value.selectedDate) {
      let date = (dayjs(formState.value.selectedDate).format('YYYY-MM-DD') || T_TIME_END_DEFAULT) + 'T00:00:00Z'
      param += `&selectedDate=${date}`;
    }

    if (formState.value.isFaqCode && formState.value.isFaqCode) {
      param += `&isFaqCode=1`;
    }

    isSearch.value = true;

    return searchFaq(param)
      .then((response: any) => {
        faqSearchTable.value.data = response.data.questions;
        faqSearchTable.value.totalItem = response.data.count;
      })
      .catch((error) => {
        Promise.reject(error);
      });
  };

  const doGetKeywords = () => {
    let param = '';
    param += `pageIndex=${faqSearchTable.value.currentPage}`;
    param += `&pageSize=${faqSearchTable.value.pageSize}`;

    if (formState.value.companyGroupCode && formState.value.companyGroupCode != '') {
      param += `&companyGroupCode=${formState.value.companyGroupCode}`;
    } else if (formState.value.faqCode && formState.value.faqCode != '') {
      param += `&faqCode=${formState.value.faqCode}`;
    }

    if (formState.value.selectedDate) {
      let date = (dayjs(formState.value.selectedDate).format('YYYY-MM-DD') || T_TIME_END_DEFAULT) + 'T00:00:00Z'
      param += `&selectedDate=${date}`;
    }

    if (formState.value.isFaqCode && formState.value.isFaqCode) {
      param += `&isFaqCode=1`;
    }

    return getKeywords(param)
      .then((response: any) => {
        relatedKeywords.value = response.data;
      })
      .catch((error) => {
        Promise.reject(error);
      });
  };

  const doGetCategoryTree = () => {
    let param = '';

    if (formState.value.companyGroupCode && formState.value.companyGroupCode != '') {
      param += `&companyGroupCode=${formState.value.companyGroupCode}`;
    } else if (formState.value.faqCode && formState.value.faqCode != '') {
      param += `&faqCode=${formState.value.faqCode}`;
    }

    if (formState.value.searchText && formState.value.searchText != '') {
      param += `&searchKey=${formState.value.searchText}`;
    }

    if (formState.value.selectCategory && formState.value.selectCategory != '') {
      param += `&faqCategoryCode=${formState.value.selectCategory}`;
    }

    if (formState.value.selectBusiness && formState.value.selectBusiness != '') {
      param += `&businessCode=${formState.value.selectBusiness}`;
    }

    if (formState.value.selectedDate) {
      let date = (dayjs(formState.value.selectedDate).format('YYYY-MM-DD') || T_TIME_END_DEFAULT) + 'T00:00:00Z'
      param += `&selectedDate=${date}`;
    }

    if (formState.value.isFaqCode && formState.value.isFaqCode) {
      param += `&isFaqCode=1`;
    }

    return getCategoryTree(param)
      .then((response: any) => {
        let treeItems = response.data;
      })
      .catch((error) => {
        Promise.reject(error);
      });
  };

  const checkEmptySearchText = () => {
    return (
      isEmptyOrNull(formState.value.searchText)
    );
  };

  const getFaqBreadCrumbs = () => {
    faqBreadCrumbs.value = [];

    const auth = useAuthStoreHook().authUser;

    if (auth?.UserType !== USER_TYPE.FAQ) {
      faqBreadCrumbs.value.push({
        type: BREAD_CRUMB_TYPE.TOP,
        code: "",
        name: "トップ",
        class: ''
      });
    }

    if (formState.value.isFaqCode) {
      faqBreadCrumbs.value.push({
        type: BREAD_CRUMB_TYPE.TOP_FAQ_END_YEAR,
        code: "",
        name: "FAQ年調",
        class: ''
      });
    } else {
      faqBreadCrumbs.value.push({
        type: BREAD_CRUMB_TYPE.TOP_FAQ,
        code: "",
        name: "FAQトップ",
        class: ''
      });
    }

    parentCategories.value?.forEach(element => {
      faqBreadCrumbs.value.push({
        code: element.code,
        name: element.name,
        type: element.type,
        class: ''
      })
    });

    return faqBreadCrumbs.value;
  };

  const doGetFeatureFaq = () => {
    let param = '';

    param += `pageIndex=${faqFeatureTable.value.currentPage}`;
    param += `&pageSize=${faqFeatureTable.value.pageSize}`;

    if (formState.value.companyGroupCode && formState.value.companyGroupCode != '') {
      param += `&companyGroupCode=${formState.value.companyGroupCode}`;
    } else if (formState.value.faqCode && formState.value.faqCode != '') {
      param += `&faqCode=${formState.value.faqCode}`;
    }

    if (formState.value.selectBusiness) {
      param += `&businessCode=${formState.value.selectBusiness}`;
    }

    if (formState.value.selectedDate) {
      let date = (dayjs(formState.value.selectedDate).format('YYYY-MM-DD') || T_TIME_END_DEFAULT) + 'T00:00:00Z'
      param += `&selectedDate=${date}`;
    }

    if (formState.value.isFaqCode && formState.value.isFaqCode) {
      param += `&isFaqCode=1`;
    }

    return getFeatureFaq(param)
      .then((response: any) => {
        faqFeatureTable.value.data = response.data.questions;
        faqFeatureTable.value.totalItem = response.data.count;
      })
      .catch((error) => {
        Promise.reject(error);
      });
  };

  const getAvaiableBusinessData = () => {
    let param = '';

    if (formState.value.isFaqCode && formState.value.isFaqCode) {
      param += `isFaqCode=1`;
    } else {
      param += `isFaqCode=0`;
    }

    if (formState.value.companyGroupCode && formState.value.companyGroupCode != '') {
      param += `&companyGroupCode=${formState.value.companyGroupCode}`;
    } else if (formState.value.faqCode && formState.value.faqCode != '') {
      param += `&faqCode=${formState.value.faqCode}`;
    }

    if (formState.value.searchText && formState.value.searchText != '') {
      param += `&searchKey=${formState.value.searchText}`;
    }

    if (formState.value.selectedDate) {
      let date = (dayjs(formState.value.selectedDate).format('YYYY-MM-DD') || T_TIME_END_DEFAULT) + 'T00:00:00Z'
      param += `&selectedDate=${date}`;
    }

    return getAvaiableBusiness(param)
      .then((response) => {
        businesses.value = response.data;
      })
      .catch((error) => {
        Promise.reject(error);
      });
  };

  const getEndYearAvaiableData = () => {
    let param = '';

    if (formState.value.companyGroupCode && formState.value.companyGroupCode != '') {
      param += `&companyGroupCode=${formState.value.companyGroupCode}`;
    } else if (formState.value.faqCode && formState.value.faqCode != '') {
      param += `&faqCode=${formState.value.faqCode}`;
    }

    if (formState.value.selectedDate) {
      let date = (dayjs(formState.value.selectedDate).format('YYYY-MM-DD') || T_TIME_END_DEFAULT) + 'T00:00:00Z'
      param += `&selectedDate=${date}`;
    }

    if (formState.value.isFaqCode && formState.value.isFaqCode) {
      param += `&isFaqCode=1`;
    }

    return getEndYearCategory(param)
      .then((response) => {
        faqCategories.value = response.data;
        //businesses.value = response.data;
      })
      .catch((error) => {
        Promise.reject(error);
      });
  };

  const getAvaiableCategoryData = () => {
    let param = '';

    if (formState.value.isFaqCode && formState.value.isFaqCode) {
      param += `isFaqCode=1`;
    } else {
      param += `isFaqCode=0`;
    }

    if (formState.value.companyGroupCode && formState.value.companyGroupCode != '') {
      param += `&companyGroupCode=${formState.value.companyGroupCode}`;
    } else if (formState.value.faqCode && formState.value.faqCode != '') {
      param += `&faqCode=${formState.value.faqCode}`;
    }

    if (formState.value.selectedDate) {
      let date = (dayjs(formState.value.selectedDate).format('YYYY-MM-DD') || T_TIME_END_DEFAULT) + 'T00:00:00Z'
      param += `&selectedDate=${date}`;
    }

    if (formState.value.selectCategory && formState.value.selectCategory != '') {
      param += `&faqCategory=${formState.value.selectCategory}`;
    }

    if (formState.value.selectBusiness && formState.value.selectBusiness != '') {
      param += `&businessCode=${formState.value.selectBusiness}`;
    }

    return getAvaiableCategory(param)
      .then((response) => {
        faqCategories.value = response.data.categories;
        parentCategories.value = response.data.parents;
        if (parentCategories.value?.length > 0) {
          currentCategory.value = response.data.parents[response.data.parents.length - 1].name;
        }
      })
      .catch((error) => {
        Promise.reject(error);
      });
  };

  const getFaqBreadCrumbsDetail = (data: any) => {
    faqBreadCrumbsDetail.value = [];

    const auth = useAuthStoreHook().authUser;

    if (auth?.UserType !== USER_TYPE.FAQ) {
      faqBreadCrumbsDetail.value.push({
        type: BREAD_CRUMB_TYPE.TOP,
        code: '',
        name: 'トップ',
        class: ''
      });
    }

    if (formState.value.isFaqCode) {
      faqBreadCrumbsDetail.value.push({
        type: BREAD_CRUMB_TYPE.TOP_FAQ_END_YEAR,
        code: '',
        name: 'FAQ年調',
        class: ''
      });
    } else {
      faqBreadCrumbsDetail.value.push({
        type: BREAD_CRUMB_TYPE.TOP_FAQ,
        code: '',
        name: 'FAQトップ',
        class: ''
      });
    }

    if (data) {
      data.forEach((element: any) => {
        faqBreadCrumbsDetail.value.push({
          code: element.code,
          name: element.name,
          type: element.type,
          class: element.class ?? ''
        });
      });
    }

    return faqBreadCrumbsDetail.value;
  };

  return {
    mapCategories,
    businesses,
    companies,
    formState,
    faqCodes,
    categoryTree,
    faqSearchTable,
    relatedKeywords,
    faqFeatureTable,
    faqSearchPageSize,
    isSearch,
    faqCategories,
    parentCategories,
    currentCategory,
    faqBreadCrumbs,
    faqBreadCrumbsDetail,
    getBusinessData,
    getCompaniesData,
    getListCategories,
    isEmptyOrNull,
    getFaqCodes,
    doSearchFaq,
    doGetKeywords,
    doGetCategoryTree,
    doGetFeatureFaq,
    clearData,
    clearSearchData,
    clearAllData,
    checkEmptySearchText,
    getAvaiableBusinessData,
    getAvaiableCategoryData,
    getFaqBreadCrumbs,
    getEndYearAvaiableData,
    getFaqBreadCrumbsDetail
  };
});
