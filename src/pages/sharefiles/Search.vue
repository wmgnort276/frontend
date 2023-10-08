<script setup lang="ts">
import { t } from '@/plugins/i18n';
import type { SelectProps } from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';
import CustomInput from '@/components/common/CustomInput.vue';
import BackToTop from '@/components/common/button/BackToTop.vue';
import LeftOutlined from '@/components/icon/LeftOutlined.vue';
import type { FormInstance } from 'ant-design-vue';
import type { SearchForm } from '@/types/interfaces/sharefile';
import { useShareFileSearchStore } from '@/stores/shareFileSearch.store'
import PageLayout from '@/pages/layouts/PageLayout.vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import router from '@/router';
import { useAuthStoreHook } from '@/stores/auth.store';
import { USER_TYPE } from '@/stores/constants/constant';
import { message } from 'ant-design-vue';

const { authUser } = useAuthStoreHook();

const store = useShareFileSearchStore();

const isLoading = ref<boolean>(false);

const xsSizeLeft = ref<number>(18);
const xsSizeRight = ref<number>(23);

const smSizeLeft = ref<number>(5);
const smSizeRight = ref<number>(12);

const mdSizeLeft = ref<number>(5);
const mdSizeRight = ref<number>(12);

const formRef = ref<FormInstance>();

const canEdit = ref<boolean>(false);
const canView = ref<boolean>(true);

const columns = [
  { title: 'No', key: 'fileNumber', width: '170px' },
  {
    title: t('sharefile.searchTable.department'),
    key: 'department',
    minWidth: '200px'
  },
  {
    title: t('sharefile.searchTable.business'),
    key: 'business',
    minWidth: '150px'
  },
  {
    title: t('sharefile.searchTable.title'),
    key: 'title',
    ellipsis: true,
    minWidth: '200px'
  },
  {
    title: t('sharefile.searchTable.status'),
    key: 'status',
    ellipsis: true,
    width: '150px'
  },
  {
    title: t('sharefile.searchTable.endDay'),
    key: 'updatedAt',
    ellipsis: true,
    minWidth: '150px'
  },
  {
    title: t('sharefile.searchTable.updatePerson'),
    key: 'updatedBy',
    ellipsis: true,
    minWidth: '150px'
  }
];

onMounted(async () => {

  isLoading.value = true;
  clearSearch();
  if (authUser != undefined) {
    if (authUser.UserType == USER_TYPE.MANAGER || authUser.UserType == USER_TYPE.SYSTEM_ADMIN) {

      let userFunctions = authUser?.functions;

      let userFunctionsShareFile = userFunctions?.filter((item) => {
        return item.functionCode == "SHARE-FILE";
      });

      if (userFunctionsShareFile?.length == 0) {
        canView.value = false;
      }

      if(userFunctionsShareFile.filter((item)=>{
          return item.flag == "2"
      }).length > 0){
        canView.value = false;
      }

      if (canView.value == false) {
        message.error(t('faq-detail.user_not_permission'));
        await router.push('/top');
      }

      if(userFunctionsShareFile.filter((item)=>{
          return item.flag == "0"
      }).length > 0){
        canEdit.value = true;
      }

      if(authUser.UserType == USER_TYPE.MANAGER && authUser.IsAuthority == "True"){
        canEdit.value = false;
      }

    } else {
      message.error(t('faq-detail.user_not_permission'));
      await router.push('/top');
    }
  }

  await store.getBusinessData();
  await store.searchShareFileData();

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  isLoading.value = false;
});

const handleSearch = async () => {

  isLoading.value = true;

  await store.searchShareFileData();

  isLoading.value = false;
};

const onChangePageRequest = async (onChange: any) => {
  isLoading.value = true;

  store.tableData.currentPage = onChange.page;
  store.tableData.pageSize = onChange.limit;

  await store.searchShareFileData();

  isLoading.value = false;
};

const clearSearch = () => {
  store.clearSearchData();
};

const navigatorBack = () => {
  clearSearch();
  router.push('/top');
};

const clickSharefile = (shareFileNumber: any) => {
  clearSearch();
  router.push(`/sharefiles/detail?shareFileNumber=${shareFileNumber}`);
};

