<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Paging from '@/components/common/pagination/Paging.vue';
import TableList from '@/components/common/table/List.vue';
import ArrowRight from '@/components/icon/ArrowRight.vue';
import ArrowRightSmall from '@/components/icon/ArrowRightSmall.vue';
import PageLayout from '@/pages/layouts/PageLayout.vue';
import router from '@/router';
import { useAuthStoreHook, useAuthStore } from '@/stores/auth.store';
import { useFaqSearchStore } from '@/stores/faqSearch.store';
import DatePicker from '@/components/common/DatePicker.vue';
import type { FormInstance } from 'ant-design-vue/es/form';
import { SearchOutlined } from '@ant-design/icons-vue';
import dayjs, { Dayjs } from 'dayjs';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { computed } from 'vue';
import { t } from '@/plugins/i18n';

import {
  BREAD_CRUMB_TYPE,
  END_YEAR_FLAG_VALUE,
  DATE_FORMAT,
} from '@/stores/constants/constant';

import type {
  FaqBreadCrumb,
  FaqTable,
  Category,
  Business
} from '@/types/interfaces/faq';

import { USER_TYPE, USER_FUNCTION_TYPE, USER_FUNCTION_FLAG_VALUE } from '@/stores/constants/constant';
import { breadcrumbItemProps } from 'ant-design-vue/lib/breadcrumb/BreadcrumbItem';

const store = useFaqSearchStore();
const userStore = useAuthStore();

const isLoading = ref<boolean>(true);
const isManager = ref<boolean>(false);
const isNotFaqUser = ref<boolean>(true);
const { authUser } = useAuthStoreHook();
const formRef = ref<FormInstance>();
const defaultFormats = ['YYYY/M/DD', 'YYYY/MM/DD', 'YY/MM/DD', 'MM/DD'];
const canEdit = ref<boolean>(false);
const showContactLink = ref<boolean>(false);

const relatedKeywords = ref<string[]>([]);
const featureFaqTable = ref<FaqTable>({
  pageSize: 5,
  currentPage: 1,
  pageSizeOptions: ['10', '30', '50'],
  totalItem: 0,
  data: []
});
const faqBusiness = ref<Business[]>([]);
const faqCategories = ref<Category[]>([]);

onMounted(async () => {
  scrollToTop();

  isLoading.value = true;

  const route = useRoute();
  const { isFaqCode } = route.query;
  const { companyGroupCode, faqCode, searchDate } = route.query;

  if (isFaqCode && isFaqCode == END_YEAR_FLAG_VALUE.END_YEAR) {
    store.formState.isFaqCode = true;
  } else {
    store.formState.isFaqCode = false;
  }

  if (userStore.authUser?.UserType == USER_TYPE.FAQ) {

    if (isFaqCode != END_YEAR_FLAG_VALUE.END_YEAR) {
      store.formState.isFaqCode = true;
    }
  }

  if (userStore.authUser?.UserType == USER_TYPE.EMPLOYEE) {
    if (isFaqCode == END_YEAR_FLAG_VALUE.END_YEAR) {
      store.formState.isFaqCode = false;
    }
  }

  if (userStore.authUser?.UserType == USER_TYPE.FAQ || userStore.authUser?.UserType == USER_TYPE.EMPLOYEE) {
    await router.push({
      path: '/faq/search/', query: {
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
      }
    });
  }

  if (userStore.authUser?.UserType == USER_TYPE.EMPLOYEE && !store.formState.isFaqCode && !userStore.isCompanyViewNormalFaq()) {
    message.error(t('faq-detail.user_not_permission'));
    store.clearData();
    isLoading.value = false;
    await router.push('/top');
    return;
  }

  let isViewFaqNormal = userStore.isViewFaqNormal();
  let isViewFaqEndYear = userStore.isViewFaqEndYear();

  if (isFaqCode && isFaqCode == END_YEAR_FLAG_VALUE.END_YEAR && !isViewFaqEndYear && userStore.authUser?.UserType != USER_TYPE.FAQ) {
    message.error(t('faq-detail.user_not_permission'));
    store.clearData();
    isLoading.value = false;
    await router.push('/top');
    return;
  } else if ((!isFaqCode || isFaqCode != END_YEAR_FLAG_VALUE.END_YEAR) && !isViewFaqNormal) {
    message.error(t('faq-detail.user_not_permission'));
    store.clearData();
    isLoading.value = false;
    await router.push('/top');
    return;
  }

  let isEditFaqNormal = userStore.isEditFaqNormal();
  let isEditFaqEndYear = userStore.isEditFaqEndYear();

  canEdit.value = isEditFaqNormal || isEditFaqEndYear;

  isManager.value = userStore.isManagerUser();

  if (userStore.authUser?.UserType == USER_TYPE.EMPLOYEE) {
    showContactLink.value = true;
  }

  store.formState.searchText = "";

  if (companyGroupCode) {
    store.formState.companyGroupCode = companyGroupCode as string;
  } else {
    store.formState.companyGroupCode = null;
  }

  if (faqCode) {
    store.formState.faqCode = faqCode as string;
  } else {
    store.formState.faqCode = null;
  }

  if (searchDate) {
    store.formState.selectedDate = dayjs(
      searchDate.toString(),
      'YYYY/MM/DD'
    );
  }

  store.parentCategories = [];
  store.faqCategories = [];
  store.relatedKeywords = [];
  store.businesses = [];
  store.faqCategories = [];

  store.clearSearchData();

  reloadingData(true);

  await store.getFaqBreadCrumbs();
  if (isManager.value) {
    await Promise.all([
      store.getCompaniesData(),
      store.getFaqCodes()
    ]);

    if (authUser?.UserType == USER_TYPE.MANAGER || authUser?.UserType == USER_TYPE.SYSTEM_ADMIN) {
      if (store.formState.companyGroupCode || store.formState.faqCode) {
        if (store.formState.isFaqCode) {
          await Promise.all([
            store.doGetKeywords(),
            store.getEndYearAvaiableData(),
            store.doGetFeatureFaq(),
          ]);
        } else {
          await Promise.all([
            store.doGetKeywords(),
            store.getAvaiableBusinessData(),
            store.doGetFeatureFaq(),
          ]);
        }

      }
    }
  } else {
    if (store.formState.isFaqCode) {
      await Promise.all([
        store.doGetKeywords(),
        store.getEndYearAvaiableData(),
        store.doGetFeatureFaq(),
      ]);
    } else {
      await Promise.all([
        store.doGetKeywords(),
        store.getAvaiableBusinessData(),
        store.doGetFeatureFaq(),
      ]);
    }
  }

  reloadingData(false);

});

