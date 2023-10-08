<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import PageLayout from '@/pages/layouts/PageLayout.vue';
import { getFaqDetail, sendVoteResult, downloadFile, updateViewCountAPI } from '@/api/faqDetail.api';
import type { FaqDetail, Attachment } from '@/types/interfaces/faq';
import { useAuthStore } from '@/stores/auth.store';
import { BREAD_CRUMB_TYPE, USER_TYPE, END_YEAR_FLAG_VALUE, DATE_FORMAT } from '@/stores/constants/constant';
import { message } from 'ant-design-vue';
import { convertSize } from '@/utils';
import { useRoute } from 'vue-router';
import { useFaqSearchStore } from '@/stores/faqSearch.store';
import { useAuthStoreHook } from '@/stores/auth.store';
import Questions from '@/components/icon/Questions.vue';
import Answer from '@/components/icon/Answer.vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import ArrowRight from '@/components/icon/ArrowRight.vue';
import type { FormInstance } from 'ant-design-vue/es/form';
import { t } from '@/plugins/i18n';
import type { FaqBreadCrumb } from '@/types/interfaces/faq';
import ArrowRightSmall from '@/components/icon/ArrowRightSmall.vue';
import dayjs, { Dayjs } from 'dayjs';
import setATagTargetBlank from '@/utils/setLinkTargetBlank';

const store = useFaqSearchStore();
const route = useRoute();
const isLoading = ref<boolean>(true);
const breadcrumbList = ref<any[]>([]);
const router = useRouter();
const detail = ref<FaqDetail>();
const query = {
  faqNumber: route.query.faqNumber ? route.query.faqNumber : '',
  selectedDate: route.query.selectedDate ? dayjs(route.query.selectedDate).format('YYYY-MM-DD') : '',
  companyGroupCode: route.query.companyGroupCode ? route.query.companyGroupCode : '',
  faqCode: route.query.faqCode ? route.query.faqCode : '',
  isFaqCode: route.query.isFaqCode ? route.query.isFaqCode : ''
};

const canEdit = ref<boolean>(false);
const canView = ref<boolean>(true);
const canViewFaq = ref<boolean>(true);

const authStore = useAuthStore();

const { authUser } = useAuthStoreHook();

const formRef = ref<FormInstance>();

const isDisableVote = ref<boolean>(false);
const relatedKeywords = ref<string[]>([]);

const isNonEmptySearchText = computed(() => {
  return !store.checkEmptySearchText();
});

const isShowUrl = computed(() => {
  return detail.value?.answer?.urls && detail.value?.answer?.urls.length > 0;
});

const isShowAttachment = computed(() => {
  return detail.value?.answer?.attachments && detail.value?.answer?.attachments.length > 0;
});

const isManager = computed(() => {
  return (
    authStore.authUser?.UserType === USER_TYPE.MANAGER ||
    authStore.authUser?.UserType == USER_TYPE.SYSTEM_ADMIN
  );
});

const isFaqUser = computed(() => {
  return authStore.authUser?.UserType === USER_TYPE.FAQ;
});

const isEmployee = computed(() => {
  return authStore.authUser?.UserType === USER_TYPE.EMPLOYEE;
});

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const getDetail = async () => {
  let params = query;
  try {
    const res: any = await getFaqDetail(params);

    detail.value = res.data;

    if (detail.value?.relatedKeywords) {
      relatedKeywords.value = detail.value?.relatedKeywords.split(',').map((item) => {
        return item.trim();
      });
    }


    let isViewFaqNormal = authStore.isViewFaqNormal();
    let isViewFaqEndYear = authStore.isViewFaqEndYear();

    if (detail.value?.isEndYear) {
      if (authStore.authUser?.UserType == USER_TYPE.EMPLOYEE || !isViewFaqEndYear) {
        message.error(t('faq-detail.user_not_permission'));
        store.clearData();
        await router.push('/top');
        return;
      }
    } else {
      if (authStore.authUser?.UserType == USER_TYPE.FAQ || !isViewFaqNormal) {
        message.error(t('faq-detail.user_not_permission'));
        store.clearData();
        await router.push('/top');
        return;
      }
    }

    if (!store.formState.isFaqCode) {
      breadcrumbList.value.push({
        name: detail.value?.businessName,
        code: res.data.businessCode,
        type: BREAD_CRUMB_TYPE.BUSINESS
      });
    }

    for (let i = 1; i < 6; i++) {
      if (res.data['faqCategoryName' + i]) {
        breadcrumbList.value.push({
          name: res.data['faqCategoryName' + i],
          code: res.data['faqCategoryCode' + i],
          type: BREAD_CRUMB_TYPE.CATEGORY
        });
      } else {
        break;
      }
    }

    breadcrumbList.value.some((item, index) => {
      if (index === breadcrumbList.value.length - 1) {
        item.class = 'last-category';
      }
    });

    breadcrumbList.value.push({
      name: res.data.faqNumber,
      code: res.data.faqNumber,
      type: BREAD_CRUMB_TYPE.FAQ_CODE,
      class: 'faq-number'
    });

  } catch (error: any) {
    isLoading.value = false;

    await message.error(error.response.data.message);
    store.clearData();
    if (authStore.isUserFaq()) {
      await router.push('/faq/search?isFaqCode=1');
    } else {
      await router.push('/top');
    }

  }
};

