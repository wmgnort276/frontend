<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { UserOutlined, HomeOutlined } from '@ant-design/icons-vue';
import type { Component } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const selectedKeys = ref<string[]>([]);
interface IMenu {
  path: string;
  label: string;
  name: string;
  iconComponent: Component;
}

const menu: IMenu[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    name: 'dashboard',
    iconComponent: HomeOutlined
  },
  {
    path: '/users',
    label: 'User',
    name: 'users',
    iconComponent: UserOutlined
  }
];
onMounted(() => {
  selectedKeys.value = [route.fullPath];
});
watch(
  () => route.fullPath,
  (newFullPath) => {
    if (!selectedKeys.value.includes(newFullPath)) {
      selectedKeys.value = [newFullPath];
    }
  }
);
</script>
<template>
  <div class="logo" style="height: 60px">loggo</div>
  <a-menu
    v-model:selected-keys="selectedKeys"
    mode="inline"
    theme="dark"
    :style="{
      overflow: 'hidden',
      overflowY: 'auto',
      maxHeight: 'calc(100vh - 80px)'
    }"
  >
    <a-menu-item :key="item.path" v-for="item in menu">
      <router-link :to="item.path">
        <component :is="item.iconComponent" style="font-size: 20px" />
        <span>{{ item.label }}</span>
      </router-link>
    </a-menu-item>
  </a-menu>
</template>
