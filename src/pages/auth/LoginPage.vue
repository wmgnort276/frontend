<script setup lang="ts">
import { reactive } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { USER_TYPE } from '@/stores/constants/constant';
import router from '@/router';

const authStore = useAuthStore();

interface FormState {
  username: string;
  password: string;
  type: string[];
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  type: [USER_TYPE.EMPLOYEE]
});

const onSubmit = () => {
  authStore.handleLogin(formState);
};

const onForgetId = () => {
  router.push('/forgot-id')
}

const onForgetPassword = () => {
  router.push('/forgot-password')
}

</script>
<template class="font">
  <div class="container position-relative max-w-1120">
    <div class="page-content">
      <div class="content">
        <a-form :model="formState">
          <a-row align="middle" class="item">
            <a-col :sm="4" :md="8" :lg="8" class="label-input">
              {{ $t('login.form.label.id') }}
            </a-col>
            <a-col :sm="20" :md="16" :lg="16">
              <a-form-item>
                <a-input
                  v-model:value="formState.username"
                  :placeholder="$t('login.form.placeholder.id')"
                  class="input"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row class="mt-44 item" align="middle">
            <a-col :sm="4" :md="8" :lg="8" class="label-input">
              {{ $t('login.form.label.password') }}
            </a-col>
            <a-col :sm="20" :md="16" :lg="16">
              <a-form-item name="password" :rules="[{ message: 'Please input your password!' }]">
                <a-input-password
                  v-model:value="formState.password"
                  :placeholder="$t('login.form.placeholder.password')"
                  class="input"
                >
                </a-input-password>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>

        <a-button class="btn-rounned btn-login mt-55" @click="onSubmit">{{
          $t('login.form.button.submit')
        }}</a-button>

        <div class="wrapper-fogot">
          <a-divider class="divider" />

          <a-button class="btn-rounned btn-login color-forgot mt-60" @click="onForgetId"
            >{{ $t('login.form.button.forgetId') }}<block
          /></a-button>
          <a-button class="btn-rounned btn-login color-forgot mt-30" @click="onForgetPassword"
            >{{ $t('login.form.button.forgetPassword') }}<block
          /></a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './../../assets/styles/common.css';
@import './../../assets/styles/page.css';
@import './../../assets/styles/button.css';

.wrapper-fogot {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.btn-login {
  color: #fbfbfb;
  background-color: #1a237e;
  border-radius: 6px;
  font-weight: 400;
  font-size: 24px;
  letter-spacing: 0.25px;
  max-width: 457px;
  width: 50%;
  height: 70px;
}
.content {
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.input {
  height: 72px;
  border: 1px solid #d6e4ec !important;
  border-radius: 6px;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 120%;
  min-width: 400px;
}

.label-input {
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  letter-spacing: 0.5px;
}

.action {
  align-items: center;
  justify-content: center;
}

.color-forgot {
  color: #000000;
  background: rgba(245, 245, 245, 0.8);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
.divider {
  position: absolute;
  left: 0px;
  top: 348px;
  height: 2px;
  background: rgba(0, 0, 0, 0.3);
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
}
::v-deep(.ant-form-item) {
  margin-bottom: 0px;
}

::v-deep(.ant-input) {
  font-weight: 500;
  font-size: 24px;
}

::v-deep(.ant-input[id='form_item_password']) {
  border: none !important;
}
</style>
