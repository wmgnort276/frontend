<script setup lang="ts">
import { onMounted, reactive, ref, onBeforeMount } from 'vue';
import LeftOutlined from '@/components/icon/LeftOutlined.vue';
import RequiredTag from '@/components/common/RequiredTag.vue';
import axios from '../../../mock/faq';
import PageLayout from '@/pages/layouts/PageLayout.vue';
import type { Business, Category, SelectOptions } from '@/types/interfaces/faq';
import { useFaqCreateStore } from '@/stores/faqCreate.store';
import { useFaqExportStore } from '@/stores/faqExport.store';
import { FAQ_INCLUDE, HEADER_CSV, END_YEAR_FLAG_VALUE,DATE_FORMAT } from '@/stores/constants/constant';
import { message } from 'ant-design-vue';
import { useAuthStoreHook, useAuthStore } from '@/stores/auth.store';
import router from '@/router';
import dayjs from 'dayjs';
import { t } from '@/plugins/i18n';
import { useFaqSearchStore, } from '@/stores/faqSearch.store';

import {
  BREAD_CRUMB_TYPE
} from '@/stores/constants/constant';

import type {
  FaqBreadCrumb
} from '@/types/interfaces/faq';
import ConfirmDialog from '@/components/common/dialog/ConfirmDialog.vue';

const storeExport = useFaqExportStore();

const store = useFaqSearchStore();

const spinning = ref<boolean[]>([false, false, false, false, false]);
const isLoading = ref<boolean>(true);

const canView = ref<boolean>(true);
const canViewFaq = ref<boolean>(true);
const { authUser } = useAuthStoreHook();

const faqBreadCrumbs = ref<FaqBreadCrumb[]>([]);

const userStore = useAuthStore();


let confirmPopup = ref<boolean>(false);

const handleCategorySelect = async (level: number, category?: string) => {
  clearArray(storeExport.formState.categories, level - 1);
  if (level > 5) {
    return;
  } else {
    let param: any = {};
    if (level == 1) {
      param = {
        businessCode: storeExport.formState.businessDepartment,
        level: level
      };
    } else {
      param = {
        categoryCode: category,
        level: level
      };
    }
    spinning.value[level - 1] = true;
    storeExport.mapCategories[level - 1] = await storeExport.getListCategories(param);
    spinning.value[level - 1] = false;
  }
};

const clearArray = (arr: (string | null | undefined)[], index: number) => {
  for (let i = index; i < arr.length; i++) {
    arr[i] = null;
  }
};

const categoryDisable = (index: number): boolean => {
  if (index == 0) {
    return !storeExport.formState.businessDepartment;
  } else {
    return !storeExport.formState.categories[index - 1];
  }
};

const handleSelectBusiness = async (value: any, business: any) => {
  // conditionShow.value = true;
  // if (business?.isFaqCode) {
  //   isFaqCode.value = true;
  // } else {
  //   isFaqCode.value = false;
  // }
};

