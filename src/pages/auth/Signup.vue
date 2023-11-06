<script setup lang="ts">
import router from '@/router';
import { onMounted, ref } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { useAuthStore } from '@/stores/auth.store';
import type { FormSignUp } from '@/types/interfaces/auth';

const authStore = useAuthStore();
let isLoading = ref<boolean>(false);
const formRef = ref<FormInstance>();
let formSignUp = ref<FormSignUp>({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

onMounted(async () => {});

const routeToSignUp = async () => {
  await router.push('/login');
};

const validateConfirmPassword = async (_rule: Rule, value: string) => {
  if (formSignUp.value.confirmPassword != formSignUp.value.password) {
    return Promise.reject('Password not match!');
  }

  return Promise.resolve();
};

const handleSignup = async () => {
  await formRef.value!.validate();
  await authStore.signUp(formSignUp.value);
  await router.push('/login');
};
</script>

<template>
  <page-layout :is-loading="isLoading">
    <div class="main-page flex align-center">
      <div class="form-login">
        <a-form class="form flex-column" ref="formRef" :model="formSignUp">
          <div class="flex-column align-center">
            <h2>Sing up</h2>
          </div>
          <a-form-item
            name="username"
            :rules="[
              {
                required: true,
                message: 'Required',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <a-input class="input" placeHolder="Username" v-model:value="formSignUp.username">
            </a-input>
          </a-form-item>

          <a-form-item
            name="email"
            :rules="[
              {
                required: true,
                message: 'Required',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <a-input class="input" placeHolder="Email" v-model:value="formSignUp.email"> </a-input>
          </a-form-item>

          <a-form-item
            name="password"
            :rules="[
              {
                required: true,
                message: 'Required',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <a-input-password
              class="input"
              placeHolder="Password"
              v-model:value="formSignUp.password"
            >
            </a-input-password>
          </a-form-item>

          <a-form-item
            name="confirmPassword"
            :rules="[
              {
                required: true,
                message: 'Required',
                trigger: ['blur', 'change']
              },
              {
                validator: validateConfirmPassword,
                trigger: ['blur', 'change']
              }
            ]"
          >
            <a-input-password
              class="input"
              placeHolder="Confirm Password"
              v-model:value="formSignUp.confirmPassword"
            >
            </a-input-password>
          </a-form-item>

          <a-button
            style="width: 100%"
            class="main-color text-second-color mb-20 login-buton"
            @click="handleSignup"
          >
            Sign Up
          </a-button>

          <div class="flex align-center">
            <span style="margin-right: 5px">Have an account?</span>
            <span class="link-color pointer" @click="routeToSignUp"> Sign in </span>
          </div>
        </a-form>
      </div>
    </div>
  </page-layout>
</template>

<style scoped>
@import '../../assets/styles/common.css';
@import '../../assets/styles/color.css';

.form-login {
  width: 400px;
  background-color: #fff;
  margin: 0 auto;
}

.form {
  padding: 50px 30px;
}
</style>
