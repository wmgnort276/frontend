<script setup lang="ts">
import { t } from '@/plugins/i18n';
const listLink = [
  { name: 'userWithoutAuthen', link: 'login' },
  { name: 'userWithAuthen', link: 'login' },
  { name: 'faqCode', link: 'login-faq' },
  { name: 'hrOneContact', link: 'login-hrOne' },
  { name: 'systemAdmin', link: 'login-hrOne' }
];
</script>
<template class="font">
  <div class="container position-relative max-w-1120">
    <div class="page-top">
      <div class="page-title">
        <a-button type="link" class="text-title">{{ t('login.common.menu') }}</a-button>
      </div>
    </div>
    <div class="page-content">
      <div class="content">
        <div v-for="(item, index) in listLink" :key="index">
          <router-link
            :to="{
              name: item.link
            }"
          >
            <a-button type="link" class="text-link mt-50">
              <span class="text-link">{{
                `${t('login.common.listPattern')} ${index + 1} ${t(`login.pattern.${item.name}`)}`
              }}</span>
            </a-button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './../../assets/styles/common.css';
@import './../../assets/styles/page.css';
@import './../../assets/styles/button.css';

.content {
  text-align: center;
}

.text-title {
  font-size: 36px;
}

.text-link {
  font-weight: 400;
  font-size: 32px;
  line-height: 24px;
  color: #1565c0;
  text-decoration-line: underline;
  border: transparent;
}
</style>
