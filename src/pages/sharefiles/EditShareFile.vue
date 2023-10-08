<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { ref, computed, onMounted } from 'vue';
import RequiredTag from '@/components/common/RequiredTag.vue';
import Upload from '@/components/common/Upload.vue';
import LeftOutlined from '@/components/icon/LeftOutlined.vue';
import ShareFileHistory from './popup/ShareFileHistory.vue';
import Request from './popup/Request.vue';
import type { FormInstance } from 'ant-design-vue';
import AcceptRequest from './popup/AcceptRequest.vue';
import type { CompanyGroupBusiness, ShareFileDetails } from '@/types/interfaces/sharefile';
import Pagination from '@/components/common/pagination/Pagination.vue';
import PageLayout from '@/pages/layouts/PageLayout.vue';
import type { Business, Popup } from '@/types/interfaces/faq';
import { getCompanyGroupByBusinessCode } from '@/api/common.api';
import router from '@/router';
import {
  getShareFileDetailForEdit,
  updateShareFile,
  getUserAssignerShareFile,
  shareFileReferences,
  shareFileHistories,
  shareFileDelete
} from '@/api/shareFile.api';
import { message } from 'ant-design-vue';
import { getFileAttachmentList, uploadFilesMemory } from '@/api/file.api';
import { useAuthStore } from '@/stores/auth.store';
import table from '@/stores/mixins/table';
import { SHAREFILE_STATUS, USER_TYPE } from '@/stores/constants/constant';
import { getPermisionBussiness } from '@/api/faq.api';
import { useRoute } from 'vue-router';
import ConfirmDialog from '@/components/common/dialog/ConfirmDialog.vue';

const route = useRoute();

let canEdit = ref<boolean>(false);
let canView = ref<boolean>(true);
let isUserIsAuthority = ref<boolean>(false);
let isUserAssign = ref<boolean>(false);
let isOpenHistoryPopup = ref<boolean>(false);
let isOpenRequestPopup = ref<boolean>(false);
let isOpenAcceptRequestPopup = ref<boolean>(false);
let isInvestigatorView = ref<boolean>(false);
const authUser = useAuthStore();
let pageSize = ref(10);
let currentPage = ref(1);
const pageSizeOptions = ref<string[]>(['10', '30', '50']);

let listBusiness = ref<Business[]>([]);
let listCompanyGroupBusiness = ref<CompanyGroupBusiness[]>([]);
let listUserAss = ref<any[]>([]);
let listReferences = ref<any[]>([]);
let listHistories = ref<any[]>([]);
let listFileAttachment = ref<any[]>([]);
let shareFile = ref<ShareFileDetails>({
  fileNumber: null,
  businessCode: null,
  companyGroups: [],
  fileAttachment: [],
  description: null,
  procescer: null,
  note: null,
  title: null,
  department: null,
  createdBy: null,
  updatedBy: null,
  updatedAt: null,
  processStatus: null,
  userAssigned: [],
  subShareFile: false
});

const loading = ref<boolean>(false);
const spinning = ref<boolean>(false);

const xsSizeLeft = ref<number>(18);
const xsSizeRight = ref<number>(23);

const smSizeLeft = ref<number>(8);
const smSizeRight = ref<number>(16);

const mdSizeLeft = ref<number>(8);
const mdSizeRight = ref<number>(16);

const formRef = ref<FormInstance>();

const columns = [
  {
    title: t('sharefile.create.table.division'),
    key: 'business',
    type: 'array',
    width: '180px',
    dataIndex: 'business_division'
  },
  {
    title: t('sharefile.create.table.number'),
    key: 'number',
    type: 'date',
    width: '180px',
    dataIndex: 'updated_at'
  },
  {
    title: t('sharefile.create.table.reference'),
    key: 'reference',
    dataIndex: 'content',
    width: '200px'
  },
  {
    title: t('sharefile.create.table.period'),
    key: 'period',
    type: 'status',
    width: '250px',
    dataIndex: 'status'
  }
];

const checkValidateAll = async () => {
  try {
    await formRef.value?.validateFields();
    return true;
  } catch (error) {
    return false;
  }
};

