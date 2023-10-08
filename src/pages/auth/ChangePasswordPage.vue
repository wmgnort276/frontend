<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';
import { useI18n } from 'vue-i18n';
import Eye from '@/components/icon/Eye.vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { FormInstance } from 'ant-design-vue';
import type { FormChangePassword } from '@/types/interfaces/auth'
import { useAuthStore } from '@/stores/auth.store';
import { USER_TYPE } from '@/stores/constants/constant';
import router from '@/router';

const authStore = useAuthStore();
const { t } = useI18n();
const loading = ref<boolean>(false);

const formState = reactive<FormChangePassword>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const formRef = ref<FormInstance>();

onMounted(async () => {
  let userInfo = authStore.authUser;
  if(!userInfo 
    || (userInfo.UserType != USER_TYPE.MANAGER 
      && userInfo.UserType != USER_TYPE.SYSTEM_ADMIN )) {
      await router.push("/top")
  }
})

let isDisableButton = computed(() => {
  return !formState.oldPassword 
   || !formState.newPassword
   || !formState.confirmPassword 
   || (formState.confirmPassword != formState.newPassword);
})

let validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject(t('login.changePassword.validate.old_password'));
  }
  else {
    return Promise.resolve();
  }
};
let validateNewPass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject(t('login.changePassword.validate.new_password'));
  } else if((formState.confirmPassword || formState.confirmPassword != '')
   && formState.confirmPassword != formState.newPassword) {
    formRef.value?.validateFields(['confirmPassword'])
  } else {
    return Promise.resolve();
  }
};
let validateConfirmPass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject(t('login.changePassword.validate.confirm_password'));
  } else if (value !== formState.newPassword) {
    return Promise.reject(t('login.changePassword.validate.pass_not_match'));
  } else {
    return Promise.resolve();
  }
};

const rules: Record<string, Rule[]> = {
  oldPassword: [{ required: true, validator: validatePass, trigger: ['change', 'blur'] }],
  newPassword: [{ required: true, validator: validateNewPass, trigger: ['change', 'blur'] }],
  confirmPassword: [{ required: true, validator: validateConfirmPass, trigger: ['change', 'blur'] }]
};
const onFinish = (values: any) => {
  loading.value = true;
  // handle find new ID
};

const onSubmit = async () => {
  loading.value = true;
  await authStore.handleChangePassword(formState);
  loading.value = false;
}
</script>
<template>
  <page-layout :is-loading="loading">
    <div class="container position-relative max-w-1200">
      <div class="page-content">
        <div class="content">
          <a-form class="form" ref="formRef" :model="formState" :rules="rules" @finish="onFinish">
            <div class="form-content">
              <a-row class="item current-pass">
                <a-col class="title" :md="8" :sm="8" :xs="24">
                  {{ $t('login.changePassword.label.currentPass') }}
                </a-col>
                <a-col :md="16" :sm="16" :xs="24">
                  <a-form-item name="oldPassword">
                    <a-input-password
                      class="input"
                      v-model:value="formState.oldPassword"
                      :placeholder="$t('login.changePassword.placeHolder.password')"
                    >
                    </a-input-password>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="item confirm-pass">
                <a-col class="title" :md="8" :sm="8" :xs="24">
                  {{ $t('login.changePassword.label.newPassword') }}
                </a-col>
                <a-col :md="16" :sm="16" :xs="24">
                  <a-form-item name="newPassword">
                    <a-input-password
                      class="input"
                      v-model:value="formState.newPassword"
                      :placeholder="$t('login.changePassword.placeHolder.password')"
                    >
                    </a-input-password>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="item new-pass">
                <a-col class="title" :md="8" :sm="8" :xs="24">
                  {{ $t('login.changePassword.label.confirmNewPassword') }}
                </a-col>
                <a-col :md="16" :sm="16" :xs="24">
                  <a-form-item name="confirmPassword">
                    <a-input-password
                      class="input"
                      v-model:value="formState.confirmPassword"
                      :placeholder="$t('login.changePassword.placeHolder.password')"
                    >
                    </a-input-password>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <a-row class="action">
              <a-button 
               :class= "{ 
                'btn btn-rounned': !isDisableButton,
                'btn-disable btn-rounned btn': isDisableButton
              }"
               @click="onSubmit" 
               :disabled="isDisableButton">
               {{
                $t('login.changePassword.button.changePassword')
              }}</a-button>
            </a-row>
          </a-form>
        </div>
      </div>
    </div>
  </page-layout>
</template>

<style scoped>
@import './../../assets/styles/common.css';
@import './../../assets/styles/page.css';
@import './../../assets/styles/button.css';


.content {
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content ::v-deep(.ant-form) {
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

.btn {
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

.form {
  width: 100%;
}
</style>