const handleDownload = async (item: Attachment) => {
  const fileDownloaded: any = await downloadFile({ fileId: item.fileId });
  var blob = new Blob([fileDownloaded], {
    type: 'application/x-www-form-urlencoded; charset=UTF-8'
  });
  const downloadLink = window.document.createElement('a');
  downloadLink.href = window.URL.createObjectURL(blob);
  downloadLink.download = item.fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

const handlerClickBreadCrumb = async (item: FaqBreadCrumb, index: Number) => {
  if (index == store.faqBreadCrumbsDetail.length - 1) {
    return;
  }

  if (item.type == BREAD_CRUMB_TYPE.TOP) {
    store.clearData();
    await router.push('/top');
  } else if (item.type == BREAD_CRUMB_TYPE.TOP_FAQ) {
    store.clearData();

    await router.push({
      path: '/faq/search/',
      query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE)
      }
    });
  } else if (item.type == BREAD_CRUMB_TYPE.TOP_FAQ_END_YEAR) {
    store.clearData();

    await router.push({
      path: '/faq/search/',
      query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE)
      }
    });
  } else if (item.type == BREAD_CRUMB_TYPE.BUSINESS) {
    store.clearData();
    await router.push({
      path: '/faq/search-category/',
      query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
        businessCode: item.code
      }
    });

    store.formState.selectBusiness = item.code;
    store.formState.selectCategory = '';
    isLoading.value = true;
    store.clearSearchData();

    await Promise.all([store.getAvaiableCategoryData()]);

    scrollToTop();
    isLoading.value = false;
  } else if (item.type == BREAD_CRUMB_TYPE.CATEGORY) {
    await router.push({
      path: '/faq/search-category/',
      query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
        faqCategory: item.code
      }
    });
  }
};