const onChangePage = async (onChange: any) => {
  loading.value = true;
  currentPage.value = onChange.page === 0 ? 1 : onChange.page;
  pageSize.value = onChange.limit;
  await getShareFileReferences();
  loading.value = false;
};

const handleCloseHistoryPopup = () => {
  isOpenHistoryPopup.value = false;
};

const handleCloseRequestPopup = () => {
  isOpenRequestPopup.value = false;
};

const handleCloseAcceptRequestPopup = () => {
  isOpenAcceptRequestPopup.value = false;
};

const tableFormat = computed(() => {
  return table;
});

const getShareFileReferences = async () => {
  const data = {
    shareFileNumber: shareFile.value.fileNumber,
    pageSize: pageSize.value,
    pageIndex: currentPage.value
  };

  return await shareFileReferences(data)
    .then((response: any) => {
      listReferences.value = response.data;
    })
    .catch((error) => {
      message.error(error.response.data.message);
      Promise.reject(error);
    });
};

onMounted(async () => {
  loading.value = true;

  if (
    authUser.authUser?.UserType == USER_TYPE.MANAGER ||
    authUser.authUser?.UserType == USER_TYPE.SYSTEM_ADMIN
  ) {
    let userFunctions = authUser.authUser?.functions;

    let userFunctionsShareFile = userFunctions?.filter((item) => {
      return item.functionCode == 'SHARE-FILE';
    });

    if (userFunctionsShareFile?.length == 0) {
      canView.value = false;
    }

    if (
      userFunctionsShareFile.filter((item) => {
        return item.flag == '2';
      }).length > 0
    ) {
      canView.value = false;
    }

    if (canView.value == false) {
      message.error(t('faq-detail.user_not_permission'));
      return await router.push('/top');
    }

    if (
      userFunctionsShareFile.filter((item) => {
        return item.flag == '0';
      }).length > 0
    ) {
      canEdit.value = true;
    }

    if (
      authUser.authUser?.UserType == USER_TYPE.MANAGER &&
      authUser.authUser?.IsAuthority == 'True'
    ) {
      isUserIsAuthority.value = true;
    }
  } else {
    message.error(t('faq-detail.user_not_permission'));
    return await router.push('/sharefiles/search');
  }

  await Promise.all([getBusinessData(), getShareFileData(), fileAttachmentList()]);

  if (shareFile.value) {
    await getCompanyGroupData(shareFile.value.businessCode);
  }
  if (shareFile.value.processStatus == SHAREFILE_STATUS.REGISTERED) {
    await getShareFileReferences();
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  loading.value = false;
});

const fileAttachmentList = async () => {
  await getFileAttachmentList()
    .then((res: any) => {
      listFileAttachment.value = res.data;
    })
    .catch((error: any) => {
      if (error.response.status === 403) {
        message.error(error.response.data);
        return router.push('/login-menu');
      }
      Promise.reject(error);
    });
};

const checkTypeFileError = () => {
  let isError = false;

  shareFile.value.fileAttachment.forEach((file: any) => {
    const fileName = file.name;
    const fileType = fileName.split('.');
    if (listFileAttachment.value.includes(fileType[fileType.length - 1])) {
      message.error(`${fileName} file upload is not supported`);
      isError = true;
    }
  });

  return isError;
};

const getBusinessData = async () => {
  return await getPermisionBussiness()
    .then((response) => {
      listBusiness.value = response.data;
    })
    .catch((error) => {
      message.error(error.response.data.message);
      Promise.reject(error);
    });
};

const getCompanyGroupData = async (businessCode: string | null) => {
  let param = { businessCode: businessCode };
  return await getCompanyGroupByBusinessCode(param)
    .then((response: any) => {
      listCompanyGroupBusiness.value = response.data;
    })
    .catch((error) => {
      message.error(error.response.data.message);
      Promise.reject(error);
    });
};

const getShareFileData = async () => {
  let param = { shareFileNumber: route.query.shareFileNumber };
  return await getShareFileDetailForEdit(param)
    .then((response: any) => {
      const userId = authUser.authUser?.UserId || authUser.authUser?.LoginUserId;
      let listUserAssign: (string | undefined)[] = [];

      shareFile.value = response.data;
      if (shareFile.value.userAssigned.length > 0) {
        shareFile.value.userAssigned.forEach((item: any) => {
          listUserAssign.push(item.userId);
        });
        isUserAssign.value = listUserAssign.includes(userId);
      }
    })
    .catch((error) => {
      message.error(error.response.data.message);
      Promise.reject(error);
      router.push('/sharefiles/search');
      return;
    });
};

const getUserAssigner = async () => {
  let param = { shareFileNumber: route.query.shareFileNumber };
  return await getUserAssignerShareFile(param)
    .then((response: any) => {
      listUserAss.value = response.data;
    })
    .catch((error) => {
      Promise.reject(error);
    });
};

const getShareFileHistories = async () => {
  let param = { shareFileNumber: route.query.shareFileNumber };
  return await shareFileHistories(param)
    .then((response: any) => {
      listHistories.value = response.data;
    })
    .catch((error) => {
      Promise.reject(error);
    });
};

const handleBusinessSelect = async (value: any) => {
  spinning.value = true;
  shareFile.value.companyGroups = [];
  await getCompanyGroupData(value);
  spinning.value = false;
};

const handleChangeCompanyGroups = (value: any[]) => {
  shareFile.value.companyGroups = value;
};

const investigatorView = () => {
  isInvestigatorView.value = true;
};

const saveDraft = async () => {
  loading.value = true;

  if (shareFile.value.fileAttachment.length === 0) {
    message.error(t('sharefile.create.file-attachment.title') + t('faq-create.required'));
    loading.value = false;
    return;
  }

  const checkValidate = await checkValidateAll();
  if (!checkValidate) {
    loading.value = false;
    return;
  }

  const isFileError = checkTypeFileError();
  if (isFileError) {
    loading.value = false;
    return;
  }

  const formData = new FormData();

  shareFile.value.fileAttachment.forEach((attachment: any) => {
    if (attachment['originFileObj']) {
      formData.append('files', attachment['originFileObj']);
    }
  });

  if (formData.get('files')) {
    await uploadFilesMemory(formData)
      .then((response: any) => {
        const listFileUpload = response.data.listFileUpload;
        shareFile.value.fileAttachment.forEach((file: any) => {
          if (file['originFileObj']) {
            listFileUpload.forEach((item: any) => {
              if (item['fileName'] == file['originFileObj'].name) {
                file['fileId'] = item['fileId'];
              }
            });
          }
        });
      })
      .catch((error) => {
        message.error(error.response.data.message);
        Promise.reject(error);
        loading.value = false;
      });
  }

  const data = {
    businessCode: shareFile.value.businessCode,
    fileNumber: shareFile.value.fileNumber,
    title: shareFile.value.title,
    description: shareFile.value.description,
    companyGroups: shareFile.value.companyGroups,
    note: shareFile.value.note,
    department: shareFile.value.department,
    updatedAt: shareFile.value.updatedAt,
    createdBy: shareFile.value.createdBy,
    fileAttachment: shareFile.value.fileAttachment,
    processStatus: shareFile.value.processStatus
  };

  await updateShareFile(data)
    .then(async (response: any) => {
      message.success(response.message);

      if (shareFile.value.processStatus === SHAREFILE_STATUS.REGISTERED) {
        await router.push(`/sharefiles/edit?shareFileNumber=${response.data}`);
        window.location.reload();
      }
    })
    .catch((error) => {
      message.error(error.response.data.message);
      Promise.reject(error);
      loading.value = false;
    });

  loading.value = false;
};

const showHistories = async () => {
  await getShareFileHistories();
  isOpenHistoryPopup.value = true;
};

const showPopupAcceptRequest = async () => {
  if (isUserIsAuthority && shareFile.value.procescer === SHAREFILE_STATUS.REGISTERED) {
    return;
  }
  await getShareFileHistories();
  isOpenAcceptRequestPopup.value = true;
};

const showPopupRequest = async () => {
  if (isUserIsAuthority && shareFile.value.procescer === SHAREFILE_STATUS.REGISTERED) {
    return;
  }

  await getUserAssigner();
  isOpenRequestPopup.value = true;
};

const popup = ref<Popup>({
  confirmBack: false,
  confirmRegister: false,
  confirmClear: false,
  confirmDelete: false,
  confirmBackToTop: false,
});

const deleteShareFile = async () => {
  loading.value = true;
  const param = {
    shareFileNumber: router.currentRoute.value.query.shareFileNumber
  };
  shareFileDelete(param)
    .then((response: any) => {
      message.success(`${response.message}`);
      loading.value = false;
      router.push('/sharefiles/search');
    })
    .catch((error) => {
      message.error(`${error.response.data.message}`);
      loading.value = false;
      Promise.reject(error);
    });
};
</script>

<template>
  <page-layout :is-loading="loading">
    <div class="main-page">
      <!-- Navigation section -->
      <div class="navigation">
        <a-button class="return-button" type="text" href="/sharefiles/search">
          <left-outlined />
          <div class="ml-21 d-inline-block">
            {{ $t('sharefile.create.backToSearch') }}
          </div>
        </a-button>
      </div>

      <!-- Title section -->
      <div class="page-title main-title">
        {{ $t('sharefile.create.pageTitle') }}
        <span class="text-small">{{ $t('sharefile.edit.title') }}</span>
      </div>

      <!-- Tag section -->
      <div class="register-tag">
        <div>
          <a-button
            v-if="shareFile.processStatus != SHAREFILE_STATUS.REGISTERED"
            class="btn-rounned tag-unregistered"
          >
            {{ shareFile.processStatus ?? null }}
          </a-button>

          <a-button
            v-else-if="
              shareFile.processStatus === SHAREFILE_STATUS.REGISTERED && shareFile.subShareFile
            "
            class="btn-rounned tag-unregistered"
            style="width: auto"
          >
            {{ SHAREFILE_STATUS.IS_SUB_SHARE_FILE }}
          </a-button>

          <a-button
            v-else-if="
              shareFile.processStatus === SHAREFILE_STATUS.REGISTERED && !shareFile.subShareFile
            "
            class="btn-rounned tag-unregistered"
            style="width: auto"
          >
            {{ SHAREFILE_STATUS.NOT_SUB_SHARE_FILE }}
          </a-button>
          <p
            v-if="
              shareFile.processStatus == SHAREFILE_STATUS.PENDING_REVIEW &&
              !isInvestigatorView &&
              !isUserAssign
            "
            class="request-mode"
            @click="investigatorView"
          >
            {{ $t('sharefile.requestMode') }}
          </p>
        </div>
      </div>

      <!-- Form section -->
      <a-form ref="formRef" :model="shareFile">
        <!-- File information -->
        <div class="card">
          <!-- User infor -->
          <a-row :gutter="100">
            <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="10">
              <div class="title user-title">
                {{ $t('sharefile.create.user.title') }}
              </div>
            </a-col>

            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="14" class="user-info">
              <p class="title">{{ $t('sharefile.create.user.name') }}</p>

              <p class="title tag-info">{{ shareFile.updatedBy }}</p>

              <p class="title">{{ $t('sharefile.create.user.updateTime') }}</p>

              <p v-if="shareFile.updatedAt" class="title tag-info">
                {{ tableFormat.formatDate(new Date(shareFile.updatedAt), 'YYYY/MM/DD') }}
              </p>
            </a-col>
          </a-row>

          <!-- Share file number  -->
          <a-row :gutter="10">
            <a-col class="title" :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft">
              {{ $t('sharefile.create.shareFileNumber.title') }}
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight" class="share-file-number">
              {{ shareFile.fileNumber }}
            </a-col>
          </a-row>

          <!-- Department in charge  -->
          <a-row>
            <a-col class="title" :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft">
              {{ $t('sharefile.create.department.title') }}
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-form-item
                name="department"
                :rules="[
                  {
                    max: 2000,
                    message: $t('sharefile.create.department.title') + $t('sharefile.maxlength'),
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <a-input
                  v-model:value="shareFile.department"
                  :placeholder="$t('sharefile.create.department.placeHolder')"
                  size="large"
                  :disabled="
                    isUserAssign ||
                    isUserIsAuthority ||
                    isInvestigatorView ||
                    shareFile.processStatus == SHAREFILE_STATUS.PENDING_REVIEW
                  "
                >
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
              <div class="d-inline-block m-l-20">
                <RequiredTag />
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-row>
                <a-form-item
                  name="businessCode"
                  :rules="[
                    {
                      required: true,
                      message: $t('sharefile.create.business.title') + $t('faq-create.required'),
                      trigger: ['blur']
                    }
                  ]"
                >
                  <a-select
                    :disabled="
                      shareFile.processStatus == SHAREFILE_STATUS.PENDING_REVIEW ||
                      isUserIsAuthority
                    "
                    size="large"
                    show-search
                    v-model:value="shareFile.businessCode"
                    :options="listBusiness"
                    :field-names="{ value: 'businessCode', label: 'businessName' }"
                    :placeholder="$t('sharefile.create.business.placeHolder')"
                    @select="(value : any) => handleBusinessSelect(value)"
                  />
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
              <div class="d-inline-block m-l-20">
                <RequiredTag />
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-row>
                <a-form-item
                  :name="'companyGroups'"
                  class="answer-restriction"
                  :rules="[
                    {
                      required: true,
                      message:
                        $t('sharefile.create.companyGroup.title') + $t('faq-create.required'),
                      trigger: ['blur', 'change']
                    }
                  ]"
                >
                  <a-spin :spinning="spinning">
                    <a-select
                      v-model:value="shareFile.companyGroups"
                      :placeholder="$t('sharefile.create.companyGroup.placeHolder')"
                      size="large"
                      show-search
                      mode="multiple"
                      class="answer-company"
                      @change="(value: any[]) => handleChangeCompanyGroups(value)"
                      :disabled="
                        isUserAssign ||
                        isUserIsAuthority ||
                        isInvestigatorView ||
                        shareFile.processStatus == SHAREFILE_STATUS.PENDING_REVIEW
                      "
                    >
                      <a-select-option
                        v-for="(item, index) in listCompanyGroupBusiness"
                        :key="index"
                        :value="item.companyGroupCode"
                      >
                        {{ item.companyGroupCode + '_' + item.companyGroupName }}
                      </a-select-option>
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
                <a-form-item
                  name="note"
                  :rules="[
                    {
                      max: 2000,
                      message: $t('sharefile.create.memoShare.title') + $t('sharefile.maxlength'),
                      trigger: ['blur', 'change']
                    }
                  ]"
                >
                  <a-textarea
                    v-model:value="shareFile.note"
                    :placeholder="$t('sharefile.create.memoShare.placeHolder')"
                    :rows="4"
                    size="large"
                    :disabled="
                      isUserAssign ||
                      isUserIsAuthority ||
                      isInvestigatorView ||
                      shareFile.processStatus == SHAREFILE_STATUS.PENDING_REVIEW
                    "
                  >
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
              <div class="d-inline-block m-l-20">
                <RequiredTag />
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-row>
                <a-form-item
                  name="title"
                  :rules="[
                    {
                      required: true,
                      message: $t('sharefile.create.title.title') + $t('faq-create.required'),
                      trigger: ['blur', 'change']
                    },
                    {
                      max: 2000,
                      message: $t('sharefile.create.description.title') + $t('sharefile.maxlength'),
                      trigger: ['blur', 'change']
                    }
                  ]"
                >
                  <a-input
                    v-model:value="shareFile.title"
                    :placeholder="$t('sharefile.create.title.placeHolder')"
                    size="large"
                    :disabled="
                      isUserAssign ||
                      isUserIsAuthority ||
                      isInvestigatorView ||
                      shareFile.processStatus == SHAREFILE_STATUS.PENDING_REVIEW
                    "
                  />
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
                <a-form-item
                  name="description"
                  :rules="[
                    {
                      max: 2000,
                      message: $t('sharefile.create.description.title') + $t('sharefile.maxlength'),
                      trigger: ['blur', 'change']
                    }
                  ]"
                >
                  <a-textarea
                    v-model:value="shareFile.description"
                    :placeholder="$t('sharefile.create.description.placeHolder')"
                    :rows="4"
                    size="large"
                    :disabled="
                      isUserAssign ||
                      isInvestigatorView ||
                      isUserIsAuthority ||
                      shareFile.processStatus == SHAREFILE_STATUS.PENDING_REVIEW
                    "
                  >
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
              <div class="d-inline-block m-l-20">
                <RequiredTag />
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <Upload
                :is-user-assign="
                  isUserAssign ||
                  isUserIsAuthority ||
                  isInvestigatorView ||
                  shareFile.processStatus == SHAREFILE_STATUS.PENDING_REVIEW
                "
                :size="5"
                :attachment-list="listFileAttachment"
                v-model:files="shareFile.fileAttachment"
              />
            </a-col>
          </a-row>
        </div>
      </a-form>

      <!-- Table file call -->
      <div class="card" v-if="shareFile.processStatus === SHAREFILE_STATUS.REGISTERED">
        <div class="section-header">{{ $t('sharefile.create.shareFileCaller') }}</div>

        <Pagination
          :page="currentPage"
          :limit="pageSize"
          :total="listReferences.length"
          :page-size-options="pageSizeOptions"
          :total-data="listReferences.length"
          @pagination="onChangePage"
          class="m-t-25"
        >
        </Pagination>

        <a-table
          class="ant-table-striped"
          size="middle"
          :columns="columns"
          :data-source="listReferences"
          :pagination="{ pageSize: pageSize }"
          :row-class-name="(_record:any, index:any) => (index % 2 === 1 ? 'table-striped' : null)"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'business'">
              <div>
                <span class="fs-16">{{ record.type }}</span>
              </div>
            </template>
            <template v-if="column.key === 'number'">
              <a class="link fs-16">
                {{ record.answerNumber }}
              </a>
            </template>
            <template v-else-if="column.key === 'reference'">
              <span class="fs-16">
                {{ record.destination.toString() }}
              </span>
            </template>
            <template v-else-if="column.key === 'period'">
              <span class="fs-16">
                {{
                  tableFormat.formatDate(new Date(record.startTime), 'YYYY/MM/DD') +
                  ' ~ ' +
                  tableFormat.formatDate(new Date(record.endTime), 'YYYY/MM/DD')
                }}
              </span>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Button group -->
      <div
        v-if="
          shareFile.processStatus !== SHAREFILE_STATUS.PENDING_REVIEW &&
          (authUser.authUser?.UserId === shareFile.createdBy ||
            authUser.authUser?.LoginUserId === shareFile.createdBy)
        "
        class="button-group"
      >
        <div class="page-top">
          <div class="page-nav">
            <a-button type="primary" class="btn-common btn-rounned" @click="showHistories">
              {{ $t('sharefile.button.history') }}
            </a-button>

            <a-button type="primary" class="btn-common btn-rounned" @click="saveDraft">
              {{ $t('sharefile.button.saveDraft') }}
            </a-button>

            <a-button
              type="primary"
              class="btn-common btn-rounned"
              :disabled="shareFile.processStatus == SHAREFILE_STATUS.REGISTERED"
              @click="showPopupRequest"
            >
              {{ $t('sharefile.button.request') }}
            </a-button>

            <a-button
              :type="shareFile.processStatus == SHAREFILE_STATUS.TEMPORARILY_SAVE ? 'primary' : ''"
              :class="
                shareFile.processStatus !== SHAREFILE_STATUS.TEMPORARILY_SAVE
                  ? 'btn-common btn-disable'
                  : 'btn-normal'
              "
              :disabled="shareFile.processStatus !== SHAREFILE_STATUS.TEMPORARILY_SAVE"
              class="btn-rounned"
              @click="() => (popup.confirmDelete = true)"
            >
              {{ $t('sharefile.button.delete') }}
            </a-button>

            <a-button disabled class="btn-common btn-rounned btn-disable">
              {{ $t('sharefile.button.share') }}
            </a-button>
          </div>
        </div>
      </div>

      <div v-else-if="isUserAssign" class="button-group">
        <div class="page-top">
          <div class="page-nav">
            <a-button type="primary" class="btn-common btn-rounned" @click="showHistories">
              {{ $t('sharefile.button.history') }}
            </a-button>

            <a-button disabled class="btn-common btn-rounned btn-disable">
              {{ $t('sharefile.button.saveDraft') }}
            </a-button>

            <a-button type="primary" class="btn-common btn-rounned" @click="showPopupRequest">
              {{ $t('sharefile.button.request') }}
            </a-button>

            <a-button class="btn-common btn-rounned btn-disable" disabled>
              {{ $t('sharefile.button.delete') }}
            </a-button>

            <a-button type="primary" class="btn-common btn-rounned" @click="showPopupAcceptRequest">
              {{ $t('sharefile.button.share') }}
            </a-button>
          </div>
        </div>
      </div>

      <div v-else-if="isUserIsAuthority" class="button-group">
        <div class="page-top">
          <div class="page-nav">
            <a-button type="primary" class="btn-common btn-rounned" @click="showHistories">
              {{ $t('sharefile.button.history') }}
            </a-button>

            <a-button disabled class="btn-common btn-rounned btn-disable">
              {{ $t('sharefile.button.saveDraft') }}
            </a-button>

            <a-button
              type="primary"
              class="btn-common btn-rounned"
              :class="shareFile.processStatus == SHAREFILE_STATUS.REGISTERED ? 'btn-disable' : ''"
              :disabled="shareFile.processStatus == SHAREFILE_STATUS.REGISTERED"
              @click="showPopupRequest"
            >
              {{ $t('sharefile.button.request') }}
            </a-button>

            <a-button disabled class="btn-common btn-rounned btn-disable">
              {{ $t('sharefile.button.delete') }}
            </a-button>

            <a-button
              type="primary"
              class="btn-common btn-rounned"
              :class="shareFile.processStatus == SHAREFILE_STATUS.REGISTERED ? 'btn-disable' : ''"
              :disabled="shareFile.processStatus == SHAREFILE_STATUS.REGISTERED"
              @click="showPopupAcceptRequest"
            >
              {{ $t('sharefile.button.share') }}
            </a-button>
          </div>
        </div>
      </div>

      <div v-if="isInvestigatorView" class="button-group">
        <div class="page-top">
          <div class="page-nav">
            <a-button disabled class="btn-common btn-rounned btn-disable">
              {{ $t('sharefile.button.history') }}
            </a-button>

            <a-button disabled class="btn-common btn-rounned btn-disable">
              {{ $t('sharefile.button.saveDraft') }}
            </a-button>

            <a-button disabled class="btn-common btn-rounned btn-disable">
              {{ $t('sharefile.button.request') }}
            </a-button>

            <a-button disabled class="btn-common btn-rounned btn-disable">
              {{ $t('sharefile.button.delete') }}
            </a-button>

            <a-button disabled class="btn-common btn-rounned btn-disable">
              {{ $t('sharefile.button.share') }}
            </a-button>
          </div>
        </div>
      </div>

      <ShareFileHistory
        :histories="listHistories"
        :status="isOpenHistoryPopup"
        @cancel="handleCloseHistoryPopup"
      />

      <Request
        :list-assigner="listUserAss"
        :status="isOpenRequestPopup"
        :share-file="shareFile"
        @cancel="handleCloseRequestPopup"
      />

      <AcceptRequest
        :histories="listHistories"
        :share-file="shareFile"
        :status="isOpenAcceptRequestPopup"
        @cancel="handleCloseAcceptRequestPopup"
      />
    </div>
  </page-layout>

  <confirm-dialog
    v-model:visible="popup.confirmDelete"
    :show-cancel="true"
    :message="$t('sharefile.button.share')"
    :cancel-title="$t('sharefile.button.share')"
    :type="'right'"
    @close="popup.confirmDelete = false"
    @ok="deleteShareFile"
  ></confirm-dialog>
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
.card > ::v-deep(.ant-row) {
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

::v-deep(.ant-input-disabled) {
  color: rgba(55, 71, 79, 0.95) !important;
}

::v-deep(.ant-select-selector) {
  color: rgba(55, 71, 79, 0.95) !important;
}

.answer-restriction ::v-deep(.ant-select-selector) {
  width: 100%;
  align-items: start;
  border-radius: 5px;
}

.answer-restriction ::v-deep(.ant-select-selection-item) {
  border: 1px solid rgba(25, 118, 210, 1);
  color: rgba(25, 118, 210, 1);
  background-color: #fff;
  border-radius: 30px;
}

.request-mode {
  color: rgba(25, 118, 210, 1);
  float: right;
  cursor: pointer;
}

.link {
  text-decoration: underline;
}

::v-deep(.ant-select-selection-overflow) {
  overflow: hidden;
}
</style>
