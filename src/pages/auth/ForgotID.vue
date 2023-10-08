<script lang="ts" setup>
import { ref, reactive } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import { forgotId } from '@/api/auth.api';
import router from '@/router';

const { t } = useI18n();
const formState = reactive({
  email: '',
  checked: false
});
const loading = ref<boolean>(false);
const validateMessages = {
  required: t('login.form.emailError'),
  types: {
    email: t('login.form.emailError')
  }
};
const onFinish = (values: any) => {
  loading.value = true;
  // handle find new ID
};

const handleForgotId = () => {
  loading.value = true;
  const param = {
    mailAddress : formState.email,
    isNewPassword: formState.checked
  }
  forgotId(param)
    .then((response: any) => {
      message.success("Success");
      router.push("/reset-password-success")
      loading.value = false;
    })
    .catch((error) => {
      message.error("Fail");
      loading.value = false;
      Promise.reject(error);
    });
  loading.value = false;
}
</script>
<template>
  <page-layout :is-loading="loading">
    <div class="wrapper">
      <div class="card">
        <a-form :model="formState" @finish="onFinish" :validate-messages="validateMessages">
          <a-row class="email">
            <a-col class="title" :md="8" :sm="8" :xs="24">
              {{ $t('login.form.label.email') }}
            </a-col>
            <a-col :md="16" :sm="16" :xs="24">
              <a-form-item name="email" :rules="[{ type: 'email', required: true }]">
                <a-input
                  class="email-input"
                  v-model:value="formState.email"
                  :placeholder="$t('login.form.placeholder.emailForgotId')"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-form-item>
                <a-checkbox class="title" v-model:checked="formState.checked">{{ $t('login.forgot.labelForgotId') }}</a-checkbox>
              </a-form-item>
          </a-row>
          <a-row class="action">
            <a-button class="btn-forgot" @click="handleForgotId" html-type="submit">{{ $t('login.form.sendNewId') }}</a-button>
          </a-row>
        </a-form>
      </div>
    </div>
  </page-layout>
</template>

<style scoped>
.wrapper {
  margin: 0 auto;
  margin-top: 150px;
  display: flex;
  justify-content: center;
}

.card {
  width: 1120px;
  height: 500px;
  background: #ffffff;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14),
    0px 1px 5px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 30px 120px;
}

.card ::v-deep(.ant-form) {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 100px;
}

.title {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  letter-spacing: 0.5px;
  color: #000000;
  margin-top: 20px;
}

.email-input {
  height: 72px;
  background: #ffffff;
  border: 1px solid #d6e4ec;
  border-radius: 6px;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 120%;
}

.email ::v-deep(.ant-form-item-explain-error) {
  color: #ef6c00;
  font-weight: 700;
  font-size: 18px;
}

.action {
  align-items: center;
  justify-content: center;
}

.btn-forgot {
  width: 457px;
  height: 70px;
  background: #1a237e;
  border-radius: 6px;
  color: #fbfbfb;
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 120%;
}
</style>
