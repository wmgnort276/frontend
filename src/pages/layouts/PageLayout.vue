<script lang="ts" setup>
import { watch, ref, watchEffect } from 'vue';
const props = defineProps({
  isLoading: Boolean
});

watchEffect(() => {
  if (props.isLoading) {
    document.body.classList.add('on-loading');
  } else {
    document.body.classList.remove('on-loading');
  }
});
</script>
<template>
  <div
    v-motion
    :initial="{
      opacity: 0
    }"
    :enter="{
      opacity: 1
    }"
    class="transform-none"
  >
    <slot />
  </div>
  <div class="loading-container" v-if="isLoading">
    <a-spin :spinning="isLoading" tip="Loading..."> </a-spin>
  </div>
</template>
<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.transform-none {
  transform: none !important;
}
</style>
