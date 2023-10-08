<script setup lang="ts">
import { onMounted, ref, onBeforeMount } from 'vue';
import Paging from '@/components/common/pagination/Paging.vue';
import TableList from '@/components/common/table/List.vue';
import ArrowRight from '@/components/icon/ArrowRight.vue';
import PageLayout from '@/pages/layouts/PageLayout.vue';
import type { CategoryParent } from '@/types/interfaces/faq';
import router from '@/router';
import { useAuthStoreHook, useAuthStore } from '@/stores/auth.store';
import { USER_TYPE, END_YEAR_FLAG_VALUE, DATE_FORMAT } from '@/stores/constants/constant';
import { useFaqSearchStore } from '@/stores/faqSearch.store';
import DatePicker from '@/components/common/DatePicker.vue';
import type { FormInstance } from 'ant-design-vue/es/form';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { computed } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import {
  BREAD_CRUMB_TYPE
} from '@/stores/constants/constant';
import type {
  FaqBreadCrumb
} from '@/types/interfaces/faq';
import { t } from '@/plugins/i18n';

const store = useFaqSearchStore();
const userStore = useAuthStore();

const isLoading = ref<boolean>(true);
const isManager = ref<boolean>(false);
const isNotFaqUser = ref<boolean>(true);
const { authUser } = useAuthStoreHook();
const formRef = ref<FormInstance>();
const defaultFormats = ['YYYY/M/DD', 'YYYY/MM/DD', 'YY/MM/DD', 'MM/DD'];

const canEdit = ref<boolean>(false);

const isNonEmptySearchText = computed(() => {
  return !store.checkEmptySearchText();
});

onMounted(async () => {
  scrollToTop();

  const route = useRoute();
  const { isFaqCode, businessCode, faqCategory, companyGroupCode, faqCode, searchDate } = route.query;

  if (isFaqCode && isFaqCode == END_YEAR_FLAG_VALUE.END_YEAR) {
    store.formState.isFaqCode = true;
  }

  if (userStore.authUser?.UserType == USER_TYPE.FAQ && isFaqCode != END_YEAR_FLAG_VALUE.END_YEAR) {

    store.formState.isFaqCode = true;
    store.clearData()
    router.push({
      path: '/faq/search/', query: {
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
      }
    });

    return;

  } else if (userStore.authUser?.UserType == USER_TYPE.EMPLOYEE && isFaqCode && isFaqCode == END_YEAR_FLAG_VALUE.END_YEAR) {
    store.formState.isFaqCode = false;

    store.clearData();

    router.push({
      path: '/faq/search/', query: {
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
      }
    });
    return;
  }

  if (userStore.authUser?.UserType == USER_TYPE.EMPLOYEE && !store.formState.isFaqCode && !userStore.isCompanyViewNormalFaq()) {
    message.error(t('faq-detail.user_not_permission'));
    store.clearData();
    await router.push('/top');
    return;
  }

  let isViewFaqNormal = userStore.isViewFaqNormal();
  let isViewFaqEndYear = userStore.isViewFaqEndYear();

  if (isFaqCode && isFaqCode == END_YEAR_FLAG_VALUE.END_YEAR && !isViewFaqEndYear && userStore.authUser?.UserType != USER_TYPE.FAQ) {
    message.error(t('faq-detail.user_not_permission'));
    store.clearData();
    await router.push('/top');
    return;
  } else if ((!isFaqCode || isFaqCode != END_YEAR_FLAG_VALUE.END_YEAR) && !isViewFaqNormal) {
    message.error(t('faq-detail.user_not_permission'));
    store.clearData();
    await router.push('/top');
    return;
  }

  let isEditFaqNormal = userStore.isEditFaqNormal();
  let isEditFaqEndYear = userStore.isEditFaqEndYear();

  canEdit.value = isEditFaqNormal || isEditFaqEndYear;

  isManager.value = userStore.isManagerUser();

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

  if (businessCode) {
    store.formState.selectBusiness = businessCode as string;
  }

  if (faqCategory) {
    store.formState.selectCategory = faqCategory as string;
  }

  store.parentCategories = [];
  store.faqCategories = [];
  store.relatedKeywords = [];
  store.businesses = [];
  store.faqCategories = [];

  if (isManager.value) {

    if (store.formState.companyGroupCode || store.formState.faqCode) {
      await Promise.all([
        store.getCompaniesData(),
        store.getFaqCodes(),
        store.getAvaiableCategoryData(),
        store.doSearchFaq(),
        store.doGetKeywords(),
      ]);
    } else {
      store.clearData();
      router.push({
        path: '/faq/search/', query: {
          companyGroupCode: store.formState.companyGroupCode,
          faqCode: store.formState.faqCode,
          isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
          searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
        }
      });
    }


  } else {
    await Promise.all([
      store.getAvaiableCategoryData(),
      store.doSearchFaq(),
      store.doGetKeywords(),
    ]);
  }

  store.getFaqBreadCrumbs();

  isLoading.value = false;
});

