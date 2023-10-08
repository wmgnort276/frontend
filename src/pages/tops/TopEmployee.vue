<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from '../../../mock/top';
import type {
  Notifications,
  InformationNotifications,
  RequestNotifications
} from '@/types/interfaces/top';
import BackToTop from '@/components/common/button/BackToTop.vue';
import PageLayout from '@/pages/layouts/PageLayout.vue';
import NotificationList from '@/components/common/top/NotificationList.vue';
import Pagination from '@/components/common/pagination/Pagination.vue';
import TagNotification from '@/components/common/top/TagNotification.vue';
import FAQ from '@/components/icon/top/others/FAQ.vue';
import Folder from '@/components/icon/top/others/Folder.vue';
import Phone from '@/components/icon/top/others/Phone.vue';
import Comment from '@/components/icon/top/others/Comment.vue';
import TableNotificationList from '@/components/common/top/TableNotificationList.vue';
import { t } from '@/plugins/i18n';
import router from '@/router';
import { useAuthStoreHook } from '@/stores/auth.store';
import { useFaqSearchStore } from '@/stores/faqSearch.store';

const searchStore = useFaqSearchStore();

const isLoading = ref<boolean>(true);
const pageSizeInformation = ref(5);
const pageSizeRequest = ref(5);
let currentPageInformation = ref(1);
let currentPageRequest = ref(1);
let totalInformation = 0;
let totalRequest = 0;
const pageSizeInformationOptions = ref<string[]>(['5', '10', '20', '30', '40', '50']);
const pageSizeRequestOptions = ref<string[]>(['5', '10', '20', '30', '40', '50']);

onMounted(async () => {
  // await getNotificationList();
  // await getInformationNotificationList();
  // await getRequestNotificationList();
  isLoading.value = false;
});

const columnsInformation = [
  {
    title: t('top.table.information_notification_list.columns.business_division'),
    key: 'business_division',
    type: 'array',
    width: '180px',
    dataIndex: 'business_division'
  },
  {
    title: t('top.table.information_notification_list.columns.last_updated'),
    key: 'updated_at',
    type: 'date',
    width: '180px',
    dataIndex: 'updated_at'
  },
  {
    title: t('top.table.information_notification_list.columns.notification_content'),
    key: 'content',
    dataIndex: 'content',
    width: '380px'
  },
  {
    title: t('top.table.information_notification_list.columns.status'),
    key: 'status',
    type: 'status',
    width: '180px',
    dataIndex: 'status'
  }
];

const columnsRequest = [
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

let notifications: Notifications[];
let informationNotifications: InformationNotifications[] = [];
let requestNotifications: RequestNotifications[] = [];

const getNotificationList = async () => {
  await axios.get('/api/get_notifications').then((response) => {
    notifications = response.data.notifications;
  });
};

const getInformationNotificationList = async () => {
  await axios.get('/api/get_information_notifications').then((response) => {
    informationNotifications = response.data.information_notification_list;
    totalInformation = informationNotifications.length;
  });
};

const getRequestNotificationList = async () => {
  await axios.get('/api/get_request_notifications').then((response) => {
    requestNotifications = response.data.request_notification_list;
    totalRequest = requestNotifications.length;
  });
};

const onChangePageInformation = (onChange: any) => {
  currentPageInformation.value = onChange.page;
  pageSizeInformation.value = onChange.limit;
};

const onChangePageRequest = (onChange: any) => {
  currentPageRequest.value = onChange.page;
  pageSizeRequest.value = onChange.limit;
};

const onFaqRedirection = async () => {
  searchStore.formState.isFaqCode = false;
  router.push('/faq/search');
};

const onFaqCodeRedirection = async () => {
  searchStore.formState.isFaqCode = true;
  router.push('/faq/search?isFaqCode=1');
};
</script>

<template>
  <page-layout :is-loading="isLoading">
    <div class="center">
      <BackToTop class="left-btn-back"></BackToTop>
      <div class="notification-list">
        <notification-list :notification-list="notifications"></notification-list>
      </div>
      <div class="card table-notification-list">
        <div class="title-card">{{ $t('top.table.information_notification_list.title') }}</div>

        <table-notification-list
          :table-data="informationNotifications"
          :columns="columnsInformation"
        />
        <Pagination
          :page="currentPageInformation"
          :limit="pageSizeInformation"
          :total="totalInformation"
          :page-size-options="pageSizeInformationOptions"
          :total-data="informationNotifications.length"
          @pagination="onChangePageInformation"
          class="m-t-25"
        >
        </Pagination>
      </div>

      <div class="card table-notification-list">
        <div class="title-card">{{ $t('top.table.request_notification_list.title') }}</div>

        <table-notification-list :table-data="requestNotifications" :columns="columnsRequest" />

        <Pagination
          :page="currentPageRequest"
          :limit="pageSizeRequest"
          :total="totalRequest"
          :page-size-options="pageSizeRequestOptions"
          :total-data="requestNotifications.length"
          @pagination="onChangePageRequest"
          class="m-t-25"
        >
        </Pagination>
      </div>

      <!--      <div class="table-notification-list tags">-->
      <!--        <tag-notification></tag-notification>-->
      <!--      </div>-->

      <div class="card table-notification-list">
        <div class="title-card">{{ $t('top.other.title') }}</div>
        <div>
          <div class="card-item">
            <div class="icon-other">
              <Phone></Phone>
            </div>
            <div class="content-other">
              <div class="title-content">
                <span>{{ $t('top.other.inquiry.title') }}</span>
              </div>
              <span class="sub-content">{{ $t('top.other.inquiry.content') }}</span>
            </div>
          </div>

          <div class="card-item" @click="onFaqRedirection">
            <div class="icon-other faq">
              <FAQ></FAQ>
            </div>
            <div class="content-other">
              <div class="title-content">
                <span>{{ $t('top.other.faq.title') }}</span>
              </div>
              <span class="sub-content">{{ $t('top.other.faq.content') }}</span>
            </div>
          </div>

          <div class="card-item" @click="onFaqCodeRedirection">
            <div class="icon-other faq">
              <FAQ></FAQ>
            </div>
            <div class="content-other">
              <div class="title-content">
                <span>{{ $t('top.other.faqCode.title') }}</span>
              </div>
              <span class="sub-content">{{ $t('top.other.faqCode.content') }}</span>
            </div>
          </div>

          <div class="card-item">
            <div class="icon-other">
              <Folder></Folder>
            </div>
            <div class="content-other">
              <div class="title-content">
                <span>{{ $t('top.other.share_file.title') }}</span>
              </div>
              <span class="sub-content">{{ $t('top.other.share_file.content') }}</span>
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

.center {
  align-items: center;
  margin: 0 auto;
  margin-top: 35px !important;
  max-width: 1120px;
  min-width: 560px;
}

.card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
    0 1px 5px rgba(0, 0, 0, 0.12);
}

.table-notification-list {
  padding: 25px 40px 34px 30px;
  margin-top: 30px;
  border-radius: 8px;
  gap: 20px;
  background-color: #fff;
  display: flow-root;
}

@media screen and (max-width: 1440px) {
  .left-btn-back {
    left: 20px !important;
  }
}
</style>