const hanldeRouteToCreate = () => {
  // /sharefiles/create
  router.push({
    path: "/sharefiles/create"
  })
}

</script>

<template>
  <page-layout :is-loading="isLoading">
    <div class="main-page">
      <div class="navigation">
        <a-button type="text" class="return-button" @click="navigatorBack">
          <LeftOutlined />
          <div class="ml-21 d-inline-block">{{ $t('sharefile.backtoTop') }}</div>
        </a-button>

        <div class="page-nav">
          <a-button type="primary" class="btn-common btn-rounned" v-if="canEdit" @click="hanldeRouteToCreate">
            {{ $t('sharefile.button.signup') }}
          </a-button>
        </div>
      </div>

      <div class="page-title main-title">{{ $t('sharefile.pageTitle') }}</div>

      <a-form ref="formRef" :model="store.formState">
        <!-- Title block -->
        <div class="card title-section">
          <div class="section-header">{{ $t('sharefile.titleBlock.search-share-file') }}</div>

          <!-- Upadte infomation -->
          <a-row class="align-items-center">
            <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft">
              <div class="title">
                {{ $t('sharefile.search.department') }}
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-row>
                <a-form-item>
                  <a-input v-model:value="store.formState.department" size="large"
                    :placeholder="$t('sharefile.search.placeHolder.department')">
                  </a-input>
                </a-form-item>
              </a-row>
            </a-col>
          </a-row>

          <!-- business -->
          <a-row class="align-items-center">
            <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft">
              <div class="title">
                {{ $t('sharefile.category.business-division') }}
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-row>
                <a-form-item>
                  <a-select show-search v-model:value="store.formState.businessCode" size="large" optionFilterProp="businessName"
                    :options="store.businesses" :fieldNames="{
                      value: 'businessCode',
                      label: 'businessName'
                    }" :placeholder="$t('sharefile.search.placeHolder.business')">
                  </a-select>
                </a-form-item>
              </a-row>
            </a-col>
          </a-row>

          <!-- title  -->
          <a-row>
            <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft">
              <div class="title">
                {{ $t('sharefile.category.title') }}
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-row>
                <a-form-item>
                  <a-input v-model:value="store.formState.title" size="large"
                    :placeholder="$t('sharefile.search.placeHolder.title')">
                  </a-input>
                </a-form-item>
              </a-row>
            </a-col>
          </a-row>

          <!-- File description -->
          <a-row>
            <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft">
              <div class="title">
                {{ $t('sharefile.category.file-description') }}
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-row>
                <a-form-item>
                  <a-input size="large" :placeholder="$t('sharefile.search.placeHolder.description')"
                    v-model:value="store.formState.description" />
                </a-form-item>
              </a-row>
            </a-col>
          </a-row>

          <!-- Request checkbox -->
          <a-row>
            <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft">
              <div class="title">
                {{ $t('sharefile.search.request') }}
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-form-item>
                <a-checkbox class="request-checkbox" v-model:checked="store.formState.scrutinyRequest">{{
                  $t('sharefile.search.requestTitle')
                }}</a-checkbox>
              </a-form-item>
            </a-col>

            <!-- Button group -->
            <a-col :md="6" :sm="4" :xs="3" class="btn-group">
              <a-button class="btn-common btn-rounned btn-clear" @click="clearSearch">
                {{ $t('sharefile.button.clear') }}
              </a-button>

              <a-button type="primary" class="btn-common btn-rounned" @click="handleSearch">
                {{ $t('sharefile.button.search') }}
              </a-button>
            </a-col>
          </a-row>
        </div>

        <!-- Search result list -->
        <div class="card search-result-section">
          <div class="section-header">{{ $t('sharefile.searchResult') }}</div>
          <a-col class="container font">
            <Pagination :page="store.tableData.currentPage" :limit="store.tableData.pageSize"
              :total="store.tableData.totalItem" :page-size-options="store.tableData.pageSizeOptions"
              :total-data="store.tableData.data.length" @pagination="onChangePageRequest" class="m-t-10">
            </Pagination>

            <a-table class="ant-table-striped table-sharefile" size="middle" :columns="columns"
              :data-source="store.tableData.data"
              :row-class-name="(_record: any, index: any) => (index % 2 === 1 ? 'table-striped' : null)">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'fileNumber'">
                  <div>
                    <span class="table-data">{{ record.fileNumber }}</span>
                  </div>
                </template>

                <template v-if="column.key === 'department'">
                  <span class="table-data">
                    {{ record.department }}
                  </span>
                </template>

                <template v-if="column.key === 'business'">
                  <span class="table-data">
                    {{ record.businessName }}
                  </span>
                </template>

                <template v-if="column.key === 'title'">
                  <a @click="clickSharefile(record.fileNumber)" class="title-column table-data">{{
                    record.title
                  }}</a>
                </template>

                <template v-if="column.key === 'status'">
                  <span class="table-data">
                    {{ record.status }}
                  </span>
                </template>

                <template v-if="column.key === 'updatedAt'">
                  <span class="table-data">
                    {{ dayjs(record.updatedAt).format('YYYY/MM/DD') }}
                  </span>
                </template>

                <template v-if="column.key === 'updatedBy'">
                  <span class="table-data">
                    {{ record.updatedBy }}
                  </span>
                </template>
              </template>
            </a-table>
          </a-col>
        </div>
      </a-form>
    </div>
  </page-layout>
