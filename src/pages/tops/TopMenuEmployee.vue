<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from '../../../mock/top';
import type {
  Notifications,
  InformationNotifications,
  RequestNotifications
} from '@/types/interfaces/top';
import PageLayout from '@/pages/layouts/PageLayout.vue';
import { t } from '@/plugins/i18n';
import router from '@/router';
import { useAuthStoreHook } from '@/stores/auth.store';
import { useFaqSearchStore } from '@/stores/faqSearch.store';
import Warning from '@/components/icon/top/notice/Warning.vue'
import WarningSmall from '@/components/icon/top/notice/WarningSmall.vue'
import FaqMenuIcon from '@/components/icon/top/menu/FaqMenuIcon.vue'
import FaqMenuIconSmall from '@/components/icon/top/menu/FaqMenuIconSmall.vue'
import Time3MenuIcon from '@/components/icon/top/menu/Time3MenuIcon.vue'
import Time3MenuIconSmall from '@/components/icon/top/menu/Time3MenuIconSmall.vue'
import WaveMenuIcon from '@/components/icon/top/menu/WaveMenuIcon.vue'
import WaveMenuIconSmall from '@/components/icon/top/menu/WaveMenuIconSmall.vue'
import FactorMenuIcon from '@/components/icon/top/menu/FactorMenuIcon.vue'
import FactorMenuIconSmall from '@/components/icon/top/menu/FactorMenuIconSmall.vue'
import InsuranceMenuIcon from '@/components/icon/top/menu/InsuranceMenuIcon.vue'
import InsuranceMenuIconSmall from '@/components/icon/top/menu/InsuranceMenuIconSmall.vue'
import HrMenuIcon from '@/components/icon/top/menu/HrMenuIcon.vue'
import HrMenuIconSmall from '@/components/icon/top/menu/HrMenuIconSmall.vue'
import FactoryMenuBackground from '@/components/icon/top/menu/FactorMenuBackground.vue'
import FaqMenuBackground from '@/components/icon/top/menu/FaqMenuBackground.vue'
import HrMenuBackground from '@/components/icon/top/menu/HrMenuBackground.vue'
import InsuranceMenuBackground from '@/components/icon/top/menu/InsuranceMenuBackground.vue'
import Time3MenuBackground from '@/components/icon/top/menu/Time3MenuBackground.vue'
import WaveMenuBackground from '@/components/icon/top/menu/WaveMenuBackground.vue'
import FactoryMenuBackgroundSmall from '@/components/icon/top/menu/FactorMenuBackgroundSmall.vue'
import FaqMenuBackgroundSmall from '@/components/icon/top/menu/FaqMenuBackgroundSmall.vue'
import HrMenuBackgroundSmall from '@/components/icon/top/menu/HrMenuBackgroundSmall.vue'
import InsuranceMenuBackgroundSmall from '@/components/icon/top/menu/InsuranceMenuBackgroundSmall.vue'
import Time3MenuBackgroundSmall from '@/components/icon/top/menu/Time3MenuBackgroundSmall.vue'
import WaveMenuBackgroundSmall from '@/components/icon/top/menu/WaveMenuBackgroundSmall.vue'

const searchStore = useFaqSearchStore();
const userStore = useAuthStoreHook();

const isLoading = ref<boolean>(true);

let isShowFaq = ref<boolean>(false);

onMounted(async () => {
  searchStore.clearAllData();
  let userInfo = userStore.authUser;

  let companyFunctions = userInfo?.companyFunctions;
  let userFunctions = userInfo?.functions;

  let isValidFAQCompany = false;
  let isValidFAQUser = false;

  let validFAQ = companyFunctions?.filter((item) => {
    return item.functionCode == "FFAQ-NORMAL" && item.flag == "true";
  });

  if (validFAQ && validFAQ?.length > 0) {
    isValidFAQCompany = true;
  }

  let validFAQUser = userFunctions?.filter((item) => {
    return item.functionCode == "FFAQ-NORMAL" && (item.flag == "0" || item.flag == "1");
  });

  if (validFAQUser && validFAQUser?.length > 0) {
    isValidFAQUser = true;
  }

  if (isValidFAQUser && isValidFAQCompany) {
    isShowFaq.value = true;
  }

  isLoading.value = false;
  isLoading.value = true;
  await getInformationNotificationList();
  isLoading.value = false;
});


