<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps({
  status: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(['confirm', 'cancel']);
const handleConfirm = () => {
  emit('confirm');
};
const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <div class="dialog">
    <a-modal :visible="props.status" centered :footer="null" :closable="false">
      <div>
        <div class="title">{{ $t('common.popup.title') }}</div>
        <div class="btn-group">
          <a-button class="btn-rounned btn-default" @click="handleCancel">{{
            $t('common.popup.cancel')
          }}</a-button>
          <a-button class="btn-rounned" @click="handleConfirm" type="primary">{{
            $t('common.popup.confirm')
          }}</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
@import '@/assets/styles/button.css';
.title {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
  line-height: 22px;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 40px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.87);
  word-wrap: break-word;
}

.btn-group {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
}
</style>

<style>
.ant-modal {
  border-radius: 8px;
  overflow: hidden;
}
</style>
