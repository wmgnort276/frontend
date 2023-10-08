<script setup lang="ts">
import Upload from '@/components/common/Upload.vue';
import LeftOutlined from '@/components/icon/LeftOutlined.vue';
import { computed, ref, onMounted, onBeforeMount } from 'vue';
import { bulkUploadFaq, bulkUploadPreview, getFileAttachmentList } from '@/api/file.api';
import { message } from 'ant-design-vue';
import PageLayout from '@/pages/layouts/PageLayout.vue';
import router from '@/router';
import { t } from '@/plugins/i18n';
import { ImportStore } from '@/stores/import.store';
import { useAuthStoreHook, useAuthStore } from '@/stores/auth.store';
import Paging from '@/components/common/pagination/Paging.vue';

import { useFaqSearchStore } from '@/stores/faqSearch.store';
import { BREAD_CRUMB_TYPE, END_YEAR_FLAG_VALUE, DATE_FORMAT } from '@/stores/constants/constant';

import type { FaqBreadCrumb } from '@/types/interfaces/faq';
import ArrowRightSmall from '@/components/icon/ArrowRightSmall.vue';
import ConfirmDialog from '@/components/common/dialog/ConfirmDialog.vue';

const searchStore = useFaqSearchStore();

const canEdit = ref<boolean>(false);
const { authUser } = useAuthStoreHook();

const loading = ref<boolean>(false);
const isDataErrors = ref<boolean>(false);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const dataErrors = ref<any[]>([]);
const dataPagination = ref<any[]>([]);
const listFileAttachment = ref<any[]>([]);
const store = ImportStore();
const storeFaq = useFaqSearchStore();
let confirmPopup = ref<boolean>(false);

const columnsTableErrors = [
  {
    title: t('faq.upload.rowIndex'),
    key: 'rowIndex',
    width: '150px'
  },
  {
    title: t('faq.upload.listMessageErrors'),
    key: 'messages'
  }
];

const faqBreadCrumbs = ref<FaqBreadCrumb[]>([]);

const userStore = useAuthStore();

onMounted(async () => {

  let isEditFaqNormal = userStore.isEditFaqNormal();
  let isEditFaqEndYear = userStore.isEditFaqEndYear();
  let isManager = userStore.isManagerUser();

  canEdit.value = isManager && (isEditFaqNormal || isEditFaqEndYear);

  if (!canEdit.value) {
    message.error(t('faq-detail.user_not_permission'));
    return router.push('/top');
  }

  loading.value = true;

  await Promise.all([fileAttachmentList(), getBreadCrumbs()]);

  loading.value = false;
});

const isUploadFileOrPreview = computed(() => {
  return !store.fileImportFaq.length;
});

const clearForm = async () => {
  store.fileImportFaq = [];
  store.fileAttachment = [];
};

const closePopupDataErrors = () => {
  currentPage.value = 1;
  dataPagination.value = [];
  dataErrors.value = [];
  isDataErrors.value = false;
};

