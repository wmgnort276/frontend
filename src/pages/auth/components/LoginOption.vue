<script setup lang="ts">
import { ref } from 'vue';
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue';
const emit = defineEmits(['on-click']);
const open = ref<string>('開く');
const close = ref<string>('閉じる');
const showStatus = ref<boolean>(true);
const hanldeClick = () => {
  emit('on-click');
  showStatus.value = !showStatus.value;
};
</script>

<template>
  <div class="container">
    <div class="title">
      <slot />
    </div>
    <div class="pull-down" @click="hanldeClick">
      <div class="pull-down-content">
        <span class="status">
          {{ showStatus ? open : close }}
        </span>
        <span v-if="showStatus" class="icon">
          <down-outlined />
        </span>
        <span v-else class="icon">
          <up-outlined />
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  background-color: rgba(21, 101, 192, 0.8);
  height: 140px;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.2), 0px 9px 10px rgba(0, 0, 0, 0.14),
    0px 5px 14px rgba(0, 0, 0, 0.12);
}

.title {
  color: #ffffff;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-size: 48px;
  line-height: 30px;
  letter-spacing: 0.5px;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.18);
}

.pull-down {
  position: absolute;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0px 4px 4px 0px;
}

.pull-down-content {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
}
.status {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.5px;
  color: rgba(0, 0, 0, 0.87);
}

.icon {
  color: rgba(0, 0, 0, 0.54);
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
}
</style>