const onFinish = async () => {
  isLoading.value = true;
  let param: any = {};
  param['businessCode'] = storeExport.formState.businessDepartment;
  storeExport.formState.categories.forEach((category: any, index: any) => {
    if (category != null) {
      param['faqCategory' + (index + 1)] = category;
    }
  });

  if (storeExport.formState.faqNumber != null) {
    param['faqNumber'] = storeExport.formState.faqNumber;
  }
  const result = await storeExport.getData(param);
  if (result && result.code === 'ERR_NETWORK') {
    isLoading.value = false;
    return;
  }
  let csv = HEADER_CSV;
  storeExport.dataExport.forEach(
    (question: {
      faqCategoryName1: any;
      faqCategoryName2: any;
      faqCategoryName3: any;
      faqCategoryName5: any;
      faqCategoryName4: any;
      businessName: any;
      totalAnswer: string;
      faqNumber: string;
      ambiguouKeywords: any;
      relatedKeywords: any;
      businessCode: string;
      faqCategoryCode1: string;
      faqCategoryCode2: any;
      faqCategoryCode3: string;
      faqCategoryCode4: string;
      faqCategoryCode5: string;
      sortOrder: string;
      displayStartDate: string;
      displayEndDate: string;
      content: any;
      deleteQuestion: any;
      answers: any[];
    }) => {
      csv +=
        (question.faqNumber || '') +
        ',' +
        (question.answers[0]?.answerNumber || '') +
        ',' +
        `${question.businessCode}_${question.businessName || ''}` +
        ',' +
        (question.faqCategoryCode1 != ''
          ? `${question.faqCategoryCode1}_${question.faqCategoryName1}`
          : '') +
        ',' +
        (question.faqCategoryCode2 != ''
          ? `${question.faqCategoryCode2}_${question.faqCategoryName2}`
          : '') +
        ',' +
        (question.faqCategoryCode3 != ''
          ? `${question.faqCategoryCode3}_${question.faqCategoryName3}`
          : '') +
        ',' +
        (question.faqCategoryCode4 != ''
          ? `${question.faqCategoryCode4}_${question.faqCategoryName4}`
          : '') +
        ',' +
        (question.faqCategoryCode5 != ''
          ? `${question.faqCategoryCode5}_${question.faqCategoryName5}`
          : '') +
        ',' +
        (question.sortOrder || '') +
        ',' +
        dayjs(question.displayStartDate).format('YYYY/MM/DD') +
        ',' +
        dayjs(question.displayEndDate).format('YYYY/MM/DD') +
        ',' +
        `\"${question.content.replace('\n', '').replaceAll("\"", "\"\"")}\"` +
        ',' +
        (question.deleteQuestion || '') +
        ',';
      if (question.answers.length > 0) {
        question.answers.forEach((answer, index) => {
          let include = answer.companies.length > 0 ? (answer.companies[0].condition == FAQ_INCLUDE ? 0 : 1) : '';
          let comps: any[][] = [];
          let regex = /(<([^>]+)>)/gi;
          let lengthUrl = answer.urls.length;
          let lengthFile = answer.attachments.length;
          let company = answer.companies.map((comp: { companyCode: any[] }) => {
            if (comp.companyCode != undefined) {
              return comps.push(comp.companyCode);
            }
          });
          csv +=(answer.sortOrder || '') +
            ',' +
            dayjs(answer.startTime).format('YYYY/MM/DD') +
            ',' +
            dayjs(answer.endTime).format('YYYY/MM/DD') +
            ',' +
            include +
            ',' +
            `\"${comps.length > 0 ? comps.join(',') : ''}\"` +
            ',' +
            `\"${answer.content.replace(regex, '').replace('\n', '').replaceAll("\"", "\"\"")}\"` +
            ',' +
            (answer.deleteAnswer) +
            ',';

          for (let index = lengthUrl; index < 5; index++) {
            answer.urls.push({
              urlTitle: '',
              urlLink: ''
            });
          }

          for (let index = lengthFile; index < 8; index++) {
            answer.attachments.push({
              fileName: ''
            });
          }

          answer.urls.forEach((url: any) => {
            csv += `\"${(url.urlTitle.replaceAll("\"", "\"\"") || '')}\"` + ',' + `\"${(url.urlLink.replaceAll("\"", "\"\"") || '')}\"` + ',';
          });
          answer.attachments.forEach((attachment: any) => {
            csv += `\"${(attachment.fileName.replaceAll("\"", "\"\"") || '')}\"` + ',';
          });
          csv += `\"${question.relatedKeywords.replaceAll("\"", "\"\"")}\"` + ',' + `\"${question.ambiguouKeywords.replaceAll("\"", "\"\"")}\"`;
          csv += '\r\n';
          if (index != question.answers.length - 1) {
            csv +=
              (question.faqNumber || '') +
              ',' +
              (question.answers[index + 1]?.answerNumber || '') +
              ',' +
              '' +
              ',' +
              '' +
              ',' +
              '' +
              ',' +
              '' +
              ',' +
              '' +
              ',' +
              '' +
              ',' +
              '' +
              ',' +
              '' +
              ',' +
              '' +
              ',' +
              '' +
              ',' +
              '' +
              ',';
          }
        });
      } else {
        csv +=
          ',,,,,,,,,,,,,,,,,,,,,,,,,,' +
          `\"${question.relatedKeywords.replaceAll("\"", "\"\"") || ''}\"` +
          ',' +
          `\"${question.ambiguouKeywords.replaceAll("\"", "\"\"") || ''}\"`;
        csv += '\r\n';
      }
    }
  );

  const anchor = document.createElement('a');
  anchor.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csv);
  anchor.target = '_blank';
  anchor.download = 'FAQ一括出力ファイル.csv';
  anchor.click();

  message.success(`${storeExport.dataExport.length} ${t('faq.export.success')}`);
  isLoading.value = false;
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const clearData = () => {
  (storeExport.formState.businessDepartment = null),
    (storeExport.formState.categories = [undefined, undefined, undefined, undefined, undefined]);
  storeExport.formState.faqNumber = null;
  storeExport.businesses = [];
};

