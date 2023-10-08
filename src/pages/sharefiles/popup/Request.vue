<script setup lang="ts">
import RequiredTag from '@/components/common/RequiredTag.vue';
import { ref } from 'vue';
import type { RequestForm } from '@/types/interfaces/sharefile';
import type { FormInstance } from 'ant-design-vue';
import { assignShareFile } from '@/api/shareFile.api';
import { message } from 'ant-design-vue';
import router from '@/router';
const props = defineProps({
  status: {
    type: Boolean,
    required: true
  },
  listAssigner: {
    type: Array,
    required: true,
    default() {
      return [];
    }
  },
  shareFile: {
    type: Object,
    required: true
  }
});

const formRef = ref<FormInstance>();

const formState = ref<RequestForm>({
  assignUsers: [],
  comment: ''
});

const emits = defineEmits(['cancel']);
const isDisabledBtn = ref<boolean>(false);
const xsSizeLeft = ref<number>(18);
const xsSizeRight = ref<number>(23);

const smSizeLeft = ref<number>(4);
const smSizeRight = ref<number>(20);

const mdSizeLeft = ref<number>(4);
const mdSizeRight = ref<number>(20);

const handleClose = () => {
  formState.value.assignUsers = [];
  formState.value.comment = '';
  formRef.value?.clearValidate();
  emits('cancel');
};

const checkValidateAll = async () => {
  try {
    return await formRef.value?.validateFields();
  } catch (error) {
    console.log(error);
  }
};

const handleOK = async () => {
  isDisabledBtn.value = true;
  await checkValidateAll();

  if (!formState.value.assignUsers.length || formState.value.comment.length > 2000) {
    isDisabledBtn.value = false;
    return;
  }

  const data = {
    shareFileNumber: props.shareFile.fileNumber,
    listUserIdAssigner: formState.value.assignUsers,
    comment: formState.value.comment
  };
  return await assignShareFile(data)
    .then((response: any) => {
      message.success(response.message);
      router.push('/sharefiles/search');
    })
    .catch((error) => {
      isDisabledBtn.value = false;
      message.error(error.response.data.message);
      Promise.reject(error);
    });
};

const handleChangeAssignUsers = (value: any[]) => {
  formState.value.assignUsers = value;
};
</script>

<template>
  <a-modal :visible="props.status" centered :footer="null" :closable="false">
    <div class="main-page">
      <div class="card">
        <!-- Page header -->
        <div class="section-header">{{ $t('sharefile.request.pageTitle') }}</div>

        <!-- Destination -->
        <a-form ref="formRef" :model="formState">
          <a-row>
            <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft">
              <div class="title">
                {{ $t('sharefile.request.destination') }}
              </div>
              <div style="display: inline-block; margin-left: 20px">
                <RequiredTag />
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-form-item
                :name="'assignUsers'"
                class="answer-restriction"
                :rules="[
                  {
                    required: true,
                    message: $t('sharefile.request.destination') + $t('faq-create.required'),
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <a-select
                  v-model:value="formState.assignUsers"
                  size="large"
                  show-search
                  mode="multiple"
                  class="answer-company"
                  @change="(value: any[]) => handleChangeAssignUsers(value)"
                >
                  <a-select-option
                    v-for="(item, index) in listAssigner"
                    :key="index"
                    :value="item.userId"
                  >
                    {{ item.lastName + ' ' + item.firstName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

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
                <a-textarea v-model:value="formState.comment" :rows="4" size="large"> </a-textarea>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <!-- Button-->
        <div class="btn-group">
          <a-button
            type="primary"
            class="btn-common btn-rounned"
            @click="handleOK"
            :disabled="isDisabledBtn"
          >
            {{ $t('sharefile.request.button.ok') }}
          </a-button>

          <a-button
            class="btn-common btn-rounned btn-cancel"
            @click="handleClose"
            :disabled="isDisabledBtn"
          >
            {{ $t('sharefile.request.button.cancel') }}
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

.section-header {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 40px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.87);
  margin-bottom: 20px;
}

.title {
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
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

.btn-group {
  align-items: center;
  justify-content: center;
  display: flex;
  margin-top: 30px;
  gap: 10px;
}
</style>

<style>
.btn-cancel {
  background: #b8b8b8;
  color: #474747;
}

.card ::v-deep(.ant-input) {
  border-radius: 5px;
}

.card ::v-deep(.ant-select-selector) {
  border-radius: 5px;
}
</style>
