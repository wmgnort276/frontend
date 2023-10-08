<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { ref, computed } from 'vue';
import type { UploadChangeParam } from 'ant-design-vue';
import Upload from '../icon/Upload.vue';
import Delete from '../icon/Delete.vue';
import Download from '../icon/Download.vue';
import type { File, CustomUploadOptions } from '@/types/interfaces/faq';
import type { UploadProps } from 'ant-design-vue';
import { downloadFiles } from '@/api/file.api';
import { convertSize } from '@/utils';

const emit = defineEmits(['changeData', 'changeUpload', 'update:files']);
const props = defineProps({
  files: {
    type: Array<File>,
    default: []
  },
  isShowDownloadBtn: {
    type: Boolean,
    default: false
  },
  size: {
    type: Number
  },
  multiple: {
    type: Boolean,
    default: true
  },
  isUserAssign: {
    type: Boolean,
    default: false
  },
  attachmentList: {
    type: Array<string>,
    default: []
  }
});

const fileCount = computed(() => {
  return props.files.length;
});

const disabled = computed(() => {
  return props.size && props.files.length >= props.size;
});

const handleChange = function (info: UploadChangeParam<File>) {
  const minSize: number = 0;
  const maxSize: number = 10485760;
  const file = info.file;
  if(info.fileList.length > 1 && info.fileList.filter(o => o.name === file.name).length > 1) {
    message.error(`${file.name} file is duplicated`);
  } else if (file.size > maxSize) {
    message.error(`${file.name} file is bigger than 10MB`);
  } else {
    emit('update:files', info.fileList);
  }

  if (props.attachmentList?.length) {
    const fileName = info.file.name;
    const fileType = fileName.split('.');
    if (props.attachmentList?.includes(fileType[fileType.length - 1])) {
      message.error(`${fileName} file upload is not supported`);
    }
  }
};

const beforeUpload = (file: UploadProps) => {
  // block call api push file
  return false;
};


function handleRemove(file: File) {
  const filesChange = props.files;
  const index = filesChange.indexOf(file);
  if (index !== -1) {
    filesChange.splice(index, 1);
  }
  emit('update:files', filesChange);
}
function handleCustomRequest(options: CustomUploadOptions): void {
  const fileReader = new FileReader();
  fileReader.onload = (event) => {
    const result = event.target?.result as string;
    options.onSuccess(result);
  };
  fileReader.onerror = (event) => {
    options.onError(new Error('Upload failed'));
  };
}
async function handleDownload(file: any) {
  if (file != undefined) {
    if (file.fileId) {
      const params = {
        fileId: file.fileId
      };
      const fileDownloaded: any = await downloadFiles(params);

      var blob = new Blob([fileDownloaded], {
        type: 'application/x-www-form-urlencoded; charset=UTF-8'
      });
      const downloadLink = window.document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = file.name;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      message.warning("Uploaded file has not been saved, can't download");
    }
  }
}
</script>
<template class="font">
  <div>
    <a-upload-dragger
      :fileList="props.files"
      name="file"
      :multiple="multiple"
      :show-upload-list="false"
      @change="handleChange"
      @download="handleDownload"
      :before-upload="beforeUpload"
      :disabled="disabled || isUserAssign"
    >
      <template #default>
        <div v-if="fileCount > 0">
          <div v-for="(f, index) in props.files" :key="index">
            <a-row type="flex">
              <a-col :span="22">
                <div class="file-name long-text">
                  {{ `${f.name} (${convertSize(Number(f.size))})` }}
                </div>
              </a-col>
              <a-col :span="2" justify="start">
                <div class="f-r">
                  <Delete class="delete" @click.stop="handleRemove(f)" />
                  <Download
                    class="ml-15 download"
                    v-if="props.isShowDownloadBtn"
                    @click.stop="handleDownload(f)"
                  />
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
        <div class="mt-30" v-else>
          <Upload />
          <p class="drag-text text-gray-01">{{ $t('faq.upload.placehoderDragger') }}</p>
        </div>
      </template>
    </a-upload-dragger>

    <a-upload
      class="upload-btn"
      :fileList="props.files"
      :multiple="multiple"
      @change="handleChange"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :disabled="disabled || isUserAssign"
    >
      <a-button
        :disabled="disabled"
        class="btn btn-text-medium border-none add-rounded"
        :class="{ disable: disabled }"
      >
        <plus-outlined />
        <span>
          {{ $t('faq.upload.button.upload') }}
        </span>
      </a-button>
    </a-upload>
  </div>
</template>

<style scoped>
@import './../../assets/styles/common.css';
@import './../../assets/styles/page.css';

.drag-text {
  line-height: 24px;
  margin-top: 10px;
  font-weight: 400;
}

.file-name {
  text-decoration: underline;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  text-align: start;
  color: rgba(55, 71, 79, 0.87);
  margin-bottom: 10px;
  max-width: 650px;
}

.item-upload {
  padding-left: 15px;
  color: #37474f;
}

.text-button {
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}

::v-deep(a) {
  padding-left: 15px;
  color: #37474f;
}

::v-deep(.ant-upload.ant-upload-drag .ant-upload) {
  padding: 8px 22px !important;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.5px;
  min-height: 150px;
  background: rgba(0, 0, 0, 0.2);
  overflow: auto;
  width: 100%;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.42);
  border-radius: 4px;
}

.ant-btn > .anticon {
  display: flex !important;
}

.btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 15px;
  background: #1976d2;
  border-radius: 16px;
  font-size: 16px;
  line-height: 24px;
  color: #fff;
  cursor: pointer;
  margin-top: 10px;
}

.disable {
  background: rgba(0, 0, 0, 0.12) !important;
  cursor: not-allowed;
}
.delete:hover,
.download:hover {
  cursor: pointer !important;
}
</style>
