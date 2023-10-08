<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LeftOutlined from '@/components/icon/LeftOutlined.vue';
import type { FormRequest } from '@/types/interfaces/faq';
import PageLayout from '@/pages/layouts/PageLayout.vue';
import { useFaqCreateStore } from '@/stores/faqCreate.store';
import Next from '@/components/icon/Next.vue';
import Previous from '@/components/icon/Previous.vue';
import Questions from '@/components/icon/Questions.vue';
import Answer from '@/components/icon/Answer.vue';
import { useAuthStoreHook, useAuthStore } from '@/stores/auth.store';
import { message } from 'ant-design-vue';
import { nextTick } from 'vue';
import setATagTargetBlank from '@/utils/setLinkTargetBlank';
import { FAQ_EXCLUDE, BREAD_CRUMB_TYPE } from '@/stores/constants/constant';
import { SearchOutlined } from '@ant-design/icons-vue';
import { t } from '@/plugins/i18n';
import { useFaqSearchStore } from '@/stores/faqSearch.store';

import type {
  FaqBreadCrumb,
  Category,
} from '@/types/interfaces/faq';
import { convertSize } from '@/utils';

const searchStore = useFaqSearchStore();
const faqBreadCrumbs = ref<FaqBreadCrumb[]>([]);

const isloading = ref<boolean>(true);
const breadcrumbList = ref<string[]>();
const router = useRouter();
const canView = ref<boolean>(true);
const canViewFaq = ref<boolean>(true);
const { authUser } = useAuthStoreHook();
let faqData = ref<FormRequest>();

const faqCategories = ref<Category[]>([]);
const storeSearch = useFaqSearchStore();

const relatedKeywords = ref<string[]>([]);
const faqRelatedKeywords = ref<string[]>([]);

const getData = () => {
  // Sort data follow its order
  breadcrumbList.value = store.formState.listBreadcrumb;

  if (store.formState.relatedKeywords) {
    faqRelatedKeywords.value = store.formState.relatedKeywords.split(',').map((item) => {
      return item.trim();
    });
  }

  faqCategories.value = [];
  relatedKeywords.value = store.formState.keywords;

  store.formState.firstLevelCategories.forEach(element => {
    faqCategories.value.push({
      categoryCode: '',
      categoryName: element?.toString(),
    });
  });
  // if (!faqData.value?.businessDepartment) {
  //   router.push('/top');
  //   return;
  // }

  faqData.value = { ...store.formState, answer: [...store.formState.answer] };
  faqData.value = {
    ...faqData.value,
    answer: faqData.value.answer.sort((a: any, b: any) => a.answerOrder - b.answerOrder)
  }
};

const store = useFaqCreateStore();
const i = ref(0);
const userStore = useAuthStore();

onMounted(async () => {

  let isEditFaqNormal = userStore.isEditFaqNormal();
  let isEditFaqEndYear = userStore.isEditFaqEndYear();
  let isManager = userStore.isManagerUser();
  searchStore.formState.searchText = '';
  let canEdit = isManager && (isEditFaqNormal || isEditFaqEndYear);

  if (!canEdit) {
    message.error(t('faq-detail.user_not_permission'));
    await router.push('/top');
    return;
  }

  if (!store.formState.businessDepartment) {
    await router.push('/top');
    return;
  }

  getData();

  // await all DOM element to be rendered, this is needed for the bellow function to work correctly
  await nextTick();

  // set all a tag inside ck-editor content with attribute target="_blank"
  setATagTargetBlank('ck-content');
  getBreadCrumbs();
  isloading.value = false;
  if (store.checkNullForm()) {
    router.push('/faq/create');
  }

});

const hanldeClickBreadScrumbItem = () => {
  // Handle click breadscrums
};

const handleNext = () => {
  if (faqData.value!.answer) {
    if (i.value < faqData.value!.answer.length - 1) {
      ++i.value;
    }
  }

};

const handlePrevious = () => {
  if (i.value > 0) {
    i.value--;
  }
};

const routeBack = () => {
  router.go(-1);
};

