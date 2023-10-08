<script lang="ts" setup>
import AppHeader from '@/pages/layouts/components/AppHeader.vue';
</script>
<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <AppHeader />
    </a-layout-header>
    <a-layout-content class="layout-content">
      <router-view />
<!--      <div></div>-->
    </a-layout-content>
    <a-layout-footer class="footer">{{ $t('common.footer') }}</a-layout-footer>
  </a-layout>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.ant-spin-container {
  font-family: 'Roboto', sans-serif !important;
  color: #37474f !important;
}
.header {
  background-color: #007f99;
  height: 100px;
}
.footer {
  background-color: #007f99;
  color: #ffffff;
  text-align: center;
}

.layout-content {
  padding: 19px;
  background-color:rgb(244, 250, 251);
}

.layout {
  min-height: 100vh;
}

@media screen and (max-width: 767px) {
  .header {
    height: 48px !important;
  }

  .ant-layout-header {
    padding: 0 12px !important;
  }

  .layout-content {
    padding: 7px 12px;
  }
}
</style>
