<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { LeftOutlined } from '@ant-design/icons-vue';
import { t } from '@/plugins/i18n';
import { ref } from 'vue';
import { ImportStore } from '@/stores/import.store';
import type { DataImport } from '@/types/interfaces/faq';
import table from '@/stores/mixins/table';
import router from '@/router';
import { useAuthStoreHook, useAuthStore } from '@/stores/auth.store';
import { message } from 'ant-design-vue';
import Paging from '@/components/common/pagination/Paging.vue';
import PageLayout from '@/pages/layouts/PageLayout.vue';
import { useFaqSearchStore } from '@/stores/faqSearch.store';

import {
  BREAD_CRUMB_TYPE,
  END_YEAR_FLAG_VALUE,
  DATE_FORMAT,
} from '@/stores/constants/constant';

import type {
  FaqBreadCrumb
} from '@/types/interfaces/faq';

const canEdit = ref<boolean>(false);
const { authUser } = useAuthStoreHook();

const isLoading = ref<boolean>(true);



const columns = [
  { title: 'FAQ No.', key: 'faqId', width: '150px' },
  {
    title: t('faq.upload.preview.table.category'),
    key: 'business',
    width: '200px'
  },
  {
    title: t('faq.upload.preview.table.period'),
    key: 'period',
    width: '220px'
  },
  {
    title: t('faq.upload.preview.table.content'),
    key: 'content',
    ellipsis: true,
    minWidth: '100px'
  },
  { title: t('faq.upload.preview.table.order'), key: 'order', width: '100px' }
];

export default defineComponent({
  components: {
    Paging,
    LeftOutlined
  },
  computed: {
    table() {
      return table;
    }
  },
  setup() {
    const data = ref<DataImport[]>(ImportStore().dataImport);
    const isImportSuccess = ImportStore().isImportSuccess;
    const isImportPreview = ImportStore().isImportPreview;
    const storeFaq = useFaqSearchStore();
    const dataPagination = ref<DataImport[]>([]);
    const currentPage = ref(1);

    const pageSizeRef = ref(10);
    const pageSizeOptions = ref<number[]>([10, 30, 50]);
    const store = useFaqSearchStore();
    const faqBreadCrumbs = ref<FaqBreadCrumb[]>([]);
    const userStore = useAuthStore();

    onMounted(async () => {

      let isEditFaqNormal = userStore.isEditFaqNormal();
      let isEditFaqEndYear = userStore.isEditFaqEndYear();
      let isManager = userStore.isManagerUser();

      let canEdit = isManager && (isEditFaqNormal || isEditFaqEndYear);

      if (!canEdit) {
        message.error(t('faq-detail.user_not_permission'));
        await router.push('/top');
        return;
      }

      if (!data.value.length) {
        router.push('/faq/upload');
        return;
      }

      getBreadCrumbs();

    });

    function handleChange(page: number) {
      currentPage.value = page;
      const startIndex = (currentPage.value - 1) * pageSizeRef.value;
      const endIndex = startIndex + pageSizeRef.value;
      dataPagination.value = data.value.slice(startIndex, endIndex);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    function handleClickedBack() {
      let isEditFaqNormal = userStore.isEditFaqNormal();
      let isEditFaqEndYear = userStore.isEditFaqEndYear();

      if (store.formState.isFaqCode || (!isEditFaqNormal && isEditFaqEndYear)) {
        router.push('/faq/search?isFaqCode=1');
      } else {
        router.push('/faq/search');
      }
    }

    function handlerClickBreadCrumb(item: FaqBreadCrumb, index: Number) {
      if (index == faqBreadCrumbs.value.length - 1) {
        return;
      }

      if (item.type == BREAD_CRUMB_TYPE.TOP) {
        storeFaq.clearData();
        router.push('/top');
      } else if (item.type == BREAD_CRUMB_TYPE.BULK_UPLOAD) {
        router.push('/faq/upload')
      }
      else {
        storeFaq.clearData();
        router.push({
          path: '/faq/search/',
          query: {
            companyGroupCode: storeFaq.formState.companyGroupCode,
            faqCode: storeFaq.formState.faqCode,
            isFaqCode: storeFaq.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
            searchDate: storeFaq.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE)
          }
        });
      }
    }

    function getNote(total: number) {
      if (isImportSuccess) {
        return `${total} ${t('faq.upload.label.importSuccessFAQ')}`;
      }
      return `${total} ${t('faq.upload.label.previewFAQ')}`;
    }

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

      faqBreadCrumbs.value.push({
        type: BREAD_CRUMB_TYPE.BULK_UPLOAD,
        code: "",
        name: t("faq.upload.breadCrumb"),
        class: ''
      });

      if (!isImportSuccess) {
        faqBreadCrumbs.value.push({
          type: '',
          code: "",
          name: t("faq.upload.preview.breadCrumb"),
          class: ''
        });
      } else {
        faqBreadCrumbs.value.push({
          type: '',
          code: "",
          name: t("faq.upload.preview.breadCrumbSuccess"),
          class: ''
        });
      }

    };


    return {
      data,
      dataPagination,
      columns,
      currentPage,
      pageSizeRef,
      pageSizeOptions,
      isImportSuccess,
      isImportPreview,
      faqBreadCrumbs,
      handleChange,
      getNote,
      handlerClickBreadCrumb,
      handleClickedBack
    };
  }
});
</script>
<template class="font">
  <page-layout>
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
      <div class="content-wrapper">
        <div class="page-top page-top-import">
          <div class="page-title button-back">

            <a-button type="link" class="btn-nav-back" v-if="isImportSuccess" @click="handleClickedBack()">
              <LeftOutlined />
              <div class="ml-21 d-inline-block">
                {{ $t('faq.upload.button.backToSearch') }}
              </div>
            </a-button>

            <router-link v-if="isImportPreview" to="upload">
              <a-button type="link" class="btn-nav-back">
                <LeftOutlined />
                <div class="ml-21 d-inline-block">
                  {{ $t('faq.upload.button.previewImportBackToUpload') }}
                </div>
              </a-button>
            </router-link>
          </div>
        </div>
        <div class="panel-box padding-small panel-box-upload">
          <div v-if="isImportSuccess" class="title text-primary">
            {{ $t('faq.upload.title.bulkImportResult') }}
          </div>

          <div v-if="isImportPreview" class="title text-primary">
            {{ $t('faq.upload.title.previewBulkCreate') }}
          </div>
          <div class="note text-gray-01">
            {{ getNote(data.length) }}
          </div>
          <a-table class="table-striped" size="middle" :columns="columns"
            :data-source="dataPagination.length ? dataPagination : data" :pagination="{ pageSize: pageSizeRef }"
            :row-class-name="(_record: any, index: any) => (index % 2 === 1 ? 'table-striped' : null)">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'faqId'">
                <div>
                  <span class="color-table">{{ record.FaqNumber }}</span>
                </div>
              </template>

              <template v-else-if="column.key === 'business'">
                <span>
                  <a-tag class="category-tag">
                    {{ record.BusinessName }}
                  </a-tag>
                </span>
              </template>

              <template v-else-if="column.key === 'period'">
                <span class="color-table">
                  {{
                    table.formatDate(new Date(record.DisplayStartDate), 'YYYY/M/D') +
                    '~' +
                    table.formatDate(new Date(record.DisplayEndDate), 'YYYY/M/D')
                  }}
                </span>
              </template>

              <template v-else-if="column.key === 'content'">
                <span class="text-content color-table">{{ record.Content }}</span>
              </template>

              <template v-else-if="column.key === 'order'">
                <span class="color-table">
                  {{ record.SortOrder }}
                </span>
              </template>
            </template>
          </a-table>
          <div class="mt-20">
            <div class="pagination">
              <Paging :current-page="currentPage" :total="data.length" :page-size="pageSizeRef"
                @change-page="handleChange">
              </Paging>
            </div>
          </div>

        </div>


      </div>
    </div>
  </page-layout>