const onChangePage = (value: any) => {
  currentPage.value = value;
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  dataPagination.value = dataErrors.value.slice(startIndex, endIndex);
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const fileAttachmentList = async () => {
  await getFileAttachmentList()
    .then((res: any) => {
      listFileAttachment.value = res.data;
    })
    .catch((error: any) => {
      if (error.response.status === 403) {
        message.error(error.response.data);
        clearForm();
        return router.push('/login-menu');
      }
      Promise.reject(error);
    });
};

const uploadFileFaq = async () => {
  if (store.fileImportFaq.length > 1 || store.fileImportFaq.length === 0) {
    message.error(t('faq.upload.messageErrorUploadFaq'));
  } else {
    loading.value = true;
    const isFileError = checkTypeFileError();
    if (isFileError) {
      loading.value = false;
      return;
    }

    const formData = handleAddFilesIntoForm();

    if (formData) {
      await bulkUploadFaq(formData)
        .then((res: any) => {
          if (res.status) {
            if (res.data.dataErrors && res.data.dataErrors.length) {
              isDataErrors.value = true;
              currentPage.value = 1;
              dataPagination.value = [];
              dataErrors.value = res.data.dataErrors;
            } else {
              message.success(res.message);
              store.dataCreateFaqQuestions = res.data.dataCreateFaqQuestions;
              store.dataImport = res.data.dataCreateFaqQuestions;
              store.isImportPreview = false;
              store.isImportSuccess = true;
              store.fileImportFaq = [];
              store.fileAttachment = [];

              router.push('/faq/preview-upload');
            }
          }
        })
        .catch((err: any) => {
          if (err.response.data && err.response.data.message) {
            message.error(err.response.data.message);
          } else {
            message.error(err.response.data);
          }
          if (err.response.data.statusCode == 403) {
            clearForm();
            router.push('/top');
          }
          Promise.reject(err);
        });
    }

    loading.value = false;
  }
};

const checkTypeFileError = () => {
  let isError = false;
  store.fileImportFaq.forEach((file: any) => {
    const fileName = file.name;
    const fileType = fileName.split('.');
    if (listFileAttachment.value.includes(fileType[fileType.length - 1])) {
      message.error(`${fileName} file upload is not supported`);
      isError = true;
    }
  });

  store.fileAttachment.forEach((attachment: any) => {
    const fileName = attachment.name;
    const fileType = fileName.split('.');
    if (listFileAttachment.value.includes(fileType[fileType.length - 1])) {
      message.error(`${fileName} file upload is not supported`);
      isError = true;
    }
  });

  return isError;
};

const handleAddFilesIntoForm = () => {
  let isError = false;
  const formData = new FormData();

  store.fileImportFaq.forEach((file: any) => {
    const typeFile = ['xlsx', 'xls'];
    const fileName = file.name.split('.');

    if (!typeFile.includes(fileName[fileName.length - 1])) {
      message.error(t('File upload is not supported'));
      isError = true;
    }
    formData.append('files', file['originFileObj']);
  });

  store.fileAttachment.forEach((attachment: any) => {
    formData.append('files', attachment['originFileObj']);
  });

  if (isError) {
    return false;
  }
  return formData;
};

const previewFileImport = async () => {
  if (store.fileImportFaq.length > 1 || store.fileImportFaq.length === 0) {
    message.error(t('faq.upload.messageErrorUploadFaq'));
  } else {
    loading.value = true;
    const isFileError = checkTypeFileError();
    if (isFileError) {
      loading.value = false;
      return;
    }

    const formData = handleAddFilesIntoForm();

    if (formData) {
      await bulkUploadPreview(formData)
        .then((res: any) => {
          if (res.status) {
            if (res.data.dataErrors && res.data.dataErrors.length) {
              isDataErrors.value = true;
              currentPage.value = 1;
              dataPagination.value = [];
              dataErrors.value = res.data.dataErrors;
            } else {
              message.success(res.message);
              store.dataCreateFaqQuestions = res.data.dataCreateFaqQuestions;
              store.dataImport = res.data.dataCreateFaqQuestions;
              store.isImportPreview = true;
              store.isImportSuccess = false;

              router.push('/faq/preview-upload');
            }
          }
        })
        .catch((err: any) => {
          if (err.response.data && err.response.data.message) {
            message.error(err.response.data.message);
          } else {
            message.error(err.response.data);
          }
          if (err.response.data.statusCode == 403) {
            clearForm();
            router.push('/top');
          }
          Promise.reject(err);
        });
    }

    loading.value = false;
  }
};

const getBreadCrumbs = async () => {
  faqBreadCrumbs.value = [];

  faqBreadCrumbs.value.push({
    type: BREAD_CRUMB_TYPE.TOP,
    code: '',
    name: t('common.breadcrumbs.top'),
    class: ''
  });

  let isEditFaqNormal = userStore.isEditFaqNormal();
  let isEditFaqEndYear = userStore.isEditFaqEndYear();

  if (searchStore.formState.isFaqCode || (!isEditFaqNormal && isEditFaqEndYear)) {
    faqBreadCrumbs.value.push({
      type: BREAD_CRUMB_TYPE.TOP_FAQ_END_YEAR,
      code: '',
      name: t('common.breadcrumbs.top-faq-end-year'),
      class: ''
    });
  } else {
    faqBreadCrumbs.value.push({
      type: BREAD_CRUMB_TYPE.TOP_FAQ,
      code: '',
      name: t('common.breadcrumbs.top-faq'),
      class: ''
    });
  }

  faqBreadCrumbs.value.push({
    type: '',
    code: '',
    name: t('faq.upload.title.bulkCreate'),
    class: ''
  });
};

const checkEmpty = () => {
  return store.fileImportFaq.length == 0 && store.fileAttachment.length == 0;
}

const currentBreadcrumb = ref<FaqBreadCrumb>();

const handlerClickBreadCrumb = async (item: FaqBreadCrumb, index: Number) => {
  if (index == faqBreadCrumbs.value.length - 1) {
    return;
  }
  currentBreadcrumb.value = item;
  if (!checkEmpty()) {
    confirmPopup.value = true;
  } else {
    await handlerClickBreadCrumbAction();
  }
};

const handlerClickBreadCrumbAction = async () => {
  await clearForm();

  if (currentBreadcrumb.value?.type == BREAD_CRUMB_TYPE.TOP) {
    searchStore.clearData();
    router.push('/top');
  } else if (currentBreadcrumb.value?.type == BREAD_CRUMB_TYPE.TOP_FAQ) {
    searchStore.clearData();
    router.push({
      path: '/faq/search/',
      query: {
        companyGroupCode: searchStore.formState.companyGroupCode,
        faqCode: searchStore.formState.faqCode,
        isFaqCode: searchStore.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: searchStore.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE)
      }
    });
  } else if (currentBreadcrumb.value?.type == BREAD_CRUMB_TYPE.TOP_FAQ_END_YEAR) {
    router.push({
      path: '/faq/search/',
      query: {
        companyGroupCode: searchStore.formState.companyGroupCode,
        faqCode: searchStore.formState.faqCode,
        isFaqCode: searchStore.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: searchStore.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE)
      }
    });
  } else if (currentBreadcrumb.value?.type == BREAD_CRUMB_TYPE.BUSINESS) {
    router.push({
      path: '/faq/search-category/',
      query: {
        companyGroupCode: searchStore.formState.companyGroupCode,
        faqCode: searchStore.formState.faqCode,
        isFaqCode: searchStore.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: searchStore.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
        businessCode: currentBreadcrumb.value?.code
      }
    });
  } else if (currentBreadcrumb.value?.type == BREAD_CRUMB_TYPE.CATEGORY) {
    router.push({
      path: '/faq/search-category/',
      query: {
        companyGroupCode: searchStore.formState.companyGroupCode,
        faqCode: searchStore.formState.faqCode,
        isFaqCode: searchStore.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: searchStore.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
        faqCategory: currentBreadcrumb.value?.code
      }
    });
  }
}
</script>
<template class="font">
  <page-layout :is-loading="loading">
    <div class="main-page">
      <div class="navigation">
        <div class="navigation-breadcrumb">
          <div class="feature-keyword-item" v-for="(item, index) in faqBreadCrumbs" key="index">
            <span :class="{ current: faqBreadCrumbs.length - 1 == index, first: index == 0 }"
              @click="handlerClickBreadCrumb(item, index)">
              {{ item.name }}
            </span>
            <span class="item-space">
              <ArrowRightSmall v-if="faqBreadCrumbs.length - 1 != index"></ArrowRightSmall>
            </span>
          </div>
        </div>
        <div class="navigation-btn-group">
          <router-link to="">
            <a-button type="default" class="btn-common btn-rounned btn-default btn-clear" @click="store.fileImportFaq = []">
              {{ $t('common.page.button.clear') }}
            </a-button>
          </router-link>

          <router-link to="">
            <a-button class="btn-common btn-rounned btn-preview" :disabled="isUploadFileOrPreview" :class="{
              'btn-primary btn-text': !isUploadFileOrPreview,
              'btn-disable btn-rounned': isUploadFileOrPreview
            }" @click="previewFileImport">
              {{ $t('common.page.button.preview') }}
            </a-button>
          </router-link>

          <router-link to="">
            <a-button class="btn-common btn-rounned btn-upload" @click="uploadFileFaq" :disabled="isUploadFileOrPreview"
              :class="{
                'btn-primary btn-text': !isUploadFileOrPreview,
                'btn-disable btn-rounned': isUploadFileOrPreview
              }">
              {{ $t('faq.upload.button.createFQA') }}
            </a-button>
          </router-link>
        </div>
      </div>
      <div class="panel-box padding-small panel-box-import">
        <div class="title text-primary p-l-10">{{ $t('faq.upload.title.bulkCreate') }}</div>
        <div class="ml-25">
          <a-row type="flex" class="my-20">
            <a-col flex="200px" class="fs-20 text-gray-01 d-flex">
              <div class="fs-20">{{ $t('faq.upload.label.faqFile') }}</div>
              <div class="bagde bagde-error ml-2 m-t-5">
                {{ $t('faq.upload.label.require') }}
              </div>
            </a-col>
            <a-col flex="auto" class="m-r-85">
              <Upload :is-show-download-btn="false" :multiple="false" :attachment-list="listFileAttachment"
                v-model:files="store.fileImportFaq" />
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col flex="200px">
              <span class="fs-20">
                {{ $t('faq.upload.label.attachFile') }}
              </span></a-col>
            <a-col flex="auto" class="m-r-85">
              <Upload :is-show-download-btn="false" :attachment-list="listFileAttachment"
                v-model:files="store.fileAttachment" />
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
    <a-modal v-if="dataErrors.length" :visible="isDataErrors" centered :footer="null" :closable="false"
      style="width: 1120px">
      <div class="main-page bulk-upload-errors">
        <div class="card p-15">
          <div class="history-table">
            <a-table :columns="columnsTableErrors" :data-source="dataPagination.length ? dataPagination : dataErrors"
              :scroll="{ y: 500 }" :pagination="{ pageSize: 10 }">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'rowIndex'">
                  <span class="table-data fs-16">
                    {{ record.rowIndex }}
                  </span>
                </template>

                <template v-else-if="column.key === 'messages'">
                  <p v-for="(item, index) in record.messages" :key="index" class="table-data fs-16 m-b-5">
                    {{ item }}
                  </p>
                </template>
              </template>
            </a-table>
          </div>
        </div>
        <div class="pagination">
          <Paging :current-page="currentPage" :total="dataErrors.length" :page-size="pageSize"
            @change-page="onChangePage">
          </Paging>
        </div>
        <div class="close-btn">
          <a-button type="primary" class="btn-common btn-rounned" @click="closePopupDataErrors">
            {{ $t('faq.upload.button.close') }}
          </a-button>
        </div>
      </div>
    </a-modal>
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
@import './../../assets/styles/button.css';
@import './../../assets/styles/page.css';

