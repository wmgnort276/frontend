<script setup lang="ts">
import { t } from '@/plugins/i18n';
import type { SelectProps } from 'ant-design-vue';
import { onMounted, ref, computed, onBeforeMount } from 'vue';
import CustomInput from '@/components/common/CustomInput.vue';
import BackToTop from '@/components/common/button/BackToTop.vue';
import PageLayout from '../layouts/PageLayout.vue';
import RequiredTag from '@/components/common/RequiredTag.vue';
import Upload from '@/components/common/Upload.vue';
import LeftOutlined from '@/components/icon/LeftOutlined.vue';
import ShareFileHistory from './popup/ShareFileHistory.vue';
import Request from './popup/Request.vue';
import type { FormInstance } from 'ant-design-vue';
import type {
  Notifications,
  InformationNotifications,
  RequestNotifications
} from '@/types/interfaces/top';
import ConfirmPopup from '@/components/common/popup/ConfirmPopup.vue';
import AcceptRequest from './popup/AcceptRequest.vue';
import type { CreateForm } from '@/types/interfaces/sharefile';
import Pagination from '@/components/common/pagination/Pagination.vue';
import { useAuthStoreHook } from '@/stores/auth.store';
import { FAQ_CONDITION_TYPE, SHAREFILE_STATE_DRAF, USER_TYPE } from '@/stores/constants/constant';
import router from '@/router';
import { useShareFileCreateStore } from '@/stores/shareFileCreate.store';
import { checkPermissionShareFile, createShareFile } from '@/api/shareFile.api';
import { uploadFiles, uploadFilesMemory } from '@/api/file.api';
import { message } from 'ant-design-vue';
import ConfirmDialog from '@/components/common/dialog/ConfirmDialog.vue';
import type { Dialog, Popup } from '@/types/interfaces/faq';

let notifications: Notifications[];
// let shareFileCall: InformationNotifications[] = [];
let requestNotifications: RequestNotifications[] = [];

let isOpenHistoryPopup = ref<boolean>(false);
let isOpenRequestPopup = ref<boolean>(false);
let isOpenAcceptRequestPopup = ref<boolean>(false);
const { authUser } = useAuthStoreHook();
const isManager = ref<boolean>(false);
const isNotFaqUser = ref<boolean>(true);
const store = useShareFileCreateStore();
const loading = ref<boolean>(true);
const spinning = ref<boolean>(false);

const popup = ref<Popup>({
  confirmBack: false,
  confirmRegister: false,
  confirmClear: false,
  confirmDelete: false,
  confirmBackToTop: false,
});

const formState = ref<CreateForm>({
  department: null,
  business: null,
  companyGroup: null,
  memoShare: null,
  title: null,
  description: null,
  fileAttachments: []
});

const xsSizeLeft = ref<number>(18);
const xsSizeRight = ref<number>(23);

const smSizeLeft = ref<number>(8);
const smSizeRight = ref<number>(16);

const mdSizeLeft = ref<number>(8);
const mdSizeRight = ref<number>(16);

const formRef = ref<FormInstance>();

const handleCloseHistoryPopup = () => {
  isOpenHistoryPopup.value = false;
};

const handleCloseRequestPopup = () => {
  isOpenRequestPopup.value = false;
};

const handleCloseAcceptRequestPopup = () => {
  isOpenAcceptRequestPopup.value = false;
};

