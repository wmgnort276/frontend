<template>
  <div class="alert-container" v-if="showAlert">
    <div class="alert" :class="alertClass">
      <div class="content">
        <component :is="getIconComponent"></component>
        <div class="mx-18" v-if="type !== 'info'">{{ message }}</div>
        <div v-if="haveCloseButton" @click.stop="closeAlert" class="ml-20 close-icon">
          <CloseCircleFilled v-if="type === 'warning'" />
          <CloseCircleOutlined v-else />
        </div>
      </div>
      <div v-if="type === 'info'">{{ message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  ExclamationCircleFilled,
  CloseCircleOutlined,
  CloseCircleFilled
} from '@ant-design/icons-vue';

import CheckCircle from '@/components/icon/CheckCircle.vue';
import CommentAlert from '@/components/icon/CommentAlert.vue';
import Exclama from '@/components/icon/Exclama.vue';

interface Props {
  type?: string;
  haveCloseButton?: boolean;
  message: string;
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'success',
  haveCloseButton: true,
  duration: 0
});

let showAlert = ref(true);

const alertClass = computed(() => {
  return `alert ${props.type} ${props.type === 'info' ? 'border' : ''}`;
});

const getIconComponent = computed(() => {
  switch (props.type) {
    case 'info':
      return ExclamationCircleFilled;
    case 'success':
      return CheckCircle;
    case 'warning':
      return CommentAlert;
    case 'error':
      return Exclama;
    default:
      return null;
  }
});

const closeAlert = () => {
  showAlert.value = false;
};

onMounted(() => {
  if (props?.duration) {
    setTimeout(() => {
      closeAlert();
    }, props.duration);
  }
});
</script>

<style scoped>
@import './../../assets/styles/common.css';
.alert-container {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  top: 170px;
  right: 10px;
}
.alert {
  background-color: yellow;
  padding: 10px;
  opacity: 1;
  transition: opacity 0.3s;
  border-radius: 4px;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.5px;
}
.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-icon {
  padding: 5px;
  cursor: pointer;
}
.info {
  color: 55838F;
  background-color: rgb(231, 249, 253);
  border-color: 55838F;
}
.success {
  color: #43a047;
  background-color: rgba(67, 160, 71, 0.12);
  border-color: #43a047;
}
.warning {
  color: #fb8c00;
  background-color: rgba(251, 140, 0, 0.12);
  border-color: #fb8c00;
}
.error {
  color: #ef5350;
  background-color: rgba(239, 83, 80, 0.12);
  border-color: #ef5350;
}
.border {
  border: 1px solid;
}
</style>
