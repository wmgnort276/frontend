<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { ref, computed } from 'vue';
import PageLayout from '@/pages/layouts/PageLayout.vue';
import type { FileAttachment, ShareFileDetail } from '@/types/interfaces/sharefile';
import { convertSize } from '@/utils/index';
import { downloadFiles } from '@/api/file.api';
const props = defineProps({
  status: {
    type: Boolean,
    required: true
  },
  data: {
    type: Object as () =>  ShareFileDetail,
    required: true
  }
});

const emits = defineEmits(['cancel']);

let loading = ref<boolean>(false);

const isAbleDownloadBtn = computed(() => {
  let checkedFiles : FileAttachment[] | undefined = props.data.fileAttachmentDetails?.filter((item : any) => item.checked);
  if(checkedFiles) return checkedFiles?.length > 0;
  return false;
}
)

const handleDownload = async () => {
  // Get list of chosen share files
  let fileCheckedList = props.data.fileAttachmentDetails?.filter((item : any) => {
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


const handleClose = () => {
  emits('cancel');
};


</script>

<template>
  <a-modal :visible="props.status" centered :footer="null" :closable="false">
    <div class="main-page">
       <!-- Content block -->
    <div class="title-section">
      <div class="title">{{ data?.title }}</div>

      <hr class="hr-style" />

      <div class="description">
        <span>{{ data?.description }}</span>
      </div>
      <hr class="hr-style" />

      <!-- file attachment -->
      <div class="list-files">
        <div class="lbl-list-file">
          <TitleTag class="tag-default">{{ $t('sharefile.fileTag') }}</TitleTag>
        </div>

        <!-- list file -->
        <div class="list-file-wrap">
          <ul class="list-file-download" v-for="(file, index) in data?.fileAttachmentDetails" :key="index">
            <li class="file-wrap">
              <a-checkbox
                v-model:checked="file.checked"
              ></a-checkbox>
              <a class="file">{{ file.fileName }} ({{ convertSize(file.fileSize) }})</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Button-->
    <div class="btn-group">
        <a-button type="primary" 
        :class="{
            'btn-common btn-rounned': isAbleDownloadBtn,
            'btn-disable btn-rounned': !isAbleDownloadBtn
        }"
        @click="handleDownload" 
        :disabled="!isAbleDownloadBtn">
            {{ $t('sharefile.button.download') }}
        </a-button>
        <a-button type="primary" class="btn-common btn-rounned" @click="handleClose">
            {{ $t('sharefile.history.closeButton') }}
        </a-button>
    </div>
    </div>
  </a-modal>
</template>

<style scoped>
@import './../../../assets/styles/common.css';
@import './../../../assets/styles/page.css';
@import './../../../assets/styles/button.css';

.card > ::v-deep(.ant-row) {
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
  line-height: 40px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.87);
  margin-bottom: 20px;
}

.history-table {
  margin-left: 20px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.5px;
  text-align: left;
  margin-bottom: 20px;
}

.hr-style {
  opacity: 0.25;
  margin-bottom: 15px;
}

.description {
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.5px;
  margin: 20px 0;
}

.list-files {
  display: flex;
  gap: 10px;
  margin-top: 30px;
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

.file {
  text-decoration: underline;
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.5px;
  text-align: left;
}

.list-file-wrap {
  flex: 20;
}

.list-file-download {
  list-style-type: none;
  margin-left: 30px;
}

.file-wrap {
    display: flex;
    gap: 10px;
}

.btn-group {
  align-items: center;
  justify-content: center;
  display: flex;
  margin-top: 30px;
  gap: 20px;
}

</style>

<style>
.ant-modal {
  min-width: 1200px !important;
}
</style>
