<script setup lang="ts">
import PageLayout from '@/pages/layouts/PageLayout.vue';
import { onMounted, ref } from 'vue';
import { t } from '@/plugins/i18n';
import BackToTop from '@/components/common/button/BackToTop.vue';
import Pagination from '@/components/common/pagination/Pagination.vue';
import TableNotificationList from '@/components/common/top/TableNotificationList.vue';
import axios from '../../../mock/top';
import type { RequestNotifications } from '@/types/interfaces/top';
import Timer from '@/components/icon/top/request-menu/Timer.vue';
import PhoneInTalk from '@/components/icon/top/request-menu/PhoneInTalk.vue';
import Insights from '@/components/icon/top/request-menu/Insights.vue';
import Loyalty from '@/components/icon/top/request-menu/Loyalty.vue';
import EventNote from '@/components/icon/top/request-menu/EventNote.vue';
import Face from '@/components/icon/top/request-menu/Face.vue';
import ReceiptLong from '@/components/icon/top/request-menu/ReceiptLong.vue';
import Ballot from '@/components/icon/top/request-menu/Ballot.vue';
import router from '@/router';
import MarkUnread from '@/components/common/button/MarkUnread.vue';

const isLoading = ref<boolean>(true);
let listRequestStatus: RequestNotifications[] = [];
const pageSizeRequest = ref(5);
let currentPageRequest = ref(1);
let totalRequest = 0;
const pageSizeRequestOptions = ref<string[]>(['5', '10', '20', '30', '40', '50']);

const listColumnRequestStatus = [
  {
    title: t('top.table.request_notification_list.columns.reception_no'),
    key: 'reception_no',
    width: '100px',
    dataIndex: 'reception_no'
  },
  {
    title: t('top.table.request_notification_list.columns.requested_date'),
    key: 'requested_date',
    type: 'date',
    width: '180px',
    dataIndex: 'requested_date'
  },
  {
    title: t('top.table.request_notification_list.columns.request_content'),
    key: 'request_content',
    dataIndex: 'request_content',
    width: '380px'
  },
  {
    title: t('top.table.request_notification_list.columns.situation'),
    key: 'situation',
    type: 'situation',
    width: '180px',
    dataIndex: 'situation'
  }
];

onMounted(async () => {
  // await getRequestNotificationList();
  isLoading.value = false;
});

const getRequestNotificationList = async () => {
  await axios.get('/api/get_request_notifications').then((response) => {
    listRequestStatus = response.data.request_notification_list;
    totalRequest = listRequestStatus.length;
  });
};

const onChangePageRequest = (onChange: any) => {
  currentPageRequest.value = onChange.page;
  pageSizeRequest.value = onChange.limit;
};

const onFaqRedirection = async () => {
  await router.push('/faq/search');
};
</script>