onMounted(async () => {

  scrollToTop();
  isLoading.value = true;

  const { isFaqCode, businessCode, faqCategory, companyGroupCode, faqCode, selectedDate } = route.query;

  store.formState.searchText = '';

  if (isFaqCode && isFaqCode == END_YEAR_FLAG_VALUE.END_YEAR) {
    store.formState.isFaqCode = true;
  }

  if (authStore.authUser?.UserType == USER_TYPE.FAQ && isFaqCode != END_YEAR_FLAG_VALUE.END_YEAR) {
    store.formState.isFaqCode = true;
    store.clearData()
    router.push({
      path: '/faq/search/', query: {
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
      }
    });
    return;
  } else if (authStore.authUser?.UserType == USER_TYPE.EMPLOYEE && isFaqCode && isFaqCode == END_YEAR_FLAG_VALUE.END_YEAR) {
    store.formState.isFaqCode = false;

    store.clearData();

    router.push({
      path: '/faq/search/', query: {
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
      }
    });
    return;
  }

  if (authStore.authUser?.UserType == USER_TYPE.EMPLOYEE && !store.formState.isFaqCode && !authStore.isCompanyViewNormalFaq()) {
    message.error(t('faq-detail.user_not_permission'));
    store.clearData();
    await router.push('/top');
    return;
  }

  let isViewFaqNormal = authStore.isViewFaqNormal();
  let isViewFaqEndYear = authStore.isViewFaqEndYear();

  if (isFaqCode && isFaqCode == END_YEAR_FLAG_VALUE.END_YEAR && !isViewFaqEndYear && authStore.authUser?.UserType != USER_TYPE.FAQ) {
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

  let isEditFaqNormal = authStore.isEditFaqNormal();
  let isEditFaqEndYear = authStore.isEditFaqEndYear();
  let isManager = authStore.isManagerUser();

  canEdit.value = isManager && (isEditFaqNormal || isEditFaqEndYear);

  if (companyGroupCode) {
    store.formState.companyGroupCode = companyGroupCode as string;
  }

  if (faqCode) {
    store.formState.faqCode = faqCode as string;
  }

  if (businessCode) {
    store.formState.selectBusiness = businessCode as string;
  }

  if (faqCategory) {
    store.formState.selectCategory = faqCategory as string;
  }

  if (selectedDate) {
    store.formState.selectedDate = dayjs(
      selectedDate.toString(),
      'YYYY/MM/DD'
    );
  }

  if (isManager) {
    await Promise.all([
      store.getCompaniesData(),
      store.getFaqCodes()
    ]);
  }

  if (store.formState.isFaqCode) {
    await Promise.all([
      getDetail(),
      store.doGetKeywords(),
      store.getEndYearAvaiableData(),
    ]);
    updateViewCount();
  } else {
    await Promise.all([
      getDetail(),
      store.doGetKeywords(),
      store.getAvaiableBusinessData()
    ]);
    updateViewCount();
  }

  // set all a tag inside ck-editor content with attribute target="_blank"
  setATagTargetBlank('ck-content');

  store.getFaqBreadCrumbsDetail(breadcrumbList.value);

  isLoading.value = false;
  isDisableVote.value = false;
});

const handleClickAmbigousKeywords = (item: any) => {
  router.push({
    path: '/faq/search-result',
    query: {
      searchText: item,
      companyGroupCode: store.formState.companyGroupCode,
      faqCode: store.formState.faqCode,
      isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER
    }
  });
};

const handlerClickedCategory = async (value: any) => {
  await router.push({
    path: '/faq/search-category/',
    query: {
      companyGroupCode: store.formState.companyGroupCode,
      faqCode: store.formState.faqCode,
      isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
      searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      faqCategory: value
    }
  });

  store.formState.selectBusiness = '';
  store.formState.selectCategory = value;

  isLoading.value = true;

  await Promise.all([store.getAvaiableCategoryData(), store.doSearchFaq()]);

  isLoading.value = false;
};

const handlerClickedBusiness = async (value: any) => {
  await router.push({
    path: '/faq/search-category/',
    query: {
      companyGroupCode: store.formState.companyGroupCode,
      faqCode: store.formState.faqCode,
      isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
      searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      businessCode: value
    }
  });
};

const searchAction = () => {
  formRef.value?.validateFields([['companyGroupCode']]);
  formRef.value?.validateFields([['faqCode']]);

  store.formState.searchText = store.formState.searchText;

  router.push({
    path: '/faq/search-result/',
    query: {
      companyGroupCode: store.formState.companyGroupCode,
      faqCode: store.formState.faqCode,
      isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
      searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      searchText: store.formState.searchText
    }
  });
};

const handlerClickedKeyword = (value: any) => {
  store.formState.searchText = value.trim();

  router.push({
    path: '/faq/search-result/',
    query: {
      companyGroupCode: store.formState.companyGroupCode,
      faqCode: store.formState.faqCode,
      isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
      searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      searchText: store.formState.searchText
    }
  });
};

const redirectToSearch = () => {
  router.push('/faq/search');
};

const onHandleVote = (value: number) => {
  if (isManager.value) {
    isDisableVote.value = true;
    // message.success('Thank you to your vote!');
  } else {
    isLoading.value = true;
    let param = {
      faqNumber: detail.value?.faqNumber,
      answerNumber: detail.value?.answer?.answerNumber,
      type: value
    };
    sendVoteResult(param)
      .then((res: any) => {
        isLoading.value = false;
        if (res.data.error === null) {
          message.success(t('faq-detail.voteSucess'));
        }
        isDisableVote.value = true;
      })
      .catch((err) => {
        isLoading.value = false;
        if(err.code != 'ERR_NETWORK') {
          message.error(t('faq-detail.voteFail'));
        }
      });
  }
};

const updateViewCount = async () => {
  if (![USER_TYPE.MANAGER, USER_TYPE.SYSTEM_ADMIN].includes(authStore.authUser?.UserType)) {
    await updateViewCountAPI({
      faqNumber: detail.value?.faqNumber,
      answerNumber: detail.value?.answer?.answerNumber,
      loginUserId: authStore.authUser?.LoginUserId,
      companyCode: authStore.authUser?.CompanyCode,
    });
  }
};

const redirectToEdit = () => {
  router.push(`/faq/update/${query.faqNumber}`);
};

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

const validatorSearchValue = (value: any) => {
  return new Promise((resolve, reject) => {
    if (store.formState.companyGroupCode === '' && store.formState.faqCode === '') {
      reject('');
    } else {
      resolve('');
    }
  });
};

const getLink = (link: any) => {
  let url;
  try {
    url = new URL(link).href;
  } catch (_) {
    url = 'http://' + link
  }
  return url;
}


</script>
<template>
  <page-layout :is-loading="isLoading">
    <div class="main-page">
      <div class="navigation">
        <div class="navigation-breadcrumb">
          <div class="feature-keyword-item" v-for="(item, index) in store.faqBreadCrumbsDetail" key="index">
            <span :class="{ current: store.faqBreadCrumbsDetail.length - 1 == index, 'first': index == 0 }"
              @click="handlerClickBreadCrumb(item, index)">
              {{ item.name }}
            </span>
            <span :class="[item.class, 'item-space']">
              <ArrowRightSmall v-if="store.faqBreadCrumbsDetail.length - 1 != index"></ArrowRightSmall>
            </span>
          </div>
        </div>
        <div class="navigation-btn-group">
          <a-button v-if="isManager && canEdit" type="primary" @click="redirectToEdit" class="btn-rounned">{{
            $t('faq.edit') }}</a-button>
        </div>
      </div>

      <div class="content-wrapper">
        <!-- FAQ content -->
        <div class="card card-detail line-break">

          <div class="q-content">
            <a-row class="q-number">
              <a-col :span="12">
                <div class="fs-16-600">
                  {{ detail?.faqNumber }}
                </div>
              </a-col>
              <a-col :span="12" class="text-right text-size-normal">
                <div v-if="isManager" class="mr-15 company-condition">
                  {{ detail?.companyName }}
                </div>
              </a-col>
            </a-row>
            <div>
            </div>
            <div class="flex mt-20 qa-name m-b-10">
              <div class="title-tag">
                <Questions-40 class="icon-questions"></Questions-40>
              </div>

              <div class="question-content break fs-24-black">
                <span>{{ detail?.content }}</span>
              </div>
            </div>

            <a-divider class="m-t-0" />
          </div>

          <div class="answer">
            <div class="title-tag">
              <Answer class="icon-answer"></Answer>
            </div>
            <div class="answer-content fs-20 ck-content">
              <p v-html="detail?.answer?.content"></p>
            </div>
          </div>

          <div v-if="isShowUrl || isShowAttachment" class="related-file">
            <div>
              <div class="flex-col" v-if="isShowAttachment">
                <a-row class="mb-20 align-center" v-for="(item, index) in detail?.answer!.attachments" :key="index">
                  <a @click="handleDownload(item)" class="fs-20-link font line-break">{{ $t('faq-detail.fileAttachment')
                  }} {{ item.fileName }} ({{ convertSize(item.fileSize) }})</a>
                </a-row>
              </div>
              <div class="flex-col" v-if="isShowUrl">
                <div class="mb-20" v-for="(item, index) in detail?.answer?.urls" :key="index">
                  <a :href="getLink(item.urlLink)" target="_blank" class="fs-20-link font line-break">{{item.urlTitle }}</a>
                </div>
              </div>
            </div>
          </div>

          <a-divider class="answer-divider" />

          <div class="rating">
            <div class="rating-title fs-24-black">
              {{ $t('common.ratingTitle') }}
            </div>
            <div class="rating-button-group">
              <a-button :class="{ 'btn-disable': isDisableVote || isManager }" :disabled="isDisableVote || isManager"
                @click="onHandleVote(1)" type="primary" class="btn-rating rating-bt">
                {{ $t('faq.upvote') }}
              </a-button>
              <a-button :class="{ 'btn-disable': isDisableVote || isManager }" :disabled="isDisableVote || isManager"
                @click="onHandleVote(0)" type="primary" class="btn-rating">
                {{ $t('faq.downvote') }}
              </a-button>
            </div>
          </div>
        </div>

        <div class="card panel-box faq-keywords mt-30" v-if="relatedKeywords.length > 0">
          <h3 class="mb-26 text-center text-size-title text-primary">
            {{ $t('faq-create.keywordManagement.relatedKeyword') }}
          </h3>
          <a-row class="mt-16 feature-keywords mb-10">
            <a-col :sm="24" :xs="24" :md="24" class="feature-keyword-items">
              <div class="feature-keyword-item" v-for="(item, index) in relatedKeywords" key="index"
                @click="handlerClickedKeyword(item)">
                <span>
                  {{ item }}
                </span>
              </div>
            </a-col>
          </a-row>
        </div>

        <div class="card panel-box search-form mt-30">
          <a-form ref="formRef" :model="store.formState">
            <h3 class="mb-16 text-center text-size-title text-primary" v-if="isManager">{{
              $t('faq-search.search.searchTitle') }}</h3>
            <a-row v-if="isManager">
              <a-col :lg="6" :md="24" :sm="24" :xs="24" class="m-t-10">
                <div class="title d-flex ">
                  <span class="text-size-normal">
                    {{ $t('faq.form.label.affiliatedCompany') }}
                  </span>
                  <div class="bagde bagde-error m-l-15">
                    {{ $t('faq.form.label.required') }}
                  </div>
                </div>
              </a-col>
              <a-col :lg="18" :md="24" :sm="24" :xs="24">
                <a-row>
                  <a-col :md="8" :sm="24" :xs="24" class="m-t-10">
                    <div class="title d-flex">
                      <span class="text-size-normal">
                        {{ $t('faq.form.label.companyGroup') }}
                      </span>
                    </div>
                  </a-col>
                  <a-col :md="16" :sm="24" :xs="24">
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
                  <a-col :md="8" :sm="24" :xs="24" class="m-t-10">
                    <div class="title d-flex">
                      <span class="text-size-normal">
                        {{ $t('faq.form.label.faqCode') }}
                      </span>
                    </div>
                  </a-col>
                  <a-col :md="16" :sm="24" :xs="24">
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
                  <span class="text-size-normal">{{ $t('faq-search.search.faqSearchDate') }} </span>
                </div>
              </a-col>
              <a-col :lg="18" :md="24" :sm="24" :xs="24">
                <a-row>
                  <a-col :lg="8" :md="8" :sm="24" :xs="24"> </a-col>
                  <a-col :lg="8" :md="16" :sm="24" :xs="24">
                    <date-picker size="large" class="input-full-width faq-date-input" :format="defaultFormats"
                      v-model:value="store.formState.selectedDate"
                      :chosen-date="store.formState.selectedDate || undefined"
                      :place-holder="$t('faq.form.label.displayDatePlaceholder')" @change-date="handlerChangeDate" />
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <hr class="section-break" v-if="isManager" />
            <h3 class="mb-16 text-center text-size-title text-primary">
              {{ $t('faq-search.search.searchKeywordTitle') }}
            </h3>
            <a-row>
              <a-col :sm="24" :xs="24">
                <a-input-search class="input-search" v-model:value="store.formState.searchText" size="large"
                  @search="searchAction" :placeholder="$t('faq.form.label.inputSearchPlaceholder')">
                  <template #enterButton>
                    <a-button class="btn-search" :disabled="!isNonEmptySearchText">
                      <SearchOutlined />
                      <span class="btn-search-text">{{
                        $t('faq-search.search.searchButtonText')
                      }}</span>
                    </a-button>
                  </template>
                </a-input-search>
              </a-col>
            </a-row>
            <a-row class="mt-16">
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
                <div class="feature-keyword-item" v-for="(item, index) in store.relatedKeywords" :key="index"
                  @click="handlerClickedKeyword(item)">
                  <span>
                    {{ item }}
                  </span>
                </div>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="card panel-box faq-categories mt-30">
          <h3 class="mb-26 text-center text-size-title text-primary">
            {{ $t('faq-search.search.faqCategory') }}
          </h3>
          <div class="faq-category-items mt-30" v-if="!store.formState.isFaqCode">
            <div class="faq-category-item" v-for="(item, index) in store.businesses" :key="index"
              @click="handlerClickedBusiness(item.businessCode)">
              <span class="faq-category-item-title">{{ item.businessName }}</span>
              <span class="faq-category-item-icon">
                <ArrowRight></ArrowRight>
              </span>
            </div>
          </div>
          <div class="faq-category-items mt-30" v-else>
            <div class="faq-category-item" v-for="(item, index) in store.faqCategories" :key="index"
              @click="handlerClickedCategory(item.categoryCode)">
              <span class="faq-category-item-title">{{ item.categoryName }}</span>
              <span class="faq-category-item-icon">
                <ArrowRight></ArrowRight>
              </span>
            </div>
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

textarea {
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  resize: none;
}

.content-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.last-category {
  display: none !important;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 1120px;
  align-items: center;
}

.card {
  width: 100%;
  padding: 40px 140px;
  background-color: #fff;
  border-radius: 8px;
}

.ant-breadcrumb {
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.25px;
  color: rgba(21, 101, 192, 1);
}

.qa-number {
  font-size: 20px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: 0.25px;
  text-align: left;
  color: #1565c0de;
}

.qa-name {
  align-items: center;
  gap: 14px;
}

.answer {
  display: flex;
  gap: 17px;
  margin-top: 20px;
}

.related-file {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 60px 0px 40px 60px;
}

.answer-content {
  /* min-height: 300px; */
  line-height: 34px;
  overflow-x: auto;
}

.answer-content>span {
  /* max-width: 75%; */
  display: block;
}

.answer>span>a {
  color: rgba(21, 101, 192, 1) !important;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 40px;
  letter-spacing: 0.5px;
  text-decoration-line: underline;
}

.answer-content>textarea {
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 40px;
  letter-spacing: 0.5px;
  color: rgba(55, 71, 79, 0.87);
}

.title-tag {
  display: flex;
  align-self: flex-start;
}

.reference-url-name {
  font-style: normal;
  font-weight: 400;
  font-size: 19px;
  line-height: 24px;
  letter-spacing: 0.5px;
  color: rgba(55, 71, 79, 0.87);
}

.rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 34px;
  /* margin-top: 30px; */
}

