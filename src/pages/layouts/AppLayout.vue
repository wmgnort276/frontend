<script lang="ts" setup>
import AppHeader from '@/pages/layouts/components/AppHeader.vue';
</script>
<template>
  <a-layout class="layout" style="height: 100%;">
    <a-layout-header class="header">
      <AppHeader />
    </a-layout-header>
    <a-layout-content class="layout-content" style="height: 100%;">
      <router-view />
      <!--      <div></div>-->
    </a-layout-content>
    <!-- <a-layout-footer class="footer"></a-layout-footer> -->
  </a-layout>
</template>
<style scoped>
@import '../../assets/styles/color.css';
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
}
.header {
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid rgb(214, 207, 207);
  position: fixed;
  width: 100%;
  z-index: 9999;
}

.layout {
  background: #fff !important;
}

:deep(.ant-layout) {
  background: #fff;
}

.footer {
  background-color: rgb(237, 239, 243);
  color: #ffffff;
  text-align: center;
}

</style>
