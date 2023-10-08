<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';
import type { FormInstance } from 'ant-design-vue';
import type { SelectProps } from 'ant-design-vue';
import { useContactStore } from '@/stores/contact.store';
import router from '@/router';
import { EmailField } from '@/stores/constants/constant';
import type { Rule } from 'ant-design-vue/es/form';
import { useAuthStore } from '@/stores/auth.store';
import LeftOutlined from '@/components/icon/LeftOutlined.vue';
import { message } from 'ant-design-vue';
import { t } from '@/plugins/i18n';
import ConfirmDialog from '@/components/common/dialog/ConfirmDialog.vue';
import type { ContactType } from '@/types/interfaces/contact';
const loading = ref<boolean>(false);
const selectSize = ref<SelectProps['size']>('large');
const formRef = ref<FormInstance>();
const form = useContactStore();
const userStore = useAuthStore();
let isDisableEmailSelect = ref<boolean>(false)
let confirmBack = ref<boolean>(false);

const duplicateValidate = (_rule: Rule, value: string) => {
  if (value !== form.form.editMail) {
    return Promise.reject('Dont match');
  } else {
    return Promise.resolve();
  }
};
const registedValidate = async (_rule: Rule, value: string) => {
  if (form.cbMailSelected === EmailField.Registed) {
    if (!value || !/\S+@\S+\.\S+/.test(value)) {
      return Promise.reject('Please select a valid email address');
    }
  }
  return Promise.resolve();
};
const editValidate = (_rule: Rule, value: string) => {
  if (form.cbMailSelected === EmailField.Edit) {
    if (!value || !/\S+@\S+\.\S+/.test(value)) {
      return Promise.reject('Please input a valid email address');
    }
  }
  return Promise.resolve();
};

const handleShowConfirmBack = () => {
  confirmBack.value = true;
}

const handleBackToTop = () => {
  form.clearForm();
  router.push("/top");
}

const redirectToPreview = async () => {
  try {
    await formRef.value!.validate();
    if (form.cbMailSelected === EmailField.Registed) {
      form.form.userEmail = form.form.selectedMail;
    } else {
      form.form.userEmail = form.form.editMail;
    }

    let contactType = form.contactTypes.filter((item : ContactType) => item.contactTypeCode == form.form.contactTypeCode)
    form.form.contactTypeName = contactType[0]?.contactTypeName;

    router.push('/contact/preview');
  } catch (err) {
    console.log(err);
  }
};

const allowRelatedCode = (event : any) => {
  const allowedCharacters  = /^[a-zA-Z0-9-_]+$/
  const keyPressed = String.fromCharCode(event.keyCode);
  if (!allowedCharacters.test(keyPressed)) {
        event.preventDefault();
  }
}

const handlePaste = (event : ClipboardEvent) => {
  const clipboardData = event.clipboardData;
  const pastedText = clipboardData?.getData('text');

  const allowedCharacters = /^[a-zA-Z0-9-_]+$/;

  if (!allowedCharacters.test(pastedText!)) {
        event.preventDefault();
  }
}

const handleCheckMailSelected = () => {
  form.cbMailSelected = EmailField.Registed;
  form.form.mailConfirm = null;
  form.form.editMail = null;
  formRef.value?.validateFields(['editMail']);
}

const handleCheckMailEdit = () => {
  form.cbMailSelected = EmailField.Edit;
  form.form.selectedMail = null;
  formRef.value?.validateFields(['selectedMail']);
}

onMounted(async () => {
  loading.value = true;
  let isManager = userStore.isUserEmployee();
  if (!isManager) {
    message.error(t('contact.noPermission'));
    await router.push('/top');
    return;
  }
  await form.getContactInfo();
  
  await form.getUserEmailsData().then(res => {
    if(!res)  {
      message.error(t('contact.response.getEmailFail'))
    }
  });

  await form.getContactTypesData().then(res => {
    if(!res)  {
      message.error(t('contact.response.getContactTypeFail'))
    }
  });

  isDisableEmailSelect.value = !form.userEmails.length && !form.form.selectedMail;
  loading.value = false;
});
</script>