.content {
  background-color: #fff;
  width: 100%;
  border-radius: 8px;
  padding: 30px 25px 50px 25px;
  margin-top: 25px;
}

.h-85 {
  height: 85%;
}

.title {
  font-weight: 600;
  font-size: 28px;
  line-height: 44.8px;
  padding-left: 15px;
  color: #007f99;
}

.text-item {
  display: inline-block;
}

.m-r-85 {
  margin-right: 85px;
}

.require-label {
  border-radius: 36px;
  padding: 0 16px;
}

.pagination {
  display: flex;
  justify-content: center;
  /* margin-top: 15px; */
}

.close-btn {
  align-items: center;
  justify-content: center;
  display: flex;
  margin-top: 15px;
}

::v-deep(.ant-table-thead > tr > th) {
  background-color: #cfd8dc;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  padding: 10px 16px !important;
  color: #37474f;
}

::v-deep(.ant-table-pagination.ant-pagination) {
  display: none;
}

.bulk-upload-errors {
  height: 85%;
}

.bulk-upload-errors .card {
  padding: 0;
  height: 100%;
}

.btn-preview {
  width: 145px;
}

.btn-clear {
  width: 103px;
}

.btn-upload {
  width: 82px;
}

.panel-box-import {
  padding-top: 30px !important;
  padding-bottom: 50px !important;
  border-radius: 8px;
}
</style>
