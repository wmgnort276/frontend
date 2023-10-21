<script lang="ts" setup>
import AppHeader from '@/pages/layouts/components/AppHeader.vue';
</script>
<template>
  <a-layout class="layout">
    <a-layout-header class="header main-color">
      <AppHeader />
    </a-layout-header>
    <a-layout-content class="layout-content">
      <router-view />
<!--      <div></div>-->
    </a-layout-content>
    <!-- <a-layout-footer class="footer">NamVN</a-layout-footer> -->
  </a-layout>
</template>
<style scoped>
@import "../../assets/styles/color.css";
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
  /* color: #37474f !important; */
}
.header {
  /* background-color: #5d6169; */
  height: 50px;
}


.layout-content {
  /* padding: 19px; */
}

.layout {
  /* min-height: 100vh; */
  background: #fff !important;
}

:deep(.ant-layout) {
  background: #fff;
}
</style>