const checkEmpty = () => {
  return !storeExport.formState.businessDepartment && !storeExport.formState.faqNumber
}

onMounted(async () => {

  let isViewFaqNormal = userStore.isViewFaqNormal();
  let isViewFaqEndYear = userStore.isViewFaqEndYear();
  let isManager = userStore.isManagerUser();

  let canViewAndExport = isManager && (isViewFaqEndYear || isViewFaqNormal);

  if (!canViewAndExport) {
    message.error(t('faq-detail.user_not_permission'));
    await router.push('/top');
    return;
  }

  await storeExport.getBusinessData();
  await getBreadCrumbs();

  isLoading.value = false;
});

const getBreadCrumbs = async () => {
  faqBreadCrumbs.value = [];

  faqBreadCrumbs.value.push({
    type: BREAD_CRUMB_TYPE.TOP,
    code: "",
    name: t("common.breadcrumbs.top"),
    class: ''
  });

  let isViewFaqNormal = userStore.isViewFaqNormal();
  let isViewFaqEndYear = userStore.isViewFaqEndYear();

  if (store.formState.isFaqCode || (!isViewFaqNormal && isViewFaqEndYear)) {
    faqBreadCrumbs.value.push({
      type: BREAD_CRUMB_TYPE.TOP_FAQ_END_YEAR,
      code: "",
      name: t("common.breadcrumbs.top-faq-end-year"),
      class: ''
    });
  } else {
    faqBreadCrumbs.value.push({
      type: BREAD_CRUMB_TYPE.TOP_FAQ,
      code: "",
      name: t("common.breadcrumbs.top-faq"),
      class: ''
    });
  }

  faqBreadCrumbs.value.push({
    type: '',
    code: "",
    name: t("faq.export.faqBatchExport"),
    class: ''
  });

};

const currentBreadcrumb = ref<FaqBreadCrumb>();

const handlerClickBreadCrumb = async (item: FaqBreadCrumb, index: Number) => {
  if (index == (faqBreadCrumbs.value.length - 1)) {
    return;
  }
  currentBreadcrumb.value = item;

  if (!checkEmpty()) {
    confirmPopup.value = true;
  } else {
    handlerClickBreadCrumbAction();
  }
};

const handlerClickBreadCrumbAction = async () => {
  // Clear store of current page
  clearData();

  if (currentBreadcrumb.value?.type == BREAD_CRUMB_TYPE.TOP) {
    store.clearData();

    router.push("/top");
  } else if (currentBreadcrumb.value?.type === BREAD_CRUMB_TYPE.TOP_FAQ) {
    router.push({
      path: '/faq/search/', query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      }
    });
    return;
  } else if (currentBreadcrumb.value?.type == BREAD_CRUMB_TYPE.TOP_FAQ_END_YEAR) {
    router.push({
      path: '/faq/search/', query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      }
    });
  } else if (currentBreadcrumb.value?.type == BREAD_CRUMB_TYPE.BUSINESS) {
    router.push({
      path: '/faq/search-category/', query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
        businessCode: currentBreadcrumb.value?.code,
      }
    });

    isLoading.value = true;

    isLoading.value = false;
  } else if (currentBreadcrumb.value?.type == BREAD_CRUMB_TYPE.CATEGORY) {
    router.push({
      path: '/faq/search-category/', query: {
        companyGroupCode: store.formState.companyGroupCode,
        faqCode: store.formState.faqCode,
        isFaqCode: store.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: store.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
        faqCategory: currentBreadcrumb.value?.code,
      }
    });
  }
}
</script>