</template>
<style scoped>
@import './../../assets/styles/common.css';
@import './../../assets/styles/button.css';
@import './../../assets/styles/page.css';

.category-tag {
  background-color: #fff;
  color: #1976d2;
  border-color: #1976d2;
  border-radius: 15px;
  font-weight: 400;
  line-height: 20px;
  font-size: 16px;
  padding: 4px 10px;
}

.table-striped :deep(.table-striped) td {
  background-color: #eceff1;
  border: none !important;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}


.container {
  text-align: center;
}

.outer-wrapper {
  display: inline-block;
  margin-bottom: 50px;
}

.inner-wrapper {
  display: inline-block;
  text-align: left;
}

.title {
  font-weight: 700;
  font-size: 24px;
  line-height: 40px;
  padding-left: 15px;
  color: #007f99;
}

.text-content {
  font-weight: 500;
}

.color-table {
  color: rgba(0, 0, 0, 0.87);
}

.note {
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.25px;
  padding: 20px 0px 20px 15px;
}

.text-item-pagination {
  font-size: 14px;
  margin-right: 30px;
  padding: 8px;
}

::v-deep(.ant-table-thead > tr > th) {
  background-color: #cfd8dc;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  padding: 10px 16px !important;
  color: #37474f;
  height: 48px;
}

::v-deep(.ant-table-pagination.ant-pagination) {
  display: none;
}

::v-deep(.ant-table-cell) {
  padding: 7px 16px !important;
  border: none !important;
  font-size: 16px;
}

::v-deep(.ant-table.ant-table-bordered > .ant-table-container) {
  border: none !important;
}

.panel-box-upload {
  padding-top: 30px !important;
  padding-bottom: 20px !important;
  border-radius: 8px;
}

.page-top-import {
  height: 67px;
  margin-bottom: 18px;
}
</style>