<template>
  <page-layout :is-loading="loading">
    <div class="main-page">
      <div class="navigation">
        <div class="header">
          <a-button type="link" @click="handleShowConfirmBack" class="return-button btn-nav-back">
            <template #icon>
              <LeftOutlined />
            </template>
            <div class="ml-21 d-inline-block"> {{ $t('contact.backToSearchScreen') }} </div>
          </a-button>
        </div>
      </div>
      <div class="page-title">{{ $t('contact.pageTitle') }}</div>
      <a-form :model="form.form" ref="formRef">
        <div class="card-wrapper">

          <!-- UserId -->
          <div class="contact-item">
            <label class="label" for="">{{ $t('contact.creatorId.title') }}</label>
            <a-form-item name="creatorId">
              <a-input disabled class="input" v-model:value="form.form.creatorId"></a-input>
            </a-form-item>
          </div>

          <!-- UserName -->
          <div class="contact-item">
            <label class="label" for="">{{ $t('contact.creatorName.title') }}</label>
            <a-form-item name="creatorName">
              <a-input disabled class="input" v-model:value="form.form.creatorName"></a-input>
            </a-form-item>
          </div>

          <!-- Mail section -->
          <div class="contact-item">
            <div class="d-flex label m-t-25">
              <label class="fs-20 label flex-1" for="">{{
                $t('contact.userEmail.title')
              }}</label>
              <div class="required">
                <span class="mail-required">{{ $t('contact.required') }}</span>
              </div>
            </div>
            <a-radio-group class="radio-wrapper" v-model:value="form.cbMailSelected">
              <a-radio 
                class="radio-btn" 
                :value="EmailField.Registed"
                @click="handleCheckMailSelected"
                >{{ $t('contact.userEmail.checkboxRegistedMail') }}
              </a-radio>
              <a-form-item
                name="selectedMail"
                :rules="[
                  {
                    validator: registedValidate,
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <a-select
                  :disabled="form.cbMailSelected === EmailField.Edit 
                              || isDisableEmailSelect "
                  class="input full-width fs-18 mb-20"
                  placeholder="t_suzuki@sample.com"
                  :size="selectSize"
                  v-model:value="form.form.selectedMail"
                >
                  <a-select-option
                    v-for="(item, index) in form.userEmails"
                    :key="index"
                    :value="item.userEmail"
                  >
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-radio 
                class="radio-btn" 
                :value="EmailField.Edit"
                @click="handleCheckMailEdit"
                >{{ $t('contact.userEmail.checkboxEditMail') }}
              </a-radio>
              <a-form-item
                name="editMail"
                :rules="[
                  {
                    validator: editValidate,
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <a-input
                  :disabled="form.cbMailSelected === EmailField.Registed"
                  :placeholder="$t('contact.userEmail.placeholder.inputMail')"
                  class="input mb-10"
                  v-model:value="form.form.editMail"
                ></a-input>
              </a-form-item>
              <a-form-item
                name="mailConfirm"
                :rules="[
                  {
                    validator: duplicateValidate,
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <a-input
                  :disabled="form.cbMailSelected === EmailField.Registed"
                  :placeholder="$t('contact.userEmail.placeholder.confirmMail')"
                  class="input"
                  v-model:value="form.form.mailConfirm"
                ></a-input>
              </a-form-item>
            </a-radio-group>
          </div>

          <!-- Contact domain / contact types -->
          <div class="contact-item">
            <div class="label jus-start">
              <label class="fs-20" for="">{{ $t('contact.contactType.title') }}</label>
              <div class="required">
                <span>{{ $t('contact.required') }}</span>
              </div>
            </div>
            <a-form-item
              name="contactTypeCode"
              :rules="[{ required: true, message: $t('contact.contactType.required') }]"
            >
              <a-select
                class="input full-width fs-18"
                @change="(v:any)=>form.onContactTypeSelected(v)"
                :placeholder="$t('contact.contactType.placeholder')"
                :size="selectSize"
                v-model:value="form.form.contactTypeCode"
              >
                <a-select-option
                  v-for="(item, index) in form.contactTypes"
                  :key="index"
                  :value="item.contactTypeCode"
                >
                  {{ item.contactTypeName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="contact-item">
            <label class="label" for="">{{ $t('contact.contactDomain.title') }}</label>
            <a-form-item name="contactDomain">
              <a-input disabled class="input" v-model:value="form.form.contactDomain"></a-input>
              <div class="example">
                <div>{{ $t('contact.contactDomain.hintContent') }}</div>
                <div>{{ $t('contact.contactDomain.hintRequired') }}</div>
              </div>
            </a-form-item>
          </div>
        </div>

        <!-- Contact content section -->
        <div class="card-wrapper">
          <div class="contact-item">
            <div class="label jus-start">
              <label style="font-size: 20px" for="">{{ $t('contact.titleMail') }}</label>
              <div class="required">
                <span>{{ $t('contact.required') }}</span>
              </div>
            </div>
            <a-form-item
              name="titleMail"
              :rules="[{ required: true, message: $t('contact.titleMailRequired') }]"
            >
              <a-input class="input" v-model:value="form.form.titleMail"></a-input>
            </a-form-item>
          </div>
          <div class="contact-item">
            <div class="label jus-start">
              <label class="fs-20" for="">{{ $t('contact.contentMail') }}</label>
              <div class="required">
                <span>{{ $t('contact.required') }}</span>
              </div>
            </div>
            <a-form-item
              name="contentMail"
              :rules="[{ required: true, message: $t('contact.contentMailRequired') }]"
            >
              <a-textarea
                class="textarea"
                v-model:value="form.form.contentMail"
                :rows="4"
              />
            </a-form-item>
          </div>

          <!-- Related code section-->
          <div class="contact-item">
            <div class="label jus-start">
              <label class="fs-20" for="">{{ $t('contact.relatedCode.title') }}</label>
            </div>
            <a-form-item
              name="relatedCode"
            >
              <a-input
                v-model:value="form.form.relatedCode"
                :placeholder="$t('contact.relatedCode.placeHolder')"
                @keypress="allowRelatedCode"
                @paste="handlePaste" 
              />
            </a-form-item>
          </div>
        </div>

        <div class="btn">
          <a-button class="btn-white" @click="handleShowConfirmBack">
            <span style="color: #1976d2" class="btn-text">{{ $t('contact.cancel') }}</span>
          </a-button>
          <a-button
            type="primary"
            @click="redirectToPreview"
            class="btn-primary"
            html-type="submit"
          >
            <span style="color: #fff" class="btn-text">{{ $t('contact.confirm') }}</span>
          </a-button>
        </div>
      </a-form>
    </div>
  </page-layout>
  <confirm-dialog
    v-model:visible="confirmBack"
    :show-cancel="true"
    :message="$t('contact.popup.cancel.message')"
    :ok-title="$t('common.popup.confirm')"
    :cancelTitle="$t('common.popup.cancel')"
    :type="'right'" @ok="() => {
      handleBackToTop();
    }">
  </confirm-dialog>
</template>

<style lang="scss" scoped>
@import './../../assets/styles/common.css';
@import './../../assets/styles/page.css';
@import './../../assets/styles/button.css';

.navigation {
  display: flex;
  justify-content: space-between;
  margin-bottom: 35px;
  gap: 20px;
  flex-wrap: wrap;
}

.contact-item {
  display: flex;
  width: -webkit-fill-available;
}

.contact-item .label {
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 40px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.87);
  width: 230px;
}

label-text {
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 40px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.87);
}

.ant-input {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 19px;
  padding: 8px 12px;
  gap: 10px;
  height: 40px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.42);
  border-radius: 4px;
}

.ant-input-disabled {
  color: rgba(55, 71, 79, 0.87);
  background: #ededed;
}

.required {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 40px;
  color: rgba(255, 6, 6, 0.95);
  margin-left: 10px;
}

.btn-text {
  font-style: normal;
  font-weight: 500;
  font-size: 20px !important;
  line-height: 36px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 1.25px;
  text-transform: uppercase;
}

.ant-btn-text:focus,
.ant-btn-text:hover {
  background: transparent;
}

.textarea {
  height: auto;
}

::v-deep .ant-select:not(.ant-select-customize-input) .ant-select-selector {
  border-radius: 4px;
}

::v-deep .ant-radio-inner {
  width: 20px;
  height: 20px;
  font-family: 'Font Awesome 6 Free';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  color: rgba(55, 71, 79, 0.9);
  border: 2px solid rgba(55, 71, 79, 0.9);
}
.radio-wrapper {
  display: flex;
  flex-direction: column;
  width: -webkit-fill-available;
}

::v-deep .ant-radio:hover .ant-radio-inner {
  border-color: #000;
}
::v-deep .ant-radio.ant-radio-checked {
  color: #000;
  outline: none;
}
.radio-btn {
  margin-bottom: 10px;
  font-weight: 400;
  font-size: 18px;
  line-height: 32px;
  color: rgba(55, 71, 79, 0.9);
}

</style>
