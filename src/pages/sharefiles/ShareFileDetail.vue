<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import LeftOutlined from '@/components/icon/LeftOutlined.vue';
import TitleTag from '@/components/common/TitleTag.vue';
import router from '@/router';
import { useRoute } from 'vue-router';
import PageLayout from '@/pages/layouts/PageLayout.vue';
import { getShareFileDetail } from '@/api/shareFile.api';
import type { ShareFileDetail, FileAttachment } from '@/types/interfaces/sharefile';
import { SHAREFILE_STATUS } from '@/stores/constants/constant'
import { message } from 'ant-design-vue';
import { convertSize } from '@/utils/index';
import DownloadShareFile from './popup/DownloadShareFile.vue';
import { downloadFiles } from '@/api/file.api';
import { useAuthStore } from '@/stores/auth.store';
import { t } from '@/plugins/i18n';
const authUser = useAuthStore();
const isLoading = ref<boolean>(false);
const isShowDownload = ref<boolean>(false);
// let shareFileDataDownload = ref<any>();
const route = useRoute();

const query = {
  shareFileNumber: route.query.shareFileNumber,
};

const shareFileDetail = ref<ShareFileDetail>();

let isDisableBtn = computed(() => {
  return shareFileDetail.value?.status !== SHAREFILE_STATUS.REGISTERED
})


let isAbleDownloadBtn =  computed(() => {
  let checkedFiles : FileAttachment[] | undefined = shareFileDetail.value?.fileAttachmentDetails?.filter((item : any) => item.checked);
  if(checkedFiles) return checkedFiles?.length > 0;
  return false;
}
)

const getDetail = async () => {
  let params = query;
  try {
    const res: any = await getShareFileDetail(params);
    if(res.status) {
      shareFileDetail.value = res.data;
      // add file checked status
      if(shareFileDetail.value && shareFileDetail.value.fileAttachmentDetails) {
        shareFileDetail.value = {
            ... shareFileDetail.value,
            fileAttachmentDetails:  shareFileDetail.value.fileAttachmentDetails.map((item : any) => {
            return {
              ... item,
              checked: false
            }
          })
        }
      }
    }
    else {
      message.error(t('faq-detail.user_not_permission'));
      await router.push('/sharefiles/search');
      return;
    }
  } catch (error) {
    message.error(t('faq-detail.user_not_permission'));
    await router.push('/sharefiles/search');
    return;
  }
};

onMounted(async () => {
  isLoading.value = true;
  await getDetail();
  isLoading.value = false
})

const navigatorTop = () => {
  router.push('/top');
};

const handleNavigateToEdit = () => {
  router.push({
    path: '/sharefiles/edit',
    query: {
      shareFileNumber: route.query.shareFileNumber
    }
  })
}

// Demo use to open download popup, can use for FAQ url
// const handleDownload = () => {
//   shareFileDataDownload.value = shareFileDetail.value;

//   // Pass data to download share file screen
//   shareFileDataDownload.value = {
//     ... shareFileDataDownload.value,
//     fileAttachmentDetails:  shareFileDataDownload.value.fileAttachmentDetails.map((item : any) => {
//       return {
//         ... item,
//         checked: false
//       }
//     })
//   }
//   isShowDownload.value = true;
// }

const handleDownload = async () => {
  let fileCheckedList = shareFileDetail.value?.fileAttachmentDetails?.filter((item : any) => {
    return item.checked
  }).map((item : any) =>  {
    return {
      fileId: item.fileId,
      fileName: item.fileName
    }
  })

  if(fileCheckedList) {
    for(let file of fileCheckedList) {
      const params = {
        fileId: file.fileId
      };
      const fileDownloaded: any = await downloadFiles(params);
      var blob = new Blob([fileDownloaded], {
        type: 'application/x-www-form-urlencoded; charset=UTF-8'
      });
      const downloadLink = window.document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = file.fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
   }
  }
}

const handleCloseDownloadPopup = () => {
  isShowDownload.value = false;
}

const handleCopyLink = () => {
  message.success("Copy link share file!")
  if(shareFileDetail.value?.shareFileNumber) {
    navigator.clipboard.writeText(shareFileDetail.value?.shareFileNumber);
  }
}