const reloadingData = (isLoad: boolean) => {

  if (isLoad) {
    relatedKeywords.value = [];
    faqBusiness.value = [];
    faqCategories.value = [];

    featureFaqTable.value.data = [];
    featureFaqTable.value.pageSize = 5;
    featureFaqTable.value.totalItem = 0;
    featureFaqTable.value.currentPage = 1;

  } else {

    relatedKeywords.value = store.relatedKeywords;
    faqBusiness.value = store.businesses;
    faqCategories.value = store.faqCategories;
    featureFaqTable.value = { ...store.faqFeatureTable };
  }

  isLoading.value = isLoad;
}

const isNonEmptySearchText = computed(() => {
  return !store.checkEmptySearchText();
});

const companyGroupSelectChange = async (value: string) => {
  formRef.value?.validateFields([['faqCode']]);
  if (value) {

    store.formState.searchText = '';
    store.formState.faqCode = null;

    router.push({
      path: '/faq/search/', query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      }
    });

    isLoading.value = true;
    store.clearSearchData();

    reloadingData(true);

    if (store.formState.isFaqCode) {
      await Promise.all([
        store.doGetKeywords(),
        store.getEndYearAvaiableData(),
        store.doGetFeatureFaq(),
      ]);
    } else {
      await Promise.all([
        store.doGetKeywords(),
        store.getAvaiableBusinessData(),
        store.doGetFeatureFaq(),
      ]);
    }

    reloadingData(false);
  }
};

const faqCodeSelectChange = async (value: string) => {
  formRef.value?.validateFields([['companyGroupCode']]);
  if (value) {
    store.formState.companyGroupCode = null;
    store.formState.searchText = '';

    router.push({
      path: '/faq/search/', query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      }
    });

    isLoading.value = true;
    store.clearSearchData();

    reloadingData(true);

    if (store.formState.isFaqCode) {
      await Promise.all([
        store.doGetKeywords(),
        store.getEndYearAvaiableData(),
        store.doGetFeatureFaq(),
      ]);
    } else {
      await Promise.all([
        store.doGetKeywords(),
        store.getAvaiableBusinessData(),
        store.doGetFeatureFaq(),
      ]);
    }

    reloadingData(false);
  }
};

const validatorSearchValue = (value: any) => {
  return new Promise((resolve, reject) => {
    if (!store.formState.companyGroupCode
      && !store.formState.faqCode) {
      reject('');
    } else {
      resolve('');
    }
  });
};