const companyGroupSelectChange = async (value: string) => {
  if (value) {
    store.formState.searchText = '';
    store.formState.faqCode = null;

    store.clearData();

    router.push({
      path: '/faq/search/', query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      }
    });
  }
};

const faqCodeSelectChange = async (value: string) => {

  if (value) {

    store.formState.companyGroupCode = null;
    store.formState.searchText = '';

    store.clearData();

    router.push({
      path: '/faq/search/', query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      }
    });
  }
};

const validatorSearchValue = (value: any) => {
  return new Promise((resolve, reject) => {
    if (store.formState.companyGroupCode === '' && store.formState.faqCode === '') {
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

  formRef.value?.validateFields([['companyGroupCode']]);
  formRef.value?.validateFields([['faqCode']]);

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

};

const handlerChangeDate = async (value: any) => {
  store.formState.selectedDate = value;

  if (!store.formState.selectedDate?.isValid()) {
    store.formState.selectedDate = null;
  }

  store.clearSearchData();

  router.push({
    path: '/faq/search/', query: {
      companyGroupCode: store.formState.companyGroupCode,
      faqCode: store.formState.faqCode,
      isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
      searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
    }
  });

}

const handlerClickedCategory = async (value: any, index: Number) => {

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

  isLoading.value = true;

  store.clearSearchData();

  await Promise.all([
    store.getAvaiableCategoryData(),
    store.doSearchFaq(),
    store.doGetKeywords(),
  ]);

  store.getFaqBreadCrumbs();

  isLoading.value = false;
}

const handlerClickCategoryHistory = async (value: CategoryParent, index: Number) => {

  if (index == (store.parentCategories.length - 1)) {
    return;
  }

  if (value.type == BREAD_CRUMB_TYPE.BUSINESS) {
    router.push({
      path: '/faq/search-category/', query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
        businessCode: value.code,
      }
    });

    store.formState.selectBusiness = value.code;
    store.formState.selectCategory = "";
  } else {
    router.push({
      path: '/faq/search-category/', query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
        faqCategory: value.code,
      }
    });

    store.formState.selectBusiness = "";
    store.formState.selectCategory = value.code;
  }

  store.clearSearchData();

  isLoading.value = true;
  await Promise.all([
    store.getAvaiableCategoryData(),
    store.doSearchFaq(),
    store.doGetKeywords(),
  ]);
  store.getFaqBreadCrumbs();
  isLoading.value = false;

};

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
    store.clearData();

    router.push({
      path: '/faq/search/', query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      }
    });
  } else if (item.type == BREAD_CRUMB_TYPE.BUSINESS) {
    store.clearData();
    router.push({
      path: '/faq/search-category/', query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
        businessCode: item.code,
      }
    });

    store.formState.selectBusiness = item.code;
    store.formState.selectCategory = "";
    isLoading.value = true;
    store.clearSearchData();

    await Promise.all([
      store.getAvaiableCategoryData(),
      store.doSearchFaq(),
      store.doGetKeywords(),
    ]);

    store.getFaqBreadCrumbs();
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

    store.formState.selectCategory = item.code;

    isLoading.value = true;
    store.clearSearchData();
    await Promise.all([
      store.getAvaiableCategoryData(),
      store.doSearchFaq(),
      store.doGetKeywords(),
    ]);

    scrollToTop();
    store.getFaqBreadCrumbs();
    isLoading.value = false;
  }
};