<template>
  <page-layout :is-loading="isLoading">
    <div class="main-page">
      <div class="navigation">
        <div class="navigation-breadcrumb">
          <div class="feature-keyword-item" v-for="(item, index) in faqBreadCrumbs" key="index">
            <span :class="{ 'current': faqBreadCrumbs.length - 1 == index, 'first': index == 0 }"
              @click="handlerClickBreadCrumb(item, index)">
              {{ item.name }}
            </span>
            <span class="item-space">
              <ArrowRightSmall v-if="faqBreadCrumbs.length - 1 != index"></ArrowRightSmall>
            </span>
          </div>
        </div>
      </div>
      <div class="panel-box padding-small">
        <a-form :model="storeExport.formState" name="basic" label-align="left" :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">

          <div class="card-export category-section">
            <a-row>
              <a-col :span="24">
                <h3 class="mb-16 text-size-title text-primary p-l-10 "> {{ $t('faq.export.faqBatchExport') }}</h3>
              </a-col>
            </a-row>
            <a-row class="mt-20">
              <a-col :span="5" class="col-business">
                <div class="">
                  <label class="title-business">
                    {{ $t('faq.export.businessCode') }}
                  </label>
                  <div class="required-tag">
                    <RequiredTag />
                  </div>
                </div>
              </a-col>

              <a-col :span="12">
                <a-row>
                  <a-form-item name="businessDepartment" :rules="[
                    {
                      required: true,
                      message:
                        $t('faq-create.category.businessDepartment') + $t('faq-create.required'),
                      trigger: ['blur', 'change']
                    }
                  ]">
                    <template v-if="false" #extra> <span style="color: #ff4d4f"></span> </template>
                    <a-select class="input-option width-80"
                      :placeholder="$t('faq-create.category.businessDepartmentPlaceholder')" size="large"
                      :showSearch="true" optionFilterProp="displayName" @select="() => {
                        handleCategorySelect(1);
                      }
                        " @change="(value: any, business: any) => { handleSelectBusiness(value, business) }"
                      v-model:value="storeExport.formState.businessDepartment" :options="storeExport.businesses"
                      :fieldNames="{
                        value: 'businessCode',
                        label: 'displayName'
                      }">
                    </a-select>
                  </a-form-item>
                </a-row>
              </a-col>
            </a-row>

            <a-row class="mt-20">
              <a-col :span="5" class="m-l-20 p-t-15">
                <div class="d-flex">
                  <label class="fs-20">
                    {{ $t('faq.export.category') }}
                  </label>
                </div>
              </a-col>
              <a-col :span="12">
                <a-row>
                  <a-form-item class="category" v-for="(cate, i) in storeExport.formState.categories"
                    :name="['categories', i]">
                    <a-spin :spinning="spinning[i]">
                      <a-select class="input-option" :placeholder="$t('faq.category') + (i + 1)" size="large"
                        :disabled="categoryDisable(i)" v-model:value="storeExport.formState.categories[i]"
                        :options="storeExport.mapCategories[i]"
                        @select="(value: any) => handleCategorySelect(i + 2, value)"
                        :fieldNames="{ value: 'categoryCode', label: 'displayName' }" :showSearch="true"
                        optionFilterProp="displayName">
                      </a-select>
                    </a-spin>
                  </a-form-item>
                </a-row>
              </a-col>
            </a-row>

            <a-row class="mt-20">
              <a-col :span="5" class="m-l-20 p-t-15">
                <label class="fs-20">
                  {{ $t('faq.export.faqNumber') }}
                </label>
              </a-col>
              <a-col :span="12">
                <a-row>
                  <a-form-item name="faqNumber">
                    <a-input :rows="1" size="large" style="width: 80%" :placeholder="$t('faq.export.faqNumber')"
                      v-model:value="storeExport.formState.faqNumber"></a-input>
                  </a-form-item>
                </a-row>
              </a-col>
            </a-row>
          </div>

          <a-button type="primary" class="btn-export" html-type="submit">
            {{ $t('faq.export.faqFileExport') }}
          </a-button>
        </a-form>
      </div>
    </div>
  </page-layout>
  <confirm-dialog v-model:visible="confirmPopup" :show-cancel="true" :message="$t('faq-create.back.message')"
    :ok-title="$t('common.popup.confirm')" :cancelTitle="$t('common.popup.cancel')" :type="'right'" @ok="() => {
      handlerClickBreadCrumbAction();
    }
      ">
  </confirm-dialog>
