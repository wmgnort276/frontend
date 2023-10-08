<script setup lang="ts">
import { onMounted, ref } from 'vue';
import PageLayout from '@/pages/layouts/PageLayout.vue';
import { t } from '@/plugins/i18n';
import Notification from '@/components/icon/top/menu-manager/Notification.vue'
import RequestNoticeIcon from '@/components/icon/top/menu-manager/RequestNoticeIcon.vue'
import InformationNotice from '@/components/icon/top/menu-manager/InformationNotice.vue'
import GuidanceNoticeIcon from '@/components/icon/top/menu-manager/GuidanceNoticeIcon.vue'
import FQACreateIcon from '@/components/icon/top/menu-manager/FQACreateIcon.vue'
import FAQSearchIcon from '@/components/icon/top/menu-manager/FAQSearchIcon.vue'
import FAQEndYearCreateIcon from '@/components/icon/top/menu-manager/FAQEndYearCreateIcon.vue'
import FAQEndYearSearchIcon from '@/components/icon/top/menu-manager/FAQEndYearSearchIcon.vue'
import ShareFileCreateIcon from '@/components/icon/top/menu-manager/ShareFileCreateIcon.vue'
import ShareFileSearchIcon from '@/components/icon/top/menu-manager/ShareFileSearchIcon.vue'
import router from '@/router';
import { useAuthStoreHook } from '@/stores/auth.store';
import { useFaqSearchStore } from '@/stores/faqSearch.store';
import { useTopStore } from '@/stores/top.store';

const isLoading = ref<boolean>(false);

const userStore = useAuthStoreHook();
const searchStore = useFaqSearchStore();
const topStore = useTopStore();

let isShowFaq = ref<boolean>(false);
let isShowFaqCreate = ref<boolean>(false);
let isShowFaqCode = ref<boolean>(false);
let isShowFaqCodeCreate = ref<boolean>(false);
let isShowShareFile = ref<boolean>(false);
let isShowShareFileCreate = ref<boolean>(false);

const columns = [
  {
    title: t('top.topManager.request.table-header.content'),
    key: 'content',
    width: '350px',
    dataIndex: 'content',
  },
  {
    title: t('top.topManager.request.table-header.affiliation'),
    key: 'affiliation',
    width: '300px',
    dataIndex: 'affiliation',
    ellipsis: true,
  },
  {
    title: t('top.topManager.request.table-header.request-source'),
    key: 'request-source',
    width: '100px',
    dataIndex: 'request-source',
    ellipsis: true,
  },
  {
    title: t('top.topManager.request.table-header.request-date'),
    key: 'request-date',
    width: '100px',
    dataIndex: 'request-date',
    ellipsis: true,
  }
];

// Fake data for request table
let listRequest = ref<any>([
  {
    content: '申請タイトル',
    affiliation: "会社名・所属部署名",
    requestSource: "苗字 名前",
    requestDate: '2023/01/01',
  },
  {
    content: '雇用保険_高年齢給付金開始申請',
    affiliation: "●●●●銀行 東京支店 システム管理部 システム管理部",
    requestSource: "田中 一郎",
    requestDate: '2023/01/01',
  },
  {
    content: '離職票発行確認書',
    affiliation: "株式会社●●●●●●●● 管理部",
    requestSource: "高橋 佐智子",
    requestDate: '2023/01/01',
  }
])

isShowFaq.value = userStore.isViewFaqNormal();
isShowFaqCreate.value = userStore.isEditFaqNormal();
isShowFaqCode.value = userStore.isViewFaqEndYear();
isShowFaqCodeCreate.value =  userStore.isEditFaqEndYear();
isShowShareFile.value = userStore.isViewShareFile();
isShowShareFileCreate.value = userStore.isCreateShareFile();

onMounted(async () => {
  isLoading.value = true;
  searchStore.clearAllData();
  await topStore.getUserBusinessResponsible();
  await topStore.getUserCompanyGroupResponsible();
  isLoading.value = false;
});