</template>

<style scoped>
@import './../../assets/styles/common.css';
@import './../../assets/styles/page.css';
@import './../../assets/styles/button.css';


.main-page {
  max-width: 1120px;
  margin: auto;
}

.btn-return-top {
  color: #37474f;
  font-size: 24px;
  padding-left: 0;
}

.btn-clear {
  background-color: #eceff1;
  color: #1976d2;
  border: 1px solid #1976d2;
}

.page-top {
  padding-right: 0;
}

.main-title {
  margin: 35px 0px !important;
}

.align-items-center {
  align-items: center;
}

.font {
  color: rgba(55, 71, 79, 0.87);
  letter-spacing: 0.25px;
  font-size: 16px;
  font-weight: 500;
}

.ant-table-striped :deep(.table-striped) td {
  background-color: #eceff1;
}

.title-column {
  text-decoration: underline;
}

.page-title {
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 40px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.87);
  margin: 10px 0px;
}

.card> ::v-deep(.ant-row) {
  margin-bottom: 10px;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  padding: 50px;
  margin-bottom: 20px;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14),
    0px 1px 5px rgba(0, 0, 0, 0.12);
}

.section-header {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.87);
  margin-bottom: 30px;
}

.title {
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.95);
}

.card ::v-deep(.ant-form-item) {
  width: 100%;
  margin: 0;
}

.card ::v-deep(.ant-input-number-lg) {
  border-radius: 5px;
  overflow: hidden;
}

::v-deep(.ant-table-pagination.ant-pagination) {
  display: none;
}

::v-deep(.ant-table-thead > tr > th) {
  background-color: #cfd8dc;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  padding: 10px 16px !important;
  color: #37474f;
}

::v-deep(.ant-table-tbody > tr > td) {
  padding: 10px 16px !important;
}

::v-deep(.ant-table-thead > tr > th:last-child) {
  text-align: center;
}

::v-deep(.ant-table-tbody > tr > td:last-child) {
  text-align: center;
  padding: 10px 16px !important;
}

.btn-group {
  display: flex;
  gap: 10px;
  margin-left: 30px;
}

.request-checkbox {
  font-weight: 400;
  font-size: 18px;
  line-height: 32px;
}

.card ::v-deep(.ant-input) {
  border-radius: 5px;
}

.card ::v-deep(.ant-select-selector) {
  border-radius: 5px;
}

.table-data {
  font-size: 16px;
}

::v-deep(.table-sharefile .ant-table-cell::before) {
  content: none !important;
}

::v-deep(.table-sharefile td:last-child) {
  text-align: left !important;
}

::v-deep(.table-sharefile th:last-child) {
  text-align: left !important;
}

::v-deep(.ant-checkbox-wrapper .ant-checkbox-inner) {
  border-color: rgba(55, 71, 79, 0.9);
}
</style>