const searchAction = () => {

  if (!isNonEmptySearchText.value) {
    return;
  }

  if (isManager.value) {
    formRef.value?.validateFields([['companyGroupCode']]);
    formRef.value?.validateFields([['faqCode']]);

    if (!store.formState.companyGroupCode
      && !store.formState.faqCode) {
      store.formState.searchText = store.formState.searchText;
      return;
    } else {
      store.formState.searchText = store.formState.searchText;

      router.push({
        path: '/faq/search-result/', query: {
          companyGroupCode: store.formState.companyGroupCode,
          faqCode: store.formState.faqCode,
          isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
          searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
          searchText: store.formState.searchText
        }
      });
    }
  } else {
    store.formState.searchText = store.formState.searchText;

    router.push({
      path: '/faq/search-result/', query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
        searchText: store.formState.searchText
      }
    });
  }
};

const handlerChangeDate = async (value: any) => {
  store.formState.selectedDate = value;

  if (!store.formState.selectedDate?.isValid()) {
    store.formState.selectedDate = null;
  }

  formRef.value?.validateFields([['companyGroupCode']]);
  formRef.value?.validateFields([['faqCode']]);

  if (!store.formState.companyGroupCode
    && !store.formState.faqCode) {
    return;
  }

  router.push({
    path: '/faq/search/', query: {
      companyGroupCode: store.formState.companyGroupCode,
      faqCode: store.formState.faqCode,
      isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
      searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
    }
  });

  isLoading.value = true;
  store.clearSearchData();
  reloadingData(true);

  if (store.formState.isFaqCode) {

    await Promise.all([
      store.doGetKeywords(),
      store.getEndYearAvaiableData(),
      store.doGetFeatureFaq(),
    ]);

  } else {
    await Promise.all([
      store.doGetKeywords(),
      store.getAvaiableBusinessData(),
      store.doGetFeatureFaq(),
    ]);
  }

  reloadingData(false);

}

const handlerClickedKeyword = (value: any) => {
  store.formState.searchText = value.trim();

  router.push({
    path: '/faq/search-result/', query: {
      companyGroupCode: store.formState.companyGroupCode,
      faqCode: store.formState.faqCode,
      isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
      searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      searchText: store.formState.searchText
    }
  });
}

const handlerClickedBusiness = (value: any) => {

  router.push({
    path: '/faq/search-category/', query: {
      companyGroupCode: store.formState.companyGroupCode,
      faqCode: store.formState.faqCode,
      isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
      searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      businessCode: value,
    }
  });
}

const handlerClickedCategory = async (value: any) => {

  router.push({
    path: '/faq/search-category/', query: {
      companyGroupCode: store.formState.companyGroupCode,
      faqCode: store.formState.faqCode,
      isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
      searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      faqCategory: value,
    }
  });

  store.formState.selectBusiness = "";
  store.formState.selectCategory = value;

}

const handlerClickBreadCrumb = async (item: FaqBreadCrumb, index: Number) => {

  if (index == (store.faqBreadCrumbs.length - 1)) {
    return;
  }

  if (item.type == BREAD_CRUMB_TYPE.TOP) {
    store.clearData();
    router.push("/top");
  } else if (item.type == BREAD_CRUMB_TYPE.TOP_FAQ) {
    store.clearData();
    router.push({
      path: '/faq/search/', query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      }
    });
  } else if (item.type == BREAD_CRUMB_TYPE.TOP_FAQ_END_YEAR) {
    router.push({
      path: '/faq/search/', query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      }
    });
  } else if (item.type == BREAD_CRUMB_TYPE.BUSINESS) {
    router.push({
      path: '/faq/search-category/', query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
        businessCode: item.code,
      }
    });

    isLoading.value = true;

    scrollToTop();
    isLoading.value = false;
  } else if (item.type == BREAD_CRUMB_TYPE.CATEGORY) {
    router.push({
      path: '/faq/search-category/', query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
        faqCategory: item.code,
      }
    });

  }
};

const clickedFaqFeature = (faq: any) => {
  router.push({
    path: '/faq/detail/', query: {
      faqNumber: faq.faqNumber,
      selectedDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      companyGroupCode: store.formState.companyGroupCode,
      faqCode: store.formState.faqCode,
      isFeature: 1,
      isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
    }
  });
};

const onChangePageFeature = async (onChange: any) => {
  isLoading.value = true;
  store.faqFeatureTable.currentPage = onChange;
  store.faqFeatureTable.pageSize = 5;

  await store.doGetFeatureFaq();
  isLoading.value = false;
};

