<script setup lang="ts">
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue';
const emit = defineEmits(['on-click']);
const props = defineProps({
  type: String,
  disabled: Boolean
});
const handleClick = () => {
  emit('on-click');
};
</script>

<template>
  <div class="" @click="handleClick">
    <div :disabled="props.disabled" v-if="props.type == 'add'" class="button content">
      <plus-outlined />
      <span>
        {{ $t('common.page.button.add') }}
      </span>
    </div>
    <a-button
      :class="{ disabled: props.disabled }"
      :disabled="props.disabled"
      v-if="props.type == 'add-rounded'"
      class="btn border-none btn-text-medium add-rounded"
    >
      <plus-outlined />
      <span>
        {{ $t('common.page.button.add') }}
      </span>
    </a-button>
    <div v-else-if="props.type == 'delete'" class="btn btn-text-medium content">
      <minus-outlined />
      <span>
        {{ $t('common.page.button.delete') }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.button {
  background-color: #1976d2;
  color: #fff;
  max-height: 40px;
  padding: 3px 15px;
  border-radius: 30px;
  cursor: pointer;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}
.content {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 5px 10px;
}
.border-none {
  border: none !important;
}

.disabled {
  background: rgba(0, 0, 0, 0.12) !important;
  color: rgba(0, 0, 0, 0.26) !important;
  cursor: not-allowed !important;
}
.btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  width: 91px;
  height: 36px;
  background: #1976d2;
  border-radius: 16px;
  font-size: 16px;
  line-height: 24px;
  color: #fff;
  cursor: pointer;
}
.btn-delete {
  position: absolute;
  left: 745px;
  top: 7px;
  width: 91px;
  height: 36px;
  background: #1976d2;
  border-radius: 16px;
}

.ant-btn > .anticon {
  display: flex !important;
}
</style>