const checkValidateAll = async () => {
  try {
    await formRef.value?.validateFields();
    popup.value.confirmRegister = true;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const checkPermissionCreateSF = async () => {
  try {
    loading.value = true;
    const res: any = await checkPermissionShareFile();
    if (!res.status) {
      message.error(res.message);
      router.push(`/top`);
    }
    loading.value = false;
  } catch (error) {
    message.error("Error");
  }
}

const saveDraf = async () => {
  const formData = new FormData();

  store.formState.attachments.forEach((attachment) => {
    formData.append('files', attachment['originFileObj']);
  });

  loading.value = true;

  uploadFilesMemory(formData)
    .then((response: any) => {
      let count = 0;
      for (let index = 0; index < store.formState.attachments.length; index++) {
        store.formState.attachments[index]['fileId'] = response.data.listFileId[count];
        count++;
      }
      const param = {
        businessCode: store.formState.businessCode?.trim(),
        title: store.formState.title?.trim(),
        description: store.formState.description?.trim(),
        processStatus: SHAREFILE_STATE_DRAF,
        companyGroups: handleCompanyAndFaqCode(),
        note: store.formState.note?.trim(),
        department: store.formState.department?.trim(),
        fileAttachment: store.formState.attachments,
      };

      createShareFile(param)
        .then((response: any) => {
          clearData();
          message.success(t('sharefile.create.success'));
          router.push(`/sharefiles/edit?shareFileNumber=${response.data}`);
          loading.value = false;
        })
        .catch((error) => {
          if (error.response.status == 422) {
            message.error(t('sharefile.create.error'));
          } else {
            message.error(`${error.response.data.message}`);
          }
          loading.value = false;
          Promise.reject(error);
        });
    })
    .catch((error: any) => {
      // message.error(`${error.response.data.message}`);
      loading.value = false;
      message.error(t('sharefile.uploadFile.error'));
      Promise.reject(error);
    });
}

onMounted(async () => {
  if (authUser != undefined) {

    if ((authUser.UserType == USER_TYPE.MANAGER) || authUser.UserType == USER_TYPE.SYSTEM_ADMIN) {
      isManager.value = true;

      if (authUser.UserType == USER_TYPE.MANAGER && authUser.IsAuthority === "True") {
        isManager.value = false;
      }

    } else if (authUser.UserType == USER_TYPE.FAQ) {
      isNotFaqUser.value = false;
    }
  }

  await store.getBusinessData();

  if (isManager.value == true) {

  } else {
    console.log("🚀 ~ file: CreateShareFile.vue:176 ~ onMounted ~ isManager.value:", isManager.value)
    await router.push(`/top`);
  }

  loading.value = false;
});

const handleSelectBusiness = async () => {
  spinning.value = true;
  const param = {
    businessCode: store.formState.businessCode
  }
  store.formState.companyGroupCode = [];
  store.companiesAndFaqCodes = [];
  await store.getCompaniesAndFaqCodes(param);
  spinning.value = false;
};


const handleCompanyAndFaqCode = () => {
  let companiesAndFaqCodes: { name: string; code: string; type: number }[] = [];

  // Loop though list of CompaniesAndFaqCodes to add type of data
  store.formState.companyGroupCode.map((item: any) => {
    if (item !== FAQ_CONDITION_TYPE.IS_ALL_OPTION_CODE) {
      store.companiesAndFaqCodes.forEach((e) => {
        if (e.code === item) {
          companiesAndFaqCodes.push({
            code: e.code,
            type: e.type,
            name: e.name
          });
        }
      });
    }
  });
  return companiesAndFaqCodes;
};

const clearData = () => {
  formRef.value?.resetFields();
  store.formState.businessCode = null;
  store.formState.fileNumber = null;
  store.formState.department = null;
  store.formState.companyGroupCode = [];
  store.formState.note = null;
  store.formState.title = null;
  store.formState.description = null;
  store.formState.attachments = [];
};

onBeforeMount(async () => {
  loading.value = true;
  await checkPermissionCreateSF();
  if (authUser != undefined) {
    if (authUser.UserType == USER_TYPE.MANAGER || authUser.UserType == USER_TYPE.SYSTEM_ADMIN) {
      isManager.value = true;

      if (authUser.UserType == USER_TYPE.MANAGER && authUser.IsAuthority === "True") {
        isManager.value = false;
      }
    } else if (authUser.UserType == USER_TYPE.FAQ) {
      isNotFaqUser.value = false;
    }
  }
  if (isManager.value) {
    clearData();
  } else {
    router.push(`/top`);
  }

  loading.value = false;
});

</script>

<template>
  <page-layout :is-loading="loading">
    <div class="main-page">
      <!-- Navigation section -->
      <div class="navigation">
        <a-button class="return-button" type="text" @click="() => (popup.confirmBack = true)">
          <left-outlined />
          <div class="ml-21 d-inline-block">
            {{ $t('sharefile.create.backToSearch') }}
          </div>
        </a-button>
      </div>

      <!-- Title section -->
      <div class="page-title main-title">
        {{ $t('sharefile.create.pageTitle') }}
        <span class="text-small">{{ $t('sharefile.create.pageTitleCreate') }}</span>
      </div>

      <!-- Tag section -->
      <div class="register-tag">
        <a-button class="btn-rounned tag-unregistered">
          {{ $t('sharefile.create.registerTag') }}
        </a-button>
      </div>

      <!-- Form section -->
      <a-form ref="formRef" :model="store.formState">
        <!-- File information -->
        <div class="card">
          <!-- Share file number  -->
          <a-row :gutter="10">
            <a-col class="title" :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft">
              {{ $t('sharefile.create.shareFileNumber.title') }}
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight" class="share-file-number">
            </a-col>
          </a-row>

          <!-- Department in charge  -->
          <a-row>
            <a-col class="title" :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft">
              {{ $t('sharefile.create.department.title') }}
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-form-item name="department" :rules="[
                {
                  max: 2000,
                  message: $t('sharefile.create.department.title') + $t('sharefile.maxlength'),
                  trigger: ['blur', 'change']
                }
              ]">
                <a-input v-model:value="store.formState.department"
                  :placeholder="$t('sharefile.create.department.placeHolder')" size="large">
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>

          <!-- Business  -->
          <a-row class="align-items-center">
            <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft">
              <div class="title">
                {{ $t('sharefile.create.business.title') }}
              </div>
              <div style="display: inline-block; margin-left: 20px">
                <RequiredTag />
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-row>
                <a-form-item name="businessCode" :rules="[
                  {
                    required: true,
                    message: $t('sharefile.create.business.title') + $t('sharefile.required'),
                    trigger: ['blur', 'change']
                  }
                ]">
                  <a-select v-model:value="store.formState.businessCode" class="input-option"
                    :placeholder="$t('sharefile.create.business.placeHolder')" size="large"
                    @select="() => { handleSelectBusiness(); }" :showSearch="true" optionFilterProp="businessName"
                    :options="store.businesses" :fieldNames="{
                      value: 'businessCode',
                      label: 'businessName'
                    }"></a-select>
                </a-form-item>
              </a-row>
            </a-col>
          </a-row>

          <!-- Company group -->
          <a-row>
            <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft" class="m-t-5">
              <div class="title">
                {{ $t('sharefile.create.companyGroup.title') }}
              </div>
              <div style="display: inline-block; margin-left: 20px">
                <RequiredTag />
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-row>
                <a-form-item name="companyGroupCode" :rules="[
                  {
                    required: true,
                    message: $t('sharefile.create.companyGroup.title') + $t('sharefile.required'),
                    trigger: ['blur', 'change']
                  }
                ]" class="company-group-restriction">
                  <a-spin :spinning="spinning">
                    <a-select v-model:value="store.formState.companyGroupCode"
                      :placeholder="$t('sharefile.create.companyGroup.placeHolder')" mode="multiple" size="large"
                      :disabled="!store.formState.businessCode" :showSearch="true" optionFilterProp="name"
                      :options="store.companiesAndFaqCodes" :fieldNames="{
                        value: 'code',
                        label: 'name'
                      }">
                    </a-select>
                  </a-spin>
                </a-form-item>
              </a-row>
            </a-col>
          </a-row>

          <!-- Memo share -->
          <a-row>
            <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft" class="m-t-5">
              <div class="title">
                {{ $t('sharefile.create.memoShare.title') }}
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight" class="flex-column">
              <a-row>
                <a-form-item name="note" :rules="[
                  {
                    max: 2000,
                    message: $t('sharefile.create.memoShare.title') + $t('sharefile.maxlength'),
                    trigger: ['blur', 'change']
                  }
                ]">
                  <a-textarea v-model:value="store.formState.note"
                    :placeholder="$t('sharefile.create.memoShare.placeHolder')" :rows="4" size="large">
                  </a-textarea>
                </a-form-item>
              </a-row>
            </a-col>
          </a-row>
        </div>

        <!-- File title and description -->
        <div class="card">
          <!-- Title -->
          <a-row>
            <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft" class="m-t-5">
              <div class="title">
                {{ $t('sharefile.create.title.title') }}
              </div>
              <div style="display: inline-block; margin-left: 20px">
                <RequiredTag />
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-row>
                <a-form-item name="title" :rules="[
                  {
                    required: true,
                    message: $t('sharefile.create.title.title') + $t('sharefile.required'),
                    trigger: ['blur', 'change']
                  },
                  {
                    max: 2000,
                    message: $t('sharefile.create.title.title') + $t('sharefile.maxlength'),
                    trigger: ['blur', 'change']
                  }
                ]">
                  <a-input v-model:value="store.formState.title" :placeholder="$t('sharefile.create.title.placeHolder')"
                    size="large" />
                </a-form-item>
              </a-row>
            </a-col>
          </a-row>

          <!-- File description -->
          <a-row>
            <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft" class="m-t-5">
              <div class="title">
                {{ $t('sharefile.create.description.title') }}
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight" class="flex-column">
              <a-row>
                <a-form-item name="description" :rules="[
                  {
                    max: 2000,
                    message: $t('sharefile.create.description.title') + $t('sharefile.maxlength'),
                    trigger: ['blur', 'change']
                  }
                ]">
                  <a-textarea v-model:value="store.formState.description"
                    :placeholder="$t('sharefile.create.description.placeHolder')" :rows="4" size="large">
                  </a-textarea>
                </a-form-item>
              </a-row>
            </a-col>
          </a-row>
        </div>

        <!-- File Attachment -->
        <div class="card">
          <a-row>
            <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="10">
              <div class="title">
                {{ $t('sharefile.create.file-attachment.title') }}
              </div>
              <div style="display: inline-block; margin-left: 20px">
                <RequiredTag />
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-form-item name="attachments" :rules="[
                {
                  required: true,
                  message: $t('sharefile.create.file-attachment.title') + $t('sharefile.required'),
                  trigger: ['blur', 'change']
                }
              ]">
                <Upload :size="5" v-model:files="store.formState.attachments" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-form>

      <!-- Button group -->
      <div class="button-group">
        <div class="page-top">
          <div class="page-nav">
            <a-button type="primary" class="btn-common btn-rounned" @click="isOpenHistoryPopup = true">
              {{ $t('sharefile.button.history') }}
            </a-button>

            <a-button type="primary" class="btn-common btn-rounned" @click="checkValidateAll()">
              {{ $t('sharefile.button.saveDraft') }}
            </a-button>

            <a-button type="primary" class="btn-common btn-rounned btn-disable" @click="isOpenRequestPopup = true"
              :disabled="true">
              {{ $t('sharefile.button.request') }}
            </a-button>

            <a-button class="btn-rounned btn-normal btn-disable" :disabled="true">
              {{ $t('sharefile.button.delete') }}
            </a-button>

            <a-button class="btn-rounned btn-normal btn-disable" @click="isOpenAcceptRequestPopup = true"
              :disabled="true">
              {{ $t('sharefile.button.share') }}
            </a-button>
          </div>
        </div>
      </div>

      <ShareFileHistory :status="isOpenHistoryPopup" @cancel="handleCloseHistoryPopup" />

      <Request :status="isOpenRequestPopup" @cancel="handleCloseRequestPopup" />

      <AcceptRequest :status="isOpenAcceptRequestPopup" @cancel="handleCloseAcceptRequestPopup" />
    </div>
  </page-layout>

  <confirm-dialog v-model:visible="popup.confirmBack" :show-cancel="true" :message="$t('common.popup.backToTop')"
    :cancelTitle="$t('faq-create.cancel')" :type="'right'" @ok="() => {
        router.push('/sharefiles/search');
        clearData();
      }
      "></confirm-dialog>
  <confirm-dialog v-model:visible="popup.confirmRegister" :show-cancel="true" :show-ok="true"
    :message="$t('faq-create.register.message')" :cancelTitle="$t('faq-create.cancel')" :type="'right'"
    @ok="saveDraf"></confirm-dialog>
