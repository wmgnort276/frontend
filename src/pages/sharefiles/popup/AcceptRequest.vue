<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { computed, ref } from 'vue';
import type { AcceptRequestForm } from '@/types/interfaces/sharefile';
import { approvedShareFile, feedbackShareFile } from '@/api/shareFile.api';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import table from '@/stores/mixins/table';
import router from '@/router';
const props = defineProps({
  status: {
    type: Boolean,
    required: true
  },
  shareFile: {
    type: Object,
    required: true
  },
  histories: {
    type: Array,
    required: true,
    default() {
      return [];
    }
  }
});

const emits = defineEmits(['cancel']);
const isDisable = ref<boolean>(false);
const xsSizeLeft = ref<number>(18);
const xsSizeRight = ref<number>(23);

const smSizeLeft = ref<number>(4);
const smSizeRight = ref<number>(20);

const mdSizeLeft = ref<number>(4);
const mdSizeRight = ref<number>(20);
const formRef = ref<FormInstance>();

const handleClose = () => {
  formState.value.comment = '';
  formRef.value?.clearValidate();
  emits('cancel');
};

const formState = ref<AcceptRequestForm>({
  comment: null
});

const tableFormat = computed(() => {
  return table;
});

const columns = [
  {
    title: t('sharefile.history.table.timeProcess'),
    key: 'timeProcess',
    width: '200px'
  },
  {
    title: t('sharefile.history.table.processUser'),
    key: 'processUser',
    width: '150px'
  },
  {
    title: t('sharefile.history.table.processStatus'),
    key: 'processStatus',
    width: '150px'
  },
  {
    title: t('sharefile.history.table.assignedTo'),
    key: 'assignedTo',
    width: '150px'
  },
  {
    title: t('sharefile.history.table.comment'),
    key: 'comment',
    width: '250px',
    ellipsis: true
  }
];

const handleReject = async () => {
  isDisable.value = true;

  if (formState.value.comment && formState.value.comment.length > 2000) {
    isDisable.value = false;
    return;
  }

  const data = {
    shareFileNumber: props.shareFile.fileNumber,
    comment: formState.value.comment
  };

  return await feedbackShareFile(data)
    .then((response: any) => {
      message.success(response.message);
      router.push('/sharefiles/search');
      return;
    })
    .catch((error) => {
      isDisable.value = false;
      message.error(error.response.data.message);
      Promise.reject(error);
    });
};

const handleSharefile = async () => {
  isDisable.value = true;

  if (formState.value.comment && formState.value.comment.length > 2000) {
    isDisable.value = false;
    return;
  }

  const data = {
    shareFileNumber: props.shareFile.fileNumber,
    comment: formState.value.comment
  };

  return await approvedShareFile(data)
    .then((response: any) => {
      message.success(response.message);
      router.push('/sharefiles/search');
      return;
    })
    .catch((error) => {
      isDisable.value = false;
      message.error(error.response.data.message);
      Promise.reject(error);
    });
};
</script>

<template>
  <a-modal :visible="props.status" centered :footer="null" :closable="false">
    <div class="main-page">
      <div class="card">
        <!-- Page header -->
        <div class="navigation">
          <div class="section-header">{{ $t('sharefile.acceptRequest.title') }}</div>
          <div>
            <a-button type="primary" class="btn-close" @click="handleClose">{{
              $t('sharefile.acceptRequest.button.close')
            }}</a-button>
          </div>
        </div>

        <!-- Form -->
        <a-form ref="formRef" :model="formState">
          <!-- Comment -->
          <a-row>
            <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft">
              <div class="title">
                {{ $t('sharefile.request.comment') }}
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-form-item
                name="comment"
                :rules="[
                  {
                    max: 2000,
                    message: $t('sharefile.request.comment') + $t('sharefile.maxlength'),
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <a-textarea v-model:value="formState.comment" :rows="3" size="large"> </a-textarea>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>

        <!-- Table title -->
        <div class="title">
          <span>
            {{ $t('sharefile.history.table.title') }}
          </span>
        </div>

        <!-- Table data -->
        <div class="history-table">
          <a-table
            class="ant-table-striped"
            size="middle"
            :columns="columns"
            :data-source="histories"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'timeProcess'">
                <div>
                  <span class="table-data">
                    {{ tableFormat.formatDate(new Date(record.timeProcess), 'YYYY/MM/DD HH:mm') }}
                  </span>
                </div>
              </template>

              <template v-else-if="column.key === 'processUser'">
                <span class="table-data">
                  {{ record.processUser }}
                </span>
              </template>

              <template v-else-if="column.key === 'processStatus'">
                <span class="table-data">
                  {{ record.processStatus }}
                </span>
              </template>

              <template v-else-if="column.key === 'assignedTo'">
                <span class="table-data">
                  {{ record.assignedTo }}
                </span>
              </template>

              <template v-else-if="column.key === 'comment'">
                <span class="table-data">
                  {{ record.comment }}
                </span>
              </template>
            </template>
          </a-table>
        </div>

        <!-- Button-->
        <div class="btn-group">
          <a-button
            type="primary"
            class="btn-common btn-rounned btn-reject"
            @click="handleReject"
            :disabled="isDisable"
          >
            {{ $t('sharefile.acceptRequest.button.reject') }}
          </a-button>

          <a-button
            type="primary"
            class="btn-common btn-rounned"
            @click="handleSharefile"
            :disabled="isDisable"
          >
            {{ $t('sharefile.acceptRequest.button.shareFile') }}
          </a-button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
@import './../../../assets/styles/common.css';
@import './../../../assets/styles/page.css';
@import './../../../assets/styles/button.css';

.main-page {
  max-width: 1120px;
  margin: 0 auto;
}

.navigation {
  margin-bottom: 10px;
}

.section-header {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 40px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.87);
}

.title {
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.95);
  margin-bottom: 20px;
}

::v-deep(.ant-table-pagination.ant-pagination) {
  display: none;
}

::v-deep(.ant-table-thead > tr > th) {
  background-color: #cfd8dc;
  font-weight: 700;
  font-size: 15px;
  line-height: 20px;
  padding: 10px 16px !important;
  color: #37474f;
}

::v-deep(.ant-table-tbody > tr > td) {
  padding: 10px 16px !important;
}

.history-table {
  margin-left: 20px;
}

.table-data {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.87);
}

.btn-group {
  align-items: center;
  justify-content: center;
  display: flex;
  margin-top: 30px;
  gap: 10px;
}

.btn-reject {
  padding: 0px 40px;
}

.btn-close {
  border-radius: 5px;
}
</style>

<style>
.ant-modal {
  min-width: 1120px !important;
}
</style>
