<script lang="ts" setup>
import { ref, reactive, onBeforeMount } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';
import { useI18n } from 'vue-i18n';
import type { Rule } from 'ant-design-vue/es/form';
import type { FormInstance } from 'ant-design-vue';
import router from '@/router';
import { validatePassword, setNewPassword } from '@/api/auth.api';
import { message } from 'ant-design-vue';

const { t } = useI18n();
const loading = ref<boolean>(false);

interface FormState {
  newPassword: string;
  confirmNewPassword: string;
}

const formState = reactive<FormState>({
  newPassword: '',
  confirmNewPassword: ''
});
const formRef = ref<FormInstance>();

let currentPassType = ref<string>('password');
let newPassType = ref<string>('password');
let confirmNewPassType = ref<string>('password');

const currPass = ref<HTMLElement | null>(null);

const handleShowCurrentPass = () => {
  currentPassType.value = '';
  // currPass.value?.focus();
};

const handleShowNewPass = () => {
  newPassType.value = '';
};

const handleShowConfirmNewPass = () => {
  confirmNewPassType.value = '';
};

let validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('Required');
  } else {
    return Promise.resolve();
  }
};
let validateNewPass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('Required');
  } else {
    return Promise.resolve();
  }
};
let validateConfirmPass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('Required');
  } else if (value !== formState.newPassword) {
    return Promise.reject('Password not match!');
  } else {
    return Promise.resolve();
  }
};

const rules: Record<string, Rule[]> = {
  newPassword: [{ required: true, validator: validateNewPass, trigger: 'change' }],
  confirmNewPassword: [{ required: true, validator: validateConfirmPass, trigger: 'change' }]
};
const onFinish = (values: any) => {
  loading.value = true;
  // handle find new ID
};

const submit = async () => {
  loading.value = true;
  try {
    const param = {
      newPassword: formState.newPassword,
      confirmPassword: formState.confirmNewPassword,
      id : router.currentRoute.value.params.id
    }
    const res: any = await setNewPassword(param);
    if (res.status) {
      message.success(res.message);
      router.push(`/login-menu`);
    }
    loading.value = false;
  } catch (error) {
    message.error("Error");
    loading.value = false;
  }
  loading.value = false;
}

onBeforeMount(async () => {
  loading.value = true;
  try {
    const res: any = await validatePassword(router.currentRoute.value.params.id);
    if (!res.status) {
      message.error(res.message);
      router.push(`/login-menu`);
    }
    loading.value = false;
  } catch (error) {
    message.error("Error");
    loading.value = false;
  }
});
</script>
<template>
  <page-layout :is-loading="loading">
    <div class="wrapper">
      <div class="card">
        <a-form ref="formRef" :model="formState" :rules="rules" @finish="onFinish">
          <div class="form-content">
            <a-row class="item confirm-pass">
              <a-col class="title" :md="8" :sm="8" :xs="24">
                {{ $t('login.changePassword.label.newPassword') }}
              </a-col>
              <a-col :md="16" :sm="16" :xs="24">
                <a-form-item name="newPassword">
                  <a-input-password v-model:value="formState.newPassword"
                  :placeholder="$t('login.changePassword.placeHolder.password')" class="input" :type="newPassType"
                    @blur="newPassType = 'password'">
                  </a-input-password>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="item new-pass">
              <a-col class="title" :md="8" :sm="8" :xs="24">
                {{ $t('login.changePassword.label.confirmNewPassword') }}
              </a-col>
              <a-col :md="16" :sm="16" :xs="24">
                <a-form-item name="confirmNewPassword">
                  <a-input-password v-model:value="formState.confirmNewPassword"
                    :placeholder="$t('login.changePassword.placeHolder.password')" class="input" :type="confirmNewPassType"
                    @blur="confirmNewPassType = 'password'">
                  </a-input-password>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <a-row class="action">
            <a-button class="btn-forgot" @click="submit" html-type="submit">{{
              $t('login.changePassword.button.changePassword')
            }}</a-button>
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
  max-height: 600px;
  background: #ffffff;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14),
    0px 1px 5px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 30px 120px;
}

.card ::v-deep(.ant-form) {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

.form-content {
  margin-bottom: 50px;
}

.form-content ::v-deep(.ant-input) {
  border: none !important;
  font-style: normal;
  font-weight: 300;
  font-size: 24px;
  line-height: 120%;
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

.input {
  height: 72px;
  background: #ffffff;
  border: 1px solid #d6e4ec;
  border-radius: 6px;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 120%;
}

.icon {
  cursor: pointer;
}

.item {
  margin-bottom: 15px;
}

.item ::v-deep(.ant-form-item-explain-error) {
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