const clickedFaq = (faq: any) => {

  router.push({
    path: '/faq/detail/', query: {
      faqNumber: faq.faqNumber,
      selectedDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      companyGroupCode: store.formState.companyGroupCode,
      faqCode: store.formState.faqCode,
      isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
    }
  }
  );
};

const onChangePageSearch = async (onChange: any) => {
  isLoading.value = true;

  store.faqSearchTable.currentPage = onChange;
  store.faqSearchTable.pageSize = 10;

  await store.doSearchFaq();
  isLoading.value = false;
};

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
              <div class="title d-flex">
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
                      message: $t('faq.form.label.companyCode') + $t('faq.form.required'),
                      trigger: []
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
                      trigger: []
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

          <h3 class="mb-20 text-center text-size-title text-primary">
            <span>{{ store.currentCategory }}</span>{{ $t('faq-search.searchCategory.title') }}
          </h3>
          <a-row>
            <a-col :sm="24" :xs="24">
              <div class="mt-10 faq-category-items">
                <div class="faq-category-item" v-for="(item, index) in store.faqCategories" :key="index"
                  @click="handlerClickedCategory(item.categoryCode, index)">
                  <span class="faq-category-item-title">{{ item.categoryName }}</span>
                  <span class="faq-category-item-icon">
                    <ArrowRight></ArrowRight>
                  </span>
                </div>
              </div>
            </a-col>
          </a-row>
          <a-row class="mt-30 category-links" :gutter="5">
            <a-col :sm="24" :xs="24" :md="4">
              <span class="text-normal text-size-normal">
                {{ $t('faq-search.search.searchedCategoryLink') }}
              </span>
            </a-col>
            <a-col :sm="24" :xs="24" :md="20" class="feature-keyword-items">
              <div class="feature-keyword-item category-history-item" v-for="(item, index) in store.parentCategories"
                key="index" @click="handlerClickCategoryHistory(item, index)">
                <span :class="{ 'current': store.parentCategories.length - 1 == index }">
                  {{ item.name }}
                </span>
                <span class="item-space">
                  <ArrowRight v-if="store.parentCategories.length - 1 != index"></ArrowRight>
                </span>

              </div>
            </a-col>
          </a-row>
        </a-form>

      </div>
      <div class="panel-box result-faqs mt-40">
        <h3 class="mb-32 text-center text-size-title text-primary"><span>{{ store.currentCategory }}</span>{{
          $t('faq-search.searchCategory.resultTitle') }}</h3>
        <div class="section-content">
          <div class="featured-keywords">
            <div class="table-content table-faq">
              <table-list :table-data="store.faqSearchTable.data" @clicked="clickedFaq"></table-list>
            </div>

            <div class="table-footer">
              <Paging :current-page="store.faqSearchTable.currentPage" :total="store.faqSearchTable.totalItem"
                :page-size="store.faqSearchTable.pageSize" @change-page="onChangePageSearch">
              </Paging>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-box search-form mt-40">
        <a-form ref="formRef" :model="store.formState">
          <h3 class="mb-16 text-center text-size-title text-primary">{{ $t('faq-search.search.searchKeywordTitle') }}</h3>
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
              <div class="feature-keyword-item" v-for="(item, index) in store.relatedKeywords" key="index"
                @click="handlerClickedKeyword(item)">
                <span>
                  {{ item }}
                </span>
              </div>
            </a-col>
          </a-row>
        </a-form>
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