</script>

<template>
  <page-layout :is-loading="isLoading">
    <div class="main-page">
      <!-- Navigation section -->
      <div class="navigation">
        <a-button class="return-button" type="text" @click="navigatorTop">
          <left-outlined />
          <div class="ml-21 d-inline-block">
            {{ $t('sharefile.backtoTop') }}
          </div>
        </a-button>

        <div class="navigation-btn-group">
          <a-button type="primary"
            :disabled="isDisableBtn"
            :class="{
              'btn-common btn-rounned': !isDisableBtn,
              'btn-disable btn-rounned': isDisableBtn
            }"
            @click="handleCopyLink"
            >
            {{ $t('sharefile.download.copyLink') }}
          </a-button>
            <a-button
              :disabled="!shareFileDetail?.editStatus"
              type="primary"
              :class="{
              'btn-common btn-rounned': shareFileDetail?.editStatus,
              'btn-disable btn-rounned': !shareFileDetail?.editStatus
            }"
              @click="handleNavigateToEdit">
              {{ $t('sharefile.button.edit') }}
            </a-button>
        </div>
      </div>

      <div class="main-title page-title">{{ $t('sharefile.download.pageTitle') }}</div>

      <!-- Content block -->
      <div class="card title-section">
        <div class="title line-break">{{ shareFileDetail?.title }}</div>

        <hr class="hr-style" />

        <div class="description">
          <div class="description-content line-break"> {{ shareFileDetail?.description }}</div>
        </div>
        <hr class="hr-style" />

        <!-- file attachment -->
        <div class="list-files">
          <div class="lbl-list-file">
            <TitleTag class="tag-default">{{ $t('sharefile.fileTag') }}</TitleTag>
          </div>

          <!-- list file -->
          <div class="list-file-wrap">
            <ul class="list-file-download" v-for="(file, index) in shareFileDetail?.fileAttachmentDetails" :key="index">
              <li>
                <a-checkbox
                  class="file-download"
                  v-model:checked="file.checked">
                </a-checkbox>
                <a class="file line-break">{{ file.fileName }}  ({{ convertSize(file.fileSize) }})</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="container position-relative">
        <div class="page-top">
          <div class="page-nav">
              <a-button
                type="primary"
                :class="{
                  'btn-common btn-rounned': isAbleDownloadBtn,
                  'btn-disable btn-rounned': !isAbleDownloadBtn
                }"
                :disabled="!isAbleDownloadBtn"
                @click="handleDownload"
                >
                {{ $t('sharefile.button.download') }}
              </a-button>
          </div>
        </div>
      </div>
      <!-- <DownloadShareFile :status="isShowDownload" @cancel="handleCloseDownloadPopup" :data="shareFileDataDownload"/> -->
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
}

.page-top {
  padding-right: 0;
}

.period-span {
  color: #eb3535;
}

.main-title {
  margin: 35px 0px !important;
}

.hr-style {
  opacity: 0.25;
  margin-bottom: 15px;
}

.list-files {
  display: flex;
  gap: 10px;
  margin-top: 30px;
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

.file {
  text-decoration: underline;
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.5px;
  text-align: left;
}

.card> ::v-deep(.ant-row) {
  margin-bottom: 10px;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px 50px;
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
  font-size: 24px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.5px;
  text-align: left;
  margin-bottom: 20px;
}

.description {
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.5px;
  margin: 20px 0;
}


.description-content {
  white-space: pre-line;
}

.card ::v-deep(.ant-form-item) {
  width: 100%;
  margin: 0;
}

.card ::v-deep(.ant-input-number-lg) {
  border-radius: 5px;
  overflow: hidden;
}

.list-file-download {
  list-style-type: none;
  margin-left: 30px;
}

.lbl-list-file {
  font-weight: 700;
  flex: 3;
}

.list-file-wrap {
  flex: 20;
}

.file-download {
  margin: 0 10px;
}


::v-deep(.ant-checkbox-wrapper .ant-checkbox-inner) {
  border-color: rgba(55, 71, 79, 0.9);
}
</style>
