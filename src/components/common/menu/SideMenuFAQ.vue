<script setup lang="ts">
import axios from '@/../mock/faq';
import type { TreeProps } from 'ant-design-vue';
import PlusCircle from '@/components/icon/PlusCircle.vue';
import MinusCircle from '@/components/icon/MinusCircle.vue';
import { array } from 'zod';
import { ref } from 'vue';

const props = defineProps({
  treeData: {
    type: Array,
    default: []
  }, 
  selectedKeys:{
    type: Array,
    default: []
  }
});

const emits = defineEmits(['select']);

let showLine = ref<boolean>(true);

let showIcon = ref<boolean>(true);

const onSelect = (selectedKeys: TreeProps['onSelect'], info: any) => {
  
  emits('select', info.selectedNodes[0]);
};
</script>

<template>
  <div>
    <a-tree :show-line="showLine" :show-icon="showIcon" :tree-data="treeData" @select="onSelect"  :selectedKeys="selectedKeys">
      <template #title="{ dataRef }">
        <span>{{ dataRef.title }}</span>
      </template>
      <template #switcherIcon="{ expanded }">
        <MinusCircle v-if="expanded" />
        <PlusCircle v-else />
      </template>
    </a-tree>
  </div>
</template>

<style scoped>
::v-deep(.ant-tree-title) {
  color: rgba(25, 118, 210, 1);
  font-size: 15px;
  margin-left: 10px;
  font-weight: 400;
}

::v-deep(.ant-tree-show-line .ant-tree-indent-unit::before) {
  border-right: none;
}

::v-deep(.ant-tree-switcher-noop) {
  display: none;
}

::v-deep(.ant-tree-treenode) {
  padding-left: 10px;
  height: 40px;
}

::v-deep(.ant-tree-list-holder-inner) {
  padding-left: 20px;
}

::v-deep(.ant-tree) {
  border-radius: 8px;
}

::v-deep(.ant-tree-treenode-selected::before) {
  background-color: #fff !important;
}

::v-deep(.ant-tree-node-selected) {
  background-color: #bae7ff !important;
}

::v-deep(.ant-tree-treenode:hover::before) {
  background: #fff !important;
}

.title-menu {
  font-weight: 700;
  line-height: 40px;
  font-size: 24px;
  color: #37474f;
  margin: 15px 25px;
}
</style>
