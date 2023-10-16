<template>
  <a-spin :spinning="!!isMutating" tip="Loading...">
    <router-view />
  </a-spin>
</template>
<script setup lang="ts">
import { useIsMutating } from '@tanstack/vue-query';
import '../ckeditor5/build/ckeditor';
const isMutating = useIsMutating();
document.title = "Code deep";
</script>
<style>
.ant-spin-nested-loading {
  min-height: 100%;
}
.ant-spin-nested-loading > div > .ant-spin {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}
</style>
