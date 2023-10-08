<script lang="ts" setup>
import { ref, reactive } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';
import LoginOption from '@/pages/auth/components/LoginOption.vue';
import Eye from '@/components/icon/Eye.vue';
import type { TLogin, TLoginFaq } from '@/types/schemas/user.schema';
import { useMutation } from '@tanstack/vue-query';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const authStore = useAuthStore();
const router = useRouter();

const conpanyCodeFormState = reactive({
  companyCode: '',
  username: '',
  password: ''
});
const faqFormState = reactive({
  faqCode: '',
  password: ''
});
const errorMessage = ref('');

const { mutate } = useMutation({
  mutationFn: (data: TLogin) => authStore.handleLogin(data),
  onSuccess: async () => {
    router.push('/top');
  },
  onError: (error: any) => {
    errorMessage.value = 'account or password error';
  }
});
const { mutate: mutateFaq } = useMutation({
  mutationFn: (data: TLoginFaq) => authStore.handleLoginFaq(data),
  onSuccess: async () => {
    router.push('/faq/search');
  },
  onError: (error: any) => {
    errorMessage.value = 'account or password error';
  }
});

const onSubmitFaq = () => {
  mutateFaq(faqFormState);
};

const loading = ref<boolean>(false);

const passwordType = ref<string>('password');

const validateMessages = {
  required: 'Required'
};

const showCompanyForm = ref<boolean>(false);
const showFaqForm = ref<boolean>(false);

const handelShowConpanyForm = () => {
  showCompanyForm.value = !showCompanyForm.value;
};

const handleShowFaqForm = () => {
  showFaqForm.value = !showFaqForm.value;
};

const handleShowPass = () => {
  passwordType.value = '';
};

const onFinish = (values: any) => {
  loading.value = true;
  console.log(values);
};
</script>
<template>
  <div class="wrapper">
    <div class="card">
      <div class="company-code-login">
        <login-option @on-click="handelShowConpanyForm">
          {{ $t('login.loginTop.companyCodeTitle') }}
        </login-option>
        <Transition>
          <a-form
            v-if="showCompanyForm"
            class="form"
            :model="conpanyCodeFormState"
            @finish="onFinish"
            :validate-messages="validateMessages"
          >
            <a-row class="form-item">
              <a-col class="title" :md="8" :sm="8" :xs="24">
                {{ $t('login.loginTop.label.companyCode') }}
              </a-col>
              <a-col :md="16" :sm="16" :xs="24">
                <a-form-item name="companyCode" :rules="[{}]">
                  <a-input
                    class="input"
                    v-model:value="conpanyCodeFormState.companyCode"
                    :placeholder="$t('login.loginTop.placeholder.companyCode')"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row class="form-item">
              <a-col class="title" :md="8" :sm="8" :xs="24">
                {{ $t('login.loginTop.label.id') }}
              </a-col>
              <a-col :md="16" :sm="16" :xs="24">
                <a-form-item name="username" :rules="[{ required: true }]">
                  <a-input
                    class="input"
                    v-model:value="conpanyCodeFormState.username"
                    :placeholder="$t('login.loginTop.placeholder.id')"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row class="form-item">
              <a-col class="title" :md="8" :sm="8" :xs="24">
                {{ $t('login.loginTop.label.password') }}
              </a-col>
              <a-col :md="16" :sm="16" :xs="24">
                <a-form-item name="password" :rules="[{ required: true }]">
                  <a-input
                    class="input"
                    v-model:value="conpanyCodeFormState.password"
                    :type="passwordType"
                    :placeholder="$t('login.loginTop.placeholder.password')"
                    @blur="passwordType = 'password'"
                  >
                    <template #suffix>
                      <a-tooltip title="Show Password">
                        <Eye class="show-icon" @click="handleShowPass" />
                      </a-tooltip>
                    </template>
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="action">
              <!-- <a-button class="btn" html-type="submit" @click="onSubmit">{{
                $t('login.loginTop.button.login')
              }}</a-button> -->
            </a-row>
          </a-form>
        </Transition>
      </div>
      <div class="faq-code-login">
        <login-option @on-click="handleShowFaqForm">
          {{ $t('login.loginTop.faqCodeTitle') }}
        </login-option>
        <Transition>
          <a-form
            v-if="showFaqForm"
            class="form"
            :model="faqFormState"
            @finish="onFinish"
            :validate-messages="validateMessages"
          >
            <a-row class="form-item">
              <a-col class="title" :md="8" :sm="8" :xs="24">
                {{ $t('login.loginTop.label.faqCode') }}
              </a-col>
              <a-col :md="16" :sm="16" :xs="24">
                <a-form-item name="faqCode" :rules="[{ required: true }]">
                  <a-input
                    class="input"
                    v-model:value="faqFormState.faqCode"
                    :placeholder="$t('login.loginTop.placeholder.faqCode')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="action">
              <a-button class="btn" html-type="submit" @click="onSubmitFaq">{{
                $t('login.loginTop.button.login')
              }}</a-button>
            </a-row>
          </a-form>
        </Transition>
      </div>

      <a-divider />

      <div class="infor-looking">
        <div class="infor-looking-title">
          {{ $t('login.loginTop.inforlooking') }}
        </div>
        <div>
          <block />
        </div>
      </div>
    </div>
  </div>
  <!-- </page-layout> -->
</template>

<style scoped>
.wrapper {
  margin: 0 auto;
  margin-top: 50px;
  display: flex;
  justify-content: center;
}

.card {
  width: 1120px;
  min-height: 600px;
  background: #ffffff;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14),
    0px 1px 5px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.form {
  padding: 40px 100px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 20px;
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

.form-item ::v-deep(.ant-form-item-explain-error) {
  color: #ef6c00;
  font-weight: 700;
  font-size: 18px;
}

.card ::v-deep(.ant-divider) {
  border-top: 2px solid rgba(0, 0, 0, 0.3);
  margin: 0;
}

.infor-looking {
  background: rgba(245, 245, 245, 0.8);
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 30px 20px;
  cursor: pointer;
}

.infor-looking-title {
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 30px;
  letter-spacing: 0.5px;
  color: rgba(0, 0, 0, 0.9);
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.18);
}

.form ::v-deep(.ant-input) {
  border: 1px solid rgba(214, 228, 236, 1) !important;
  font-style: normal;
  font-weight: 300;
  font-size: 24px;
  line-height: 120%;
}

.form ::v-deep(#form_item_password) {
  border: none !important;
  font-style: normal;
  font-weight: 300;
  font-size: 24px;
  line-height: 120%;
}

.show-icon {
  cursor: pointer;
}

.v-enter-active {
  transition: opacity 0.3s ease;
}
.v-leave-active {
  transition: opacity 0.1s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