let informationNotifications = ref<InformationNotifications[]>([
  {
    updated_at: '2023/11/11',
    content: "共通のお知らせ件名タイトルです。1行固定表示で長文の場合はテキストを省略して表示されま",
    status: "共",
    id: 1,
  },
  {
    updated_at: '2023/11/11',
    content: "共通のお知らせ件名タイトルです。1行固定表示で長文の場合はテキストを省略して表示されま",
    status: null,
    id: 2,
  },
  {
    updated_at: '2023/11/11',
    content: "共通のお知らせ件名タイトルです。1行固定表示で長文の場合はテキストを省略して表示されま",
    status: null,
    id: 3,
  }
]);

const columns = [
  {
    title: t('top.requests.table.date'),
    key: 'date',
    type: 'array',
    width: '80px',
    dataIndex: 'business_division',
  },
  {
    title: t('top.requests.table.content'),
    key: 'content',
    type: 'date',
    width: '180px',
    dataIndex: 'content',
    ellipsis: true,
  },
  {
    title: t('top.requests.table.status'),
    key: 'status',
    width: '350px',
    dataIndex: 'status',
    ellipsis: true,
  }
];

let listRequest = ref<any>([
  {
    date: '2023/11/11',
    content: "申請のタイトます。",
    status: "受付済みです。給金の申請中です。",
    id: 1,
  },
  {
    date: '2023/11/11',
    content: "申請のタイト",
    status: "受付済みです。給金の申請中です。",
    id: 2,
  },
  {
    date: '2023/11/11',
    content: "共通のお知らま",
    status: "受付済みです。給金の申請中です。数週間後に振。",
    id: 3,
  }
])


const getInformationNotificationList = async () => {
  // Get list notification
  /*
  ......
  */
};

const handleShowNotice = () => {
  // Handle show more notice
}

const handleRouteToFAQ = () => {
  router.push('/faq/search');
}

const handleShowRequest = () => {
  // Handle show more request
}

</script>