const onFaqCreateRedirection = async () => {
  searchStore.formState.isFaqCode = false;
  router.push('/faq/create');
};

const onFaqSearchRedirection = async () => {
  searchStore.formState.isFaqCode = false;
  router.push('/faq/search');
};

const onFaqCodeCreateRedirection = async () => {
  searchStore.formState.isFaqCode = true;
  router.push('/faq/create');
};

const onFaqCodeRedirection = async () => {
  searchStore.formState.isFaqCode = true;
  router.push('/faq/search?isFaqCode=1');
};

const onShareFileCreateRedirection = async () => {
  router.push('/sharefiles/create');
};

const onShareFileSearchRedirection = async () => {
  searchStore.formState.isFaqCode = true;
  router.push('/sharefiles/search');
};


</script>

<template>
  <!-- Responsibility section -->
  <div class="responsibility-section">
    <!-- Business responsible -->
    <div class="business">
      <span class="fs-18-white mr-20">
        {{ t('top.topManager.responsibility.business.title') }}
      </span>
      <a-select
        class="w-300"
        size="large"
        :placeholder="t('top.topManager.responsibility.business.place-holder')"
        :options="topStore.userBusinessResponsible"
        optionFilterProp="businessName"
        :fieldNames="{
          value: 'businessCode',
          label: 'businessName'
        }"
        >
      </a-select>
    </div>

    <!-- Company responsible -->
    <div class="companyGroup">
      <span class="fs-18-white mr-20">
        {{ t('top.topManager.responsibility.companyGroup.title') }}
      </span>
      <a-select
       class="w-300"
       size="large"
       :placeholder="t('top.topManager.responsibility.companyGroup.place-holder')"
       :options="topStore.userCompanyGroupResponsible"
        optionFilterProp="companyGroupName"
        :fieldNames="{
          value: 'companyGroupCode',
          label: 'companyGroupName'
        }"
       >
      </a-select>
    </div>
  </div>
  <page-layout :is-loading="isLoading">
    <div class="main-page">
      <!-- Request table section -->
      <div class="m-t-35">
        <div class="m-b-11">
          <h3 class="text-center text-size-title text-primary m-b-0 fs-24-title">
            {{ t('top.topManager.request.header') }}
          </h3>
        </div>

        <div class="panel-box request-list">
          <!--Request are shown in table when device is laptop, pc ...-->
          <div class="request-table">
            <a-table class="ant-table-striped" size="middle" :columns="columns" :data-source="listRequest"
              :row-class-name="(_record: any, index: any) => (index % 2 === 1 ? 'table-striped' : null)">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'content'">
                    <span class="fs-18-fw-600 table-cell">
                      {{ record.content }}
                    </span>
                </template>
                <template v-if="column.key === 'affiliation'">
                  <span class="fs-18-fw-400 table-cell m-w-280">
                    {{ record.affiliation }}
                  </span>
                </template>
                <template v-else-if="column.key === 'request-source'">
                  <span class="fs-16 table-cell">
                    {{ record.requestSource }}
                  </span>
                </template>

                <template v-else-if="column.key === 'request-date'">
                  <span class="fs-16 table-cell">
                    {{ record.requestDate }}
                  </span>
                </template>

              </template>
            </a-table>
          </div>

        </div>
      </div>

      <!-- Menu section -->
      <div class="menu-section m-t-35 m-b-104">
        <h3 class="text-center text-size-title text-primary m-b-0 fs-24-title m-b-11">{{
            $t('top.topManager.menu.header') }}</h3>

        <div class="menu-item-list">
          <div class="menu-item">
              <div class="menu-item-icon">
                <Notification />
              </div>
              <div class="menu-item-title fs-26-fw-600">
                <span>
                  {{ $t('top.topManager.menu.notification.title') }}
                </span>
              </div>
          </div>

          <div class="menu-item">
              <div class="menu-item-icon">
                <RequestNoticeIcon />
              </div>
              <div class="menu-item-title fs-26-fw-600">
                <span>
                  {{ $t('top.topManager.menu.request-notice.title1st') }}
                </span>
                <span>
                  {{ $t('top.topManager.menu.request-notice.title2nd') }}
                </span>
              </div>
          </div>

          <div class="menu-item">
              <div class="menu-item-icon">
                <InformationNotice />
              </div>
              <div class="menu-item-title fs-26-fw-600">
                <span>
                  {{ $t('top.topManager.menu.information-notice.title') }}
                </span>
              </div>
          </div>

          <div class="menu-item">
              <div class="menu-item-icon">
                <GuidanceNoticeIcon />
              </div>
              <div class="menu-item-title fs-26-fw-600">
                <span>
                  {{ $t('top.topManager.menu.guidance-notice.title') }}
                </span>
              </div>
          </div>

          <div class="menu-item" @click="onFaqCreateRedirection" v-if="isShowFaqCreate">
              <div class="menu-item-icon">
                <FQACreateIcon />
              </div>
              <div class="menu-item-title fs-26-fw-600">
                <span>
                  {{ $t('top.topManager.menu.faq-create.title') }}
                </span>
              </div>
          </div>

          <div class="menu-item" @click="onFaqSearchRedirection" v-if="isShowFaq">
              <div class="menu-item-icon">
                <FAQSearchIcon />
              </div>
              <div class="menu-item-title fs-26-fw-600">
                <span>
                  {{ $t('top.topManager.menu.faq-search.title') }}
                </span>
              </div>
          </div>

          <div class="menu-item" @click="onFaqCodeCreateRedirection" v-if="isShowFaqCodeCreate">
              <div class="menu-item-icon">
                <FAQEndYearCreateIcon />
              </div>
              <div class="menu-item-title fs-26-fw-600">
                <span>
                  {{ $t('top.topManager.menu.faq-end-year-create.title') }}
                </span>
              </div>
          </div>

          <div class="menu-item" @click="onFaqCodeRedirection" v-if="isShowFaqCode">
              <div class="menu-item-icon">
                <FAQEndYearSearchIcon/>
              </div>
              <div class="menu-item-title fs-26-fw-600">
                <span>
                  {{ $t('top.topManager.menu.faq-end-year-search.title') }}
                </span>
              </div>
          </div>

          <!-- <div class="menu-item" @click="onShareFileCreateRedirection" v-if="isShowShareFileCreate">
              <div class="menu-item-icon">
                <ShareFileCreateIcon />
              </div>
              <div class="menu-item-title fs-26-fw-600">
                <span>
                  {{ $t('top.topManager.menu.share-file-create.title') }}
                </span>
              </div>
          </div>

          <div class="menu-item" @click="onShareFileSearchRedirection" v-if="isShowShareFile">
              <div class="menu-item-icon">
                <ShareFileSearchIcon />
              </div>
              <div class="menu-item-title fs-26-fw-600">
                <span>
                  {{ $t('top.topManager.menu.share-file-search.title') }}
                </span>
              </div>
          </div> -->

        </div>
      </div>

    </div>
  </page-layout>
</template>

<style scoped>
@import './../../assets/styles/common.css';
@import './../../assets/styles/page.css';
@import './../../assets/styles/button.css';

.responsibility-section {
  background-color: #007F99;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  gap: 80px;
  margin: -17px -19px 20px -19px;
}

:deep(.ant-select-selection-placeholder) {
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  color: #999 !important;
}

:deep(.ant-select-selector) {
  border-radius: 4px !important;
}

.request-list {
  padding: 36px 140px 36px 140px;
}

.table-cell {
  color: #2B2B2B;
}

.menu-item-list {
  display: flex;
  gap: 26px;
  flex-wrap: wrap;
}

.menu-item {
  width: 280px;
  height: 120px;
  border-radius: 8px;
  background: #FFF;
  box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.menu-item-icon {
  margin-left: 20px;
}

.menu-item-title span {
  display: block;
}

</style>