const getBreadCrumbs = async () => {
  faqBreadCrumbs.value = [];

  faqBreadCrumbs.value.push({
    type: BREAD_CRUMB_TYPE.TOP,
    code: "",
    name: t("common.breadcrumbs.top"),
    class: ''
  });

  let isEditFaqNormal = userStore.isEditFaqNormal();
  let isEditFaqEndYear = userStore.isEditFaqEndYear();

  if (store.formState.isFaqCode || (!isEditFaqNormal && isEditFaqEndYear)) {
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

  store.formState.listBreadcrumb.forEach(element => {
    faqBreadCrumbs.value.push({
      name: element,
      code: '',
      type: BREAD_CRUMB_TYPE.BUSINESS,
      class: ''
    });
  });

};

const isNonEmptySearchText = computed(() => {
  return !storeSearch.checkEmptySearchText();
});
</script>
<template>
  <page-layout :is-loading="isloading">
    <div class="main-page">
      <div class="navigation">
        <div class="navigation-breadcrumb">
          <div class="feature-keyword-item" v-for="(item, index) in faqBreadCrumbs" key="index">
            <span :class="{ 'current': faqBreadCrumbs.length - 1 == index, 'first': index == 0 }">
              {{ item.name }}
            </span>
            <span class="item-space">
              <ArrowRightSmall v-if="faqBreadCrumbs.length - 1 != index"></ArrowRightSmall>
            </span>
          </div>
        </div>
      </div>
      <div class="content-wrapper" v-if="faqData">
        <div class="page-top">
          <div class="page-title button-back">
            <a-button type="link" class="btn-nav-back" @click="routeBack">
              <LeftOutlined />
              <div class="ml-21 d-inline-block">{{ $t('faq-detail.backToCreateFaq') }}</div>
            </a-button>
          </div>
          <div class="company-condition m-b-15">
            <Previous :class="(i == 0 || faqData!.answer.length == 1) ? 'cursor-icon-error' : 'cursor-icon'"
              @click="handlePrevious" />

            <div class="company-condition-text"><span v-if="faqData!.answer[i].answerCondition === FAQ_EXCLUDE">
                {{ $t('faq-detail.exclude') }}：{{ faqData!.answer[i].answerRelationCompaniesAndFaqCodes[0].originalName }}
              </span>
              <span v-else>
                {{ faqData!.answer[i].answerRelationCompaniesAndFaqCodes[0].originalName }}
              </span>
            </div>

            <a-tooltip placement="bottom">
              <template #title v-if="faqData!.answer[i].answerRelationCompaniesAndFaqCodes.length >= 2">
                <span>{{
                  faqData!.answer[i].answerRelationCompaniesAndFaqCodes
                    .filter((item, index) => index !== 0)
                    .map((item) => item.originalName)
                    .join(', ')
                }}</span>
              </template>
              <span>
                <span v-if="faqData!.answer[i].answerRelationCompaniesAndFaqCodes.length >= 2" class="other-company">{{
                  $t('faq-detail.other')
                }}{{ faqData!.answer[i].answerRelationCompaniesAndFaqCodes.length - 1
}}{{ $t('faq-detail.company') }}</span>
              </span>
            </a-tooltip>

            <Next
              :class="(i == faqData!.answer.length - 1 || faqData!.answer.length == 1) ? 'cursor-icon-error' : 'cursor-icon'"
              @click="handleNext" />
          </div>
        </div>
        <div class="card card-detail line-break">

          <div class="qa-name flex m-b-10">
            <div class="title-tag">
              <Questions-40 />
            </div>
            <div class="fs-24 question-content">
              <span>{{ faqData!.question.questionContent }}</span>
            </div>
          </div>

          <a-divider class="m-b-50 m-t-0" />

          <div>
            <div class="answer">
              <div class="title-tag">
                <Answer />
              </div>
              <div class="answer-content fs-20 ck-content">
                <span v-html="faqData!.answer[i].answerContent"></span>
              </div>
            </div>
            <div v-if="faqData!.answer[i].answerReferenceUrl != null &&
              ((faqData!.answer[i].answerReferenceUrl.length > 0 && faqData!.answer[i].answerReferenceUrl[0].urlName) ||
                faqData!.answer[i].answerFiles.length > 0)
              ">
              <div class="related-file">
                <div>
                  <div v-if="faqData!.answer[i].answerFiles.length > 0">
                    <a-row class="mb-20 content-download" v-for="(item, index) in faqData!.answer[i].answerFiles"
                      :key="index">
                      <a class="fs-20-link font line-break">{{ $t('faq-detail.fileAttachment')
                      }}{{ `${item['name']} (${convertSize(Number(item['size']))})` }}</a>
                    </a-row>
                  </div>
                  <div v-if="faqData!.answer[i].answerReferenceUrl != null &&
                    faqData!.answer[i].answerReferenceUrl.length > 0
                    ">
                    <a-row class="mb-20" v-for="(item, index) in faqData!.answer[i].answerReferenceUrl" :key="index">
                      <a v-if="item.urlLink && item.urlName" class="fs-18-link font line-break" target="_blank"
                        :href="item.urlLink">{{ item.urlName }}</a>
                    </a-row>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a-divider class="answer-divider" />

          <div class="rating">
            <div class="fs-24 vote-title">
              {{ $t('common.ratingTitle') }}
            </div>
            <div class="rating-button-group">
              <a-button type="primary" class="btn-rating">{{ $t('faq.upvote') }}</a-button>
              <a-button type="primary" class="btn-rating">{{ $t('faq.downvote') }}</a-button>
            </div>
          </div>
        </div>
        <div class="card panel-box faq-keywords mt-30" v-if="faqRelatedKeywords.length > 0">
          <h3 class="mb-26 text-center text-size-title text-primary">
            {{ $t('faq-create.keywordManagement.relatedKeyword') }}
          </h3>
          <a-row class="mt-16 feature-keywords mb-10">
            <a-col :sm="24" :xs="24" :md="24" class="feature-keyword-items">
              <div class="feature-keyword-item" v-for="(item, index) in faqRelatedKeywords" key="index">
                <span>
                  {{ item }}
                </span>
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="card panel-box search-form mt-30">
          <a-form ref="formRef">

            <h3 class="mb-16 text-center text-size-title text-primary">
              {{ $t('faq-search.search.searchKeywordTitle') }}
            </h3>
            <a-row>
              <a-col :sm="24" :xs="24">
                <a-input-search class="input-search" v-model:value="searchStore.formState.searchText" size="large"
                  :placeholder="$t('faq.form.label.inputSearchPlaceholder')">
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
                <div class="feature-keyword-item" v-for="(item, index) in relatedKeywords" :key="index">
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
          <div class="faq-category-items mt-30">
            <div class="faq-category-item" v-for="(item, index) in faqCategories" :key="index">
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

.btn-return {
  color: #37474f;
  font-size: 24px;
}

.content-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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

.page-top {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.ant-breadcrumb {
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.25px;
  color: rgba(21, 101, 192, 1);
  margin-bottom: 30px;
  margin-top: -20px;
}

.company-condition {
  text-align: right;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;

  display: flex;
  justify-content: flex-end;
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
  line-height: 40px;
  overflow-x: auto;
}

.answer-content a {
  font-weight: 500;
  font-size: 20px;
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
  white-space: nowrap;
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
  width: 100px;
}

.l-100 {
  left: 100px;
}

a.underline {
  text-decoration: underline;
}

.download-file {
  border: 1px solid rgba(0, 0, 0, 0.42);
  border-radius: 4px;
  width: 650px;
  height: 150px;
  padding: 8px 12px;
}

.content-download {
  display: flex;
  justify-content: space-between;
}

.cursor-icon {
  cursor: pointer;
}

.cursor-icon-error {
  cursor: not-allowed;
  opacity: 0.3;
}

.other-company {
  color: #1565c0de;
}


.answer .ck-content {
  border: none !important;
  font-size: 16px;
}

@media screen and (max-width: 1440px) {
  .back-to-top {
    left: 10px !important;
  }
}
</style>
