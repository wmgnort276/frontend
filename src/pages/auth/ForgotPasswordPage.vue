<script lang="ts" setup>
import { ref, reactive } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';
import { useI18n } from 'vue-i18n';
import type { FormInstance } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import { forgotPassword } from '@/api/auth.api';
import router from '@/router';

const { t } = useI18n();
const formRef = ref<FormInstance>();
const formState = reactive({
  email: ''
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
};

const checkValidateAll = async () => {
  try {
    await formRef.value?.validateFields();
    await handleForgotPassword();
  } catch (error) {
    console.log(error);
  }
};

const validateEmail = (rules: any, value: any) => {
  const regex =
    /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/; // eslint-disable-line
  return new Promise((resolve, reject) => {
    if (!regex.test(value)) {
        reject('Email invalid');
    } else {
      resolve('');
    }
  });
};

const handleForgotPassword = async () => {
  loading.value = true;
  const param = {
    mailAddress : formState.email
  }
  forgotPassword(param)
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
  <page-layout :is-loading="false">
    <div class="wrapper">
      <div class="card">
        <a-form ref="formRef" :model="formState" @finish="onFinish" >
          <a-row class="email">
            <a-col class="title" :md="8" :sm="8" :xs="24">
              {{ $t('login.form.label.email') }}
            </a-col>
            <a-col :md="16" :sm="16" :xs="24">
              <a-form-item
                name="email"
                :rules="[
                  {
                    required: true,
                    message: $t('login.form.label.email') + $t('user.form.maxlength'),
                    trigger: ['blur', 'change']
                  },
                  {
                    max: 2000,
                    message: $t('login.form.label.email') + $t('user.form.maxlength'),
                    trigger: ['blur', 'change']
                  }
                ]">
                <a-input
                  class="email-input"
                  v-model:value="formState.email"
                  :placeholder="$t('login.form.placeholder.email')"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="action">
            <a-button class="btn-forgot" html-type="submit" @click="checkValidateAll">{{
              $t('login.form.sendNewPassword')
            }}</a-button>
          </a-row>
        </a-form>
      </div>
    </div>
  </page-layout>
</template>

<style scoped>
.wrapper {
  max-width: 1120px;
  height: 600px;
  margin: 0 auto;
  margin-top: 50px;
}

.card {
  width: 100%;
  height: 100%;
  background: #ffffff;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14),
    0px 1px 5px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 30px 120px;
}

.card ::v-deep(.ant-form) {
  display: flex;
  flex-direction: column;
  gap: 150px;
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
