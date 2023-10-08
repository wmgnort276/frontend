<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';
import LeftOutlined from '@/components/icon/LeftOutlined.vue';
import { useContactStore } from '@/stores/contact.store';
import router from '@/router';
import ConfirmDialog from '@/components/common/dialog/ConfirmDialog.vue';
import { createContact } from '@/api/contact.api';
import { message } from 'ant-design-vue';
import { t } from '@/plugins/i18n';

const loading = ref<boolean>(false);
const form = useContactStore();
const redirectToInput = () => {
  router.push('/contact');
};
const visible = ref<boolean>(false);
const showModal = () => {
  visible.value = true;
};
const hideModal = () => {
  visible.value = false;
};

const handleCreateContact = async () => {
  loading.value = true;
  const param = {
    userEmail: form.form.userEmail,
    contactType: form.form.contactTypeCode,
    titleMail: form.form.titleMail,
    contentMail: form.form.contentMail,
    relatedCode: form.form.relatedCode
  }

  await createContact(param)
    .then((response : any) => {
      message.success("Contact created!")
      router.push('/contact/success');
      loading.value = false;
    })
    .catch((err) => {
      message.error(t('contact.response.sendContactFail'));
      loading.value = false;
    })
}

onBeforeMount(async () => {
  if(form.checkNullForm()) {
    router.push("/contact")
  }
})

const handleRouteToCreate = () => {
  router.push('/contact');
}

</script>

<template>
  <page-layout :is-loading="loading">
    <div class="main">
      <div class="navigation">
        <div class="header">
          <a-button type="text" @click="handleRouteToCreate" class="return-button">
            <template #icon>
              <LeftOutlined />
            </template>
            <div class="ml-21 d-inline-block">
              {{ $t('contact.preview') }}
            </div>
          </a-button>
        </div>
      </div>
      <div class="page-title">
        <span class="page-title">{{ $t('contact.pageTitle') }}</span>
        <span class="page-des">{{ $t('contact.pageDes') }}</span>
      </div>
      <a-form :model="form.form" ref="formRef">
        <div class="card-wrapper">

          <div class="contact-item">
            <label class="label left" for="">{{ $t('contact.createdDate') }}</label>
            <a-form-item name="companyName">
              <label class="label" for="">{{ form.formatDate }}</label>
            </a-form-item>
          </div>

          <div class="contact-item">
            <label class="label left" for="">{{ $t('contact.companyGroup.title') }}</label>
            <a-form-item name="companyGroup">
              <label class="label" for="">{{ form.form.companyGroup }}</label>
            </a-form-item>
          </div>

          <div class="contact-item">
            <label class="label left" for="">{{ $t('contact.companyName.title') }}</label>
            <a-form-item name="companyName">
              <label class="label" for="">{{ form.form.companyName }}</label>
            </a-form-item>
          </div>

          <a-divider class="divider" />

          <div class="contact-item">
            <label class="label left" for="">{{ $t('contact.creatorId.titlePreview') }}</label>
            <a-form-item name="creatorId">
              <label class="label" for="">{{ form.form.creatorId }}</label>
            </a-form-item>
          </div>

          <div class="contact-item">
            <label class="label left" for="">{{ $t('contact.creatorName.title') }}</label>
            <a-form-item name="creatorName">
              <label class="label" for="">{{ form.form.creatorName }}</label>
            </a-form-item>
          </div>

          <div class="contact-item">
            <label class="label left" for="">{{ $t('contact.userEmail.titlePreview') }}</label>
            <a-form-item name="userEmail">
              <label class="fs-20" for="">{{ form.form.userEmail }}</label>
            </a-form-item>
          </div>

          <div class="contact-item">
            <label class="label left" for="">{{ $t('contact.contactType.title') }}</label>
            <a-form-item name="contactType">
              <label class="label" for="">{{ form.form.contactTypeName }}</label>
            </a-form-item>
          </div>

          <div class="contact-item">
            <label class="label left" for="">{{ $t('contact.contactDomain.title') }}</label>
            <a-form-item name="contactDomain">
              <label class="label" for="">{{ form.form.contactDomain }}</label>
            </a-form-item>
          </div>

          <div class="contact-item">
            <label class="label left" for="">{{ $t('contact.relatedCode.title') }}</label>
            <a-form-item name="contactDomain">
              <label class="label" for="">{{ form.form.relatedCode }}</label>
            </a-form-item>
          </div>

          <a-divider class="divider" />

          <div class="contact-item">
            <a-form-item name="titleMail">
              <label class="title-mail" for="">{{ form.form.titleMail }}</label>
            </a-form-item>
          </div>
          <div class="contact-item">
            <a-form-item name="contentMail">
              <pre class="content-mail" for="">{{ form.form.contentMail }}</pre>
            </a-form-item>
          </div>
        </div>
        <div class="btn">
          <a-button type="primary" class="btn-primary" html-type="submit" @click="handleCreateContact">
            <span class="btn-text">{{ $t('contact.register') }}</span>
          </a-button>
        </div>
      </a-form>
    </div>
  </page-layout>
  <div>
    <confirm-dialog
      :visible="visible"
      :show-cancel="true"
      :message="'共有ファイルを削除します。よろしいでしょうか？'"
      :cancelTitle="'削除します'"
      @close="visible = false"
    ></confirm-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import './../../assets/styles/common.css';
@import './../../assets/styles/page.css';
@import './../../assets/styles/button.css';

.ant-btn-text:focus,
.ant-btn-text:hover {
  background: transparent;
}
.contact-item {
  display: flex;
  margin-bottom: 0px;
  width: -webkit-fill-available;
}

.contact-item .label {
  font-style: normal;
  font-size: 20px;
  line-height: 34px !important;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.87);
  width: 280px;
  font-weight: 400;
}

.contact-item .label.left {
  width: 280px;
  font-weight: 700;
}

.ant-input {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
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

.ant-form-item {
  line-height: 34px;
}

.title-mail {
  height: 24px;
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 40px;
  display: flex;
  align-items: center;
  letter-spacing: 0.5px;
  color: rgba(55, 71, 79, 0.87);
}
.content-mail {
  width: fit-content;
  // word-break: break-all;
  white-space: break-spaces;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 32px;
  color: rgba(55, 71, 79, 0.87);
  font-family: Roboto;
}

.page-title {
  margin-left: 0;
  margin-top: 30px;
}

.card-wrapper {
  gap: 15px
}

:deep(.ant-divider-horizontal) {
  margin: 0;
}
</style>
