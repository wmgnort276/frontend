<template>
  <a-spin :spinning="!!isMutating" tip="Loading...">
    <router-view />
  </a-spin>
</template>
<script setup lang="ts">
import { useIsMutating } from '@tanstack/vue-query';
import './assets/styles/common.css'
const isMutating = useIsMutating();
document.title = "Code deep";
</script>
<style>
.ant-spin-nested-loading {
  height: 100%;
}
.ant-spin-nested-loading > div > .ant-spin {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}

.app-container {
  /* background-color: radial-gradient(closest-side at 50% 135%, #ffffff 50%, #eceff1 100%); */
}

.ant-spin-container {
  height: 100%;
}


</style>