const clickedToContact = async () => {
  router.push('/contact');
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

</script>

<template class="font">
  <page-layout :is-loading="isLoading">
    <div class="main-page">
      <div class="navigation">
        <div class="navigation-breadcrumb">
          <div class="feature-keyword-item" v-for="(item, index) in store.faqBreadCrumbs" key="index">
            <span :class="{ 'current': store.faqBreadCrumbs.length - 1 == index, 'first': index == 0 }"
              @click="handlerClickBreadCrumb(item, index)">
              {{ item.name }}
            </span>
            <span class="item-space">
              <ArrowRightSmall v-if="store.faqBreadCrumbs.length - 1 != index"></ArrowRightSmall>
            </span>
          </div>
        </div>
        <div class="navigation-btn-group">
          <router-link :to="{ name: 'faq-upload' }" v-if="canEdit">
            <a-button type="primary" class="btn-common btn-rounned">
              {{ $t('faq.form.button.import') }}
            </a-button>
          </router-link>

          <router-link :to="{ name: 'faq-export' }" v-if="isManager">
            <a-button type="primary" class="btn-common btn-rounned">
              {{ $t('faq.form.button.export') }}
            </a-button>
          </router-link>

          <router-link :to="{ name: 'faq-create' }" v-if="canEdit">
            <a-button type="primary" class="btn-common btn-rounned">
              {{ $t('faq.form.button.createNew') }}
            </a-button>
          </router-link>
        </div>
      </div>

      <div class="panel-box search-form">
        <a-form ref="formRef" :model="store.formState">
          <h3 class="mb-16 text-center text-size-title text-primary" v-if="isManager">{{
            $t('faq-search.search.searchTitle') }}</h3>
          <a-row v-if="isManager">
            <a-col :lg="6" :md="24" :sm="24" :xs="24" class="m-t-10">
              <div class="title d-flex ">
                <span>
                  {{ $t('faq.form.label.affiliatedCompany') }}
                </span>
                <div class="bagde bagde-error m-l-15">
                  {{ $t('faq.form.label.required') }}
                </div>
              </div>
            </a-col>
            <a-col :lg="18" :md="24" :sm="24" :xs="24">
              <a-row>
                <a-col :md="6" :sm="24" :xs="24" class="m-t-10">
                  <div class="title d-flex">
                    <span>
                      {{ $t('faq.form.label.companyGroup') }}
                    </span>
                  </div>
                </a-col>
                <a-col :md="18" :sm="24" :xs="24">
                  <a-form-item name="companyGroupCode" :rules="[
                    {
                      asyncValidator: (value: any) => validatorSearchValue(value),
                      message: $t('faq.form.label.companyGroup') + $t('faq.form.required'),
                      trigger: ['change']
                    }
                  ]">
                    <a-select v-model:value="store.formState.companyGroupCode" class="input-option"
                      :placeholder="$t('faq.form.label.companyCodePlaceholder')" size="large"
                      @change="companyGroupSelectChange" :showSearch="true" optionFilterProp="companyGroupName"
                      :options="store.companies" :fieldNames="{
                        value: 'companyGroupCode',
                        label: 'companyGroupName'
                      }">
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :md="6" :sm="24" :xs="24" class="m-t-10">
                  <div class="title d-flex">
                    <span>
                      {{ $t('faq.form.label.faqCode') }}
                    </span>
                  </div>
                </a-col>
                <a-col :md="18" :sm="24" :xs="24">
                  <a-form-item name="faqCode" :rules="[
                    {
                      asyncValidator: (value: any) => validatorSearchValue(value),
                      message: $t('faq.form.label.faqCode') + $t('faq.form.required'),
                      trigger: ['change']
                    }
                  ]">
                    <a-select v-model:value="store.formState.faqCode" class="input-option"
                      :placeholder="$t('faq.form.label.faqCodePlaceholder')" size="large" @change="faqCodeSelectChange"
                      :showSearch="true" optionFilterProp="faqName" :options="store.faqCodes" :fieldNames="{
                        value: 'faqCode',
                        label: 'faqName'
                      }">
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
          </a-row>

          <a-row v-if="isManager" class="m-t-5">
            <a-col :lg="6" :md="24" :sm="24" :xs="24" class="m-t-10">
              <div class="title">
                <span>{{ $t('faq-search.search.faqSearchDate') }} </span>
              </div>
            </a-col>
            <a-col :lg="18" :md="24" :sm="24" :xs="24">
              <a-row>
                <a-col :lg="6" :md="6" :sm="24" :xs="24"> </a-col>
                <a-col :lg="6" :md="18" :sm="24" :xs="24">
                  <date-picker size="large" class="input-full-width faq-date-input" :format="defaultFormats"
                    v-model:value="store.formState.selectedDate" :chosen-date="store.formState.selectedDate || undefined"
                    :place-holder="$t('faq.form.label.displayDatePlaceholder')" @change-date="handlerChangeDate" />
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <hr class="section-break" v-if="isManager" />
          <h3 class="mb-16 text-center text-size-title text-primary">{{ $t('faq-search.search.searchKeywordTitle')
          }}</h3>
          <a-row>
            <a-col :sm="24" :xs="24">
              <a-input-search class="input-search" v-model:value="store.formState.searchText" size="large"
                @search="searchAction" :placeholder="$t('faq.form.label.inputSearchPlaceholder')">
                <template #enterButton>
                  <a-button class="btn-search" :disabled="!isNonEmptySearchText">
                    <SearchOutlined /> <span class="btn-search-text">{{ $t('faq-search.search.searchButtonText') }}</span>
                  </a-button>
                </template>
              </a-input-search>
            </a-col>
          </a-row>
          <a-row class="mt-10 search-hint">
            <a-col :sm="24" :xs="24">
              <span class="text-help text-size-hint">
                {{ $t('faq-search.search.searchHint') }}
              </span>
            </a-col>
          </a-row>
          <a-row class="mt-16 feature-keywords mb-10" :gutter="20">
            <a-col :sm="24" :xs="24" :md="6">
              <span class="text-normal text-size-normal">
                {{ $t('faq-search.search.searchedWords') }}
              </span>
            </a-col>
            <a-col :sm="24" :xs="24" :md="18" class="feature-keyword-items">
              <div class="feature-keyword-item" v-for="(item, index) in relatedKeywords" key="index"
                @click="handlerClickedKeyword(item)">
                <span>
                  {{ item }}
                </span>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="panel-box feature-faqs mt-40">
        <h3 class="mb-32 text-center text-size-title text-primary">{{ $t('faq-search.search.featureKeywords') }}</h3>
        <div class="section-content">
          <div class="featured-keywords">
            <div class="table-content table-faq">
              <table-list :table-data="featureFaqTable?.data" @clicked="clickedFaqFeature"></table-list>
            </div>

            <div class="table-footer" v-if="featureFaqTable?.data.length > 0">
              <Paging :current-page="featureFaqTable?.currentPage" :total="featureFaqTable?.totalItem"
                :page-size="featureFaqTable?.pageSize" @change-page="onChangePageFeature">
              </Paging>
            </div>
          </div>
        </div>

      </div>
      <div class="panel-box faq-categories mt-40">
        <h3 class="mb-26 text-center text-size-title text-primary">{{ $t('faq-search.search.faqCategory') }}</h3>
        <div class="faq-category-items mt-30" v-if="store.formState.isFaqCode == false">
          <div class="faq-category-item" v-for="(item, index) in faqBusiness" key="index"
            @click="handlerClickedBusiness(item.businessCode)">
            <span class="faq-category-item-title">{{ item.businessName }}</span>
            <span class="faq-category-item-icon">
              <ArrowRight></ArrowRight>
            </span>
          </div>
        </div>
        <div class="faq-category-items mt-40" v-else>
          <div class="faq-category-item" v-for="(item, index) in faqCategories" key="index"
            @click="handlerClickedCategory(item.categoryCode)">
            <span class="faq-category-item-title">{{ item.categoryName }}</span>
            <span class="faq-category-item-icon">
              <ArrowRight></ArrowRight>
            </span>
          </div>
        </div>
      </div>
      <div class="mb-60 mt-40 faq-redirect-items text-center" v-if="showContactLink">
        <div class="faq-redirect-item">
          <div class="faq-category-item " @click="clickedToContact">
            <span class="faq-category-item-title">{{ $t('faq-search.search.linkToContactForm') }}</span>
            <span class="faq-category-item-icon">
              <ArrowRight></ArrowRight>
            </span>
          </div>
        </div>
      </div>
    </div>
  </page-layout>
</template>

<style scoped>
@import './../../assets/styles/common.css';
@import './../../assets/styles/page.css';
@import './../../assets/styles/button.css';


.keyword-search {
  padding-left: 40px;
  height: 58px !important;
  max-width: 100%;
  margin-bottom: 10px;
}

.btn-clear-search {
  height: 40px;
  margin-left: 15px;
}

.select {
  width: 500px;
}

.panel-search {
  flex-direction: row;
}

@media screen and (max-width: 980px) {
  .select {
    width: 100%;
  }

  .btn-clear-search {
    margin-left: 0;
  }


}
</style>