.rating-button-group {
  display: flex;
  gap: 80px;
}

.rating-button-group ::v-deep(.ant-btn) {
  width: 200px;
  height: 50px;
}

.l-100 {
  left: 100px;
}

a.underline {
  text-decoration: underline;
}

.break {
  line-break: anywhere;
}

.question-content>span {
  max-width: 100%;
}

.icon-questions {
  width: 40px;
  height: 40px;
}

.list-categories {
  display: contents;
  gap: 20px;
}

.category {
  width: 221px;
  height: 60px;
  border-radius: 4px;
  border: 1px solid #999999;
  display: flex;
  padding: 20px 12px;
  cursor: pointer;
  float: left;
  margin-right: 15px;
  margin-bottom: 20px;
}

.category-content {
  width: 100%;
}

.answer .ck-content {
  border: none !important;
  font-size: 16px;
}

@media screen and (max-width: 767px) {
  .card {
    padding: 15px;
  }

  .answer {
    gap: 8px;
    margin-top: 15px;
  }

  .answer-content {
    line-height: 25.6px !important;
  }

  .icon-questions {
    width: 20px;
    height: 20px;
    margin-top: 5px;
  }

  .icon-answer {
    width: 20px;
    height: 20px;
    margin-top: 5px;
  }

  .related-file {
    margin: 30px;
  }

  .rating-title {
    font-weight: 700;
    font-size: 20px;
    line-height: 40px;
    text-align: center;
  }

  .rating-button-group {
    display: block;
  }

  .rating-bt {
    margin-bottom: 25px;
  }

  .category {
    padding: 12px 12px;
    width: 100%;
    height: 48px;
  }

  .fs-24-black {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.5px;
    line-height: 40px;
  }

  .q-number {
    display: none;
  }

  .fs-20-link {
    font-size: 16px;
  }

}
</style>