<template>
  <page-layout :is-loading="isLoading">
    <div class="center container">
      <BackToTop class="left-btn-back"></BackToTop>

      <MarkUnread></MarkUnread>

      <div class="page-top">
        <span class="title-card">{{ $t('top.top_menu.title') }}</span>
      </div>

      <div class="list-card">
        <div class="list-card-item">
          <div class="card-icon">
            <Timer></Timer>
          </div>
          <div class="card-content">
            <div class="card-content-title">{{ $t('top.top_menu.card.work_management') }}</div>
            <div class="card-content-sub-title">
              説明・・・・・・・・ ・・・・・・・・・・ ・・・・・・・・・・ ・・・・・・・・・・
            </div>
          </div>
        </div>

        <div class="list-card-item">
          <div class="card-icon">
            <Ballot></Ballot>
          </div>
          <div class="card-content">
            <div class="card-content-title">{{ $t('top.top_menu.card.payslip') }}</div>
            <div class="card-content-sub-title">
              説明・・・・・・・・ ・・・・・・・・・・ ・・・・・・・・・・ ・・・・・・・・・・
            </div>
          </div>
        </div>

        <div class="list-card-item">
          <div class="card-icon">
            <Face></Face>
          </div>
          <div class="card-content">
            <div class="card-content-title">{{ $t('top.top_menu.card.change_identity') }}</div>
            <div class="card-content-sub-title">
              説明・・・・・・・・ ・・・・・・・・・・ ・・・・・・・・・・ ・・・・・・・・・・
            </div>
          </div>
        </div>

        <div class="list-card-item">
          <div class="card-icon">
            <EventNote></EventNote>
          </div>
          <div class="card-content">
            <div class="card-content-title">{{ $t('top.top_menu.card.year_end_adjustment') }}</div>
            <div class="card-content-sub-title">
              説明・・・・・・・・ ・・・・・・・・・・ ・・・・・・・・・・ ・・・・・・・・・・
            </div>
          </div>
        </div>

        <div class="list-card-item">
          <div class="card-icon">
            <Loyalty></Loyalty>
          </div>
          <div class="card-content">
            <div class="card-content-title">{{ $t('top.top_menu.card.social_insurance') }}</div>
            <div class="card-content-sub-title">
              説明・・・・・・・・ ・・・・・・・・・・ ・・・・・・・・・・ ・・・・・・・・・・
            </div>
          </div>
        </div>

        <div class="list-card-item">
          <div class="card-icon">
            <ReceiptLong></ReceiptLong>
          </div>
          <div class="card-content">
            <div class="card-content-title">{{ $t('top.top_menu.card.certificate_issuance') }}</div>
            <div class="card-content-sub-title">
              説明・・・・・・・・ ・・・・・・・・・・ ・・・・・・・・・・ ・・・・・・・・・・
            </div>
          </div>
        </div>

        <div class="list-card-item">
          <div class="card-icon">
            <Insights></Insights>
          </div>
          <div class="card-content">
            <div class="card-content-title">{{ $t('top.top_menu.card.formation_holding') }}</div>
            <div class="card-content-sub-title">
              説明・・・・・・・・ ・・・・・・・・・・ ・・・・・・・・・・ ・・・・・・・・・・
            </div>
          </div>
        </div>

        <div class="list-card-item">
          <div class="card-icon phone-talk">
            <PhoneInTalk></PhoneInTalk>
          </div>
          <div class="card-content" @click="onFaqRedirection">
            <div class="card-content-title">{{ $t('top.top_menu.card.faq') }}</div>
            <div class="card-content-sub-title">
              説明・・・・・・・・ ・・・・・・・・・・ ・・・・・・・・・・ ・・・・・・・・・・
            </div>
          </div>
        </div>
      </div>

      <div class="card table-notification-list">
        <div class="title-card">{{ $t('top.table.request_notification_list.title') }}</div>

        <table-notification-list
          :table-data="listRequestStatus"
          :columns="listColumnRequestStatus"
        />

        <Pagination
          :page="currentPageRequest"
          :limit="pageSizeRequest"
          :total="totalRequest"
          :page-size-options="pageSizeRequestOptions"
          :total-data="listRequestStatus.length"
          @pagination="onChangePageRequest"
          class="m-t-25"
        >
        </Pagination>
      </div>
    </div>
  </page-layout>
</template>

<style scoped>
@import './../../assets/styles/common.css';
@import './../../assets/styles/page.css';
@import './../../assets/styles/button.css';

.list-card {
  padding-bottom: 20px;
  display: inline-block;
  width: 100%;
}

.list-card-item {
  max-width: 280px;
  float: left;
  padding: 0 8px;
}

.card-icon {
  margin: 0 auto;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  padding: 10px;
  background-color: rgba(255, 204, 128, 1);
  transform: translate(0, 40px);
}

.card-content {
  cursor: pointer;
  margin: 0 8px;
  text-align: center;
  padding: 50px 10px 10px;
  background-color: rgba(255, 255, 255, 1);
  gap: 15px;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
    0 1px 5px rgba(0, 0, 0, 0.12);
}

.card-content-title {
  height: 50px;
  font-size: 28px;
  font-weight: 700;
  color: rgba(38, 50, 56, 0.9);
  margin-bottom: 15px;
}

.card-content-sub-title {
  padding: 18px 10px 30px;
  font-weight: 400;
  font-size: 16px;
  color: rgba(38, 50, 56, 0.9);
}

.phone-talk {
  background-color: rgba(128, 203, 196, 1) !important;
  opacity: 60%;
}
</style>
