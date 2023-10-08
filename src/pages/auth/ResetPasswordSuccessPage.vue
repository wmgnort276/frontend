<script lang="ts" setup>
import { useRouter } from 'vue-router';
import AuthLayout from '@/pages/auth/components/AuthLayout.vue';
import CheckCircle from '@/components/icon/CheckCircle.vue';

const router = useRouter();
const redirectToLogin = () => {
  router.push({ name: 'login-menu' });
};
</script>
<template>
  <AuthLayout>
    <div class="flex justify-center mb-8">
      <CheckCircle />
    </div>
    <div class="text-center mb-11">
      <div class="text-gray-400">あなたのメールアドレスへのリンクを送信しました</div>
      <!-- <div>admin@gmail.com</div> -->
    </div>
    <a-button key="console" type="primary" size="large" block @click="redirectToLogin">{{
      $t('login.common.backToLogin')
    }}</a-button>
  </AuthLayout>
</template>