</template>

<style scoped>
@import './../../assets/styles/common.css';
@import './../../assets/styles/page.css';
@import './../../assets/styles/button.css';

.fs-20 {
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;
}

.center {
  align-items: center;
  margin: 0 auto;
  margin-top: 35px !important;
  max-width: 1120px;
  padding: 30px 25px 50px 25px;
  border-radius: 8px;
  gap: 20px;
  background-color: #fff;
}

.required {
  background-color: #d21919;
  height: 23px;
  border-radius: 36px;
  color: #fff;
  width: 60px;
  font-size: 14px;
  text-align: center;
}

.back {
  display: flex;
  align-items: center;
  margin: 0 auto;
  max-width: 1120px;
  border-radius: 8px;
  color: #37474f !important;
}

.btn-back {
  color: #37474f;
  font-size: 24px;
  display: flex;
}

.title {
  color: #37474f;
  font-size: 24px;
  font-weight: 700;
  padding-left: 10px;
  height: 30px;
  margin-bottom: 25px;
}

.w-250 {
  width: 250px;
  margin: 5px;
}

.m-l-26 {
  margin-left: 26px;
}

.m-b-0 {
  margin-bottom: 0;
}

.title-business {
  font-size: 20px;
  margin-right: 50px;
  color: rgba(55, 71, 79, 0.87);
}

.col-business {
  margin-left: 20px;
  padding-top: 12px;
}

.btn-export {
  background-color: #1976d2;
  width: 210px;
  height: 44px;
  border-radius: 4px;
  margin-left: 20px;
  font-size: 20px;
  margin-top: 30px;
}

::v-deep(.ant-form-item-label) {
  text-align: left;
  font-weight: 400;
  margin-left: 20px;
  padding: 4px;
}

::v-deep(.ant-select-selector) {
  height: 40px !important;
  padding: 6px 12px !important;
  border-radius: 4px !important;
  font-size: 16px !important;
}

::v-deep(.ant-select-selection-placeholder) {
  font-size: 18px !important;
  color: rgba(55, 71, 79, 0.5);
  line-height: 26px !important;
}

::v-deep(.ant-form-item-explain-error) {
  padding-left: 5px !important;
}

.category ::v-deep(.ant-spin-nested-loading) {
  width: 80% !important;
}

.input-option ::v-deep(.ck-content p) {
  margin-bottom: 0 !important;
}

.card-export ::v-deep(.ant-form-item) {
  width: 100%;
  margin: 0;
}

:deep(.ant-select-selector:after) {
  display: inline-block;
  width: 0;
  margin: 2px 0;
  line-height: 24px;
  content: '' !important;
}

.required-tag {
  margin-right: 10px;
  float: right;
}

.input-option {
  margin: 5px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

@media screen and (max-width: 1440px) {
  .back-to-top {
    left: 10px !important;
  }
}

:deep(.ant-select-selection-item) {
  align-self: center;
}
</style>