<template>
  <page-layout :is-loading="isLoading">
    <div class="main-page">
      <!-- Breadcrumb section -->
      <div class="navigation">
        <div class="navigation-breadcrumb">
          <div class="feature-keyword-item">
            <span>
              {{ $t('top.breadcrumb.top') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Notice section -->
      <div class="notice-section">
        <div>
          <h3 class="mb-16 text-center text-size-title text-primary notice-title">{{
            $t('top.notice.title') }}</h3>
        </div>

        <div class="panel-box notice-list">
          <div v-for="(item, index) in informationNotifications" class="notice-item">
            <div class="notice-item-content">
              <div class="notice-item-info">
                <!-- Notice tag -->
                <div class="notice-tag">
                  <span v-if="item.status" class="notice-tag-icon">
                    <Warning />
                  </span>
                  <span v-if="item.status" class="notice-tag-icon-small">
                    <WarningSmall />
                  </span>
                </div>

                <!-- Update date -->
                <span class="notice-date fs-18-fw-400">
                  {{ item.updated_at }}
                </span>
              </div>

              <!-- Notice content -->
              <span class="notice-content fs-18-lh-29">
                {{ item.content }}
              </span>
            </div>

            <a-divider></a-divider>
          </div>

          <div class="show-data" @click="handleShowNotice">
            <span class="fs-16-link show-data-btn">
              {{ $t('top.notice.show-button') }}
            </span>
          </div>

        </div>

      </div>

      <!-- Menu section -->
      <div class="menu-section">
        <div>
          <h3 class="mb-16 text-center text-size-title text-primary menu-title">{{
            $t('top.menu.title') }}</h3>
        </div>
        <div class="menu-item-list-wrap">
          <div class="menu-item-list">
  
            <div class="menu-item">
              <div class="menu-item-content">
                <div class="menu-item-header">
                  <div class="menu-item-icon">
                    <Time3MenuBackground />
                    <span class="icon">
                      <Time3MenuIcon />
                    </span>
                  </div>
                  <div class="menu-item-icon-sm">
                    <Time3MenuBackgroundSmall />
                    <span class="icon">
                      <Time3MenuIconSmall />
                    </span>
                  </div>
  
                  <div class="menu-item-title fs-30 time3-title">
                    <span>
                      {{ $t('top.menu.time3.title') }}
                    </span>
                  </div>
                </div>
  
                <div class="menu-item-description">
                  <span class="fs-14">
                    {{ $t('top.menu.time3.description') }}
                  </span>
                </div>
  
              </div>
            </div>
  
            <div class="menu-item">
              <div class="menu-item-content">
                <div class="menu-item-header">
                  <div class="menu-item-icon">
                    <FactoryMenuBackground />
                    <span class="icon">
                      <FactorMenuIcon />
                    </span>
                  </div>
                  <div class="menu-item-icon-sm">
                    <FactoryMenuBackgroundSmall />
                    <span class="icon">
                      <FactorMenuIconSmall />
                    </span>
                  </div>
  
                  <div class="menu-item-title fs-30 factor-title">
                    <span>
                      {{ $t('top.menu.factor.title') }}
                    </span>
                  </div>
                </div>
  
                <div class="menu-item-description">
                  <span class="fs-14">
                    {{ $t('top.menu.factor.description') }}
                  </span>
                </div>
  
              </div>
            </div>
  
            <div class="menu-item">
              <div class="menu-item-content">
                <div class="menu-item-header">
                  <div class="menu-item-icon">
                    <WaveMenuBackground />
                    <span class="icon">
                      <WaveMenuIcon />
                    </span>
                  </div>
                  <div class="menu-item-icon-sm">
                    <WaveMenuBackgroundSmall />
                    <span class="icon">
                      <WaveMenuIconSmall />
                    </span>
                  </div>
  
                  <div class="menu-item-title fs-30 wave-title">
                    <span>
                      {{ $t('top.menu.wave.title') }}
                    </span>
                  </div>
                </div>
  
                <div class="menu-item-description">
                  <span class="fs-14">
                    {{ $t('top.menu.wave.description') }}
                  </span>
                </div>
  
              </div>
            </div>
  
            <div class="menu-item">
              <div class="menu-item-content">
                <div class="menu-item-header">
                  <div class="menu-item-icon">
                    <InsuranceMenuBackground />
                    <span class="icon">
                      <InsuranceMenuIcon />
                    </span>
                  </div>
                  <div class="menu-item-icon-sm">
                    <InsuranceMenuBackgroundSmall />
                    <span class="icon">
                      <InsuranceMenuIconSmall />
                    </span>
                  </div>
  
                  <div class="menu-item-title fs-30 insurance-title">
                    <span>
                      {{ $t('top.menu.insurance.title') }}
                    </span>
                  </div>
                </div>
  
                <div class="menu-item-description">
                  <span class="fs-14">
                    {{ $t('top.menu.insurance.description') }}
                  </span>
                </div>
  
              </div>
            </div>
  
  
            <div class="menu-item">
              <div class="menu-item-content">
                <div class="menu-item-header">
                  <div class="menu-item-icon">
                    <HrMenuBackground />
                    <span class="icon">
                      <HrMenuIcon />
                    </span>
                  </div>
                  <div class="menu-item-icon-sm">
                    <HrMenuBackgroundSmall />
                    <span class="icon">
                      <HrMenuIconSmall />
                    </span>
                  </div>
  
                  <div class="menu-item-title fs-30 hr-title">
                    <span>
                      {{ $t('top.menu.hr.title') }}
                    </span>
                  </div>
                </div>
  
                <div class="menu-item-description">
                  <span class="fs-14">
                    {{ $t('top.menu.hr.description') }}
                  </span>
                </div>
  
              </div>
            </div>
  
            <div class="menu-item" v-if="isShowFaq" @click="handleRouteToFAQ">
              <div class="menu-item-content">
                <div class="menu-item-header">
                  <div class="menu-item-icon">
                    <FaqMenuBackground />
                    <span class="icon">
                      <FaqMenuIcon />
                    </span>
                  </div>
                  <div class="menu-item-icon-sm">
                    <FactoryMenuBackgroundSmall />
                    <span class="icon">
                      <FaqMenuIconSmall />
                    </span>
                  </div>
  
                  <div class="menu-item-title fs-30 faq-title">
                    <span>
                      {{ $t('top.menu.faq.title') }}
                    </span>
                  </div>
                </div>
  
                <div class="menu-item-description">
                  <span class="fs-14">
                    {{ $t('top.menu.faq.description') }}
                  </span>
                </div>
  
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Request section -->
      <div class="request-section mt-30">
        <div>
          <h3 class="mb-16 text-center text-size-title text-primary">{{
            $t('top.requests.title') }}</h3>
        </div>

        <div class="panel-box request-list">
          <!--Request are shown in table when device is laptop, pc ...-->
          <div class="request-table">
            <a-table class="ant-table-striped" size="middle" :columns="columns" :data-source="listRequest"
              :row-class-name="(_record: any, index: any) => (index % 2 === 1 ? 'table-striped' : null)">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'date'">
                  <div>
                    <span class="fs-18 table-cell">{{ record.date }}</span>
                  </div>
                </template>
                <template v-if="column.key === 'content'">
                  <span class="fs-18-fw-600 table-cell">
                    {{ record.content }}
                  </span>
                </template>
                <template v-else-if="column.key === 'status'">
                  <span class="fs-16 table-cell">
                    {{ record.status }}
                  </span>
                </template>

              </template>
            </a-table>
          </div>

          <!-- Only shown when device is mobile, requests are shown in list style-->
          <div class="request-list-data" v-for="(item, index) in listRequest">
            <div class="request-content m-b-5 m-t-10">
              <span class="fs-16-600-white p-l-10">
                {{ item.content }}
              </span>
            </div>
            <div class="request-status m-b-10">
              <span class="fs-13-main-color request-status-title">
                {{ $t('top.requests.table.status') }}
              </span>
              <span class="fs-16 request-status-content">
                {{ item.status }}
              </span>
            </div>

            <div class="request-date">
              <span class="fs-13-main-color">
                {{ $t('top.requests.table.date') }}
              </span>
              <span class="request-date-content fs-16 m-l-15">
                {{ item.date }}
              </span>
            </div>
          </div>

          <div class="show-data" @click="handleShowRequest">
            <span class="fs-16-link show-data-btn mt-20">
              {{ $t('top.requests.show-button') }}
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


.notice-item ::v-deep(.ant-divider) {
  margin-top: 14px;
  margin-bottom: 24px;
}


.notice-tag span {
  margin-right: 10px;
}


.show-data {
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-section {
  margin-top: 40px;
}

.menu-item-list-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-item-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.menu-item {
  width: 280px;
  height: 280px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 8px;
  box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-item-content {
  height: 100%;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.menu-item-icon {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-item-icon-sm {
  display: none;
}

.menu-item-description {
  overflow: hidden;
  text-overflow: ellipsis;
}


.request-list-data {
  display: none;
}

.icon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time3-title {
  color: #005099; 
}

.factor-title {
  color: #009934;
}

.wave-title {
  color: #994000;
}

.insurance-title {
  color: #840099;
}

.hr-title {
  color: #996E00;
}

.faq-title {
  color: #009099;
}

@media screen and (max-width: 1440px) {
  .left-btn-back {
    left: 20px !important;
  }
}

@media screen and (max-width: 767px) {

  .show-data-btn {
    font-size: 14px;
    font-weight: 400;
  }

  .menu-section {
    margin-top: 20px;
  }

  .menu-title {
    margin-bottom: 11px;
  }

  .menu-item {
    width: 100%;
    height: 140px;
  }

  .menu-item-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }

  .menu-item-icon {
    display: none;
  }

  .menu-item-icon-sm {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .request-table {
    display: none;
  }

  .request-list-data {
    display: block;
  }

  .menu-item-content {
    gap: 9px;
    padding: 20px 23px;
  }
}
</style>