</template>

<style scoped>
@import './../../assets/styles/common.css';
@import './../../assets/styles/page.css';
@import './../../assets/styles/button.css';

.main-page {
  max-width: 1120px;
  margin: auto;
}

.text-small {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;

  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.87);
  margin-left: 25px;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.main-title {
  margin: 35px 0px !important;
}

.align-items-center {
  align-items: center;
}

.page-title {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 40px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.87);
  margin: 10px 0px;
}

.card> ::v-deep(.ant-row) {
  margin-bottom: 15px;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px 50px;
  margin-bottom: 20px;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14),
    0px 1px 5px rgba(0, 0, 0, 0.12);
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

.page-nav {
  display: flex;
  gap: 10px;
}

.register-tag {
  display: flex;
  justify-content: end;
  margin-bottom: 30px;
}

.tag-info {
  background-color: rgba(236, 239, 241, 1);
  border: 1px solid rgba(0, 0, 0, 0.42);
  border-radius: 4px;
  height: 40px;
  width: 145px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-wrap: wrap;
  padding: 0px 5px;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-title {
  margin-top: 5px;
}

.share-file-number {
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
}

.section-header {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 40px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.87);
  margin-bottom: 20px;
}

.card ::v-deep(.ant-input) {
  border-radius: 5px;
}

.card ::v-deep(.ant-select-selector) {
  border-radius: 5px;
  min-height: 40px;
}

.ant-table-striped :deep(.table-striped) td {
  background-color: #eceff1;
}

::v-deep(.ant-table-pagination.ant-pagination) {
  display: none;
}

::v-deep(.ant-table-thead > tr > th) {
  background-color: #cfd8dc;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
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

.link {
  text-decoration: underline;
}

::v-deep(.ant-select-selection-overflow) {
  overflow: hidden;
}
</style>
