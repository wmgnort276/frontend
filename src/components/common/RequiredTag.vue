<script setup lang="ts">
import { t } from '@/plugins/i18n';
</script>

<template>
  <div class="required-tag">
    {{ $t('common.required') }}
  </div>
</template>

<style scoped>
.required-tag {
  display: inline-block;
  padding: 1px 16px;
  background-color: #d21919;
  border-radius: 36px;
  color: #fff;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
}
</style>
