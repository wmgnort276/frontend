<script setup lang="ts">
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  total: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  }
});

const emit = defineEmits(['changePage']);

const onChangePage = (page: number) => {
  emit('changePage', page);
};
</script>

<template>
  <a-pagination
    size="large"
    :current="props.currentPage"
    :page-size="props.pageSize"
    :total="props.total"
    @change="onChangePage"
  >
    <template #itemRender="{ type, originalElement }">
      <a v-if="type === 'prev'"><double-left-outlined></double-left-outlined></a>
      <a v-else-if="type === 'next'"><double-right-outlined></double-right-outlined></a>
      <component :is="originalElement" v-else></component>
    </template>
  </a-pagination>
</template>

<style scoped>
::v-deep(.ant-pagination-options) {
  display: none !important;
}

::v-deep(.ant-pagination-item-active) {
  border-color: black;
  background: black;
  color: #ffffff !important;
}

::v-deep(.ant-pagination-item) {
  border-radius: 4px !important;
  border-color: black;
  color: black !important;
  width: 36px;
  height: 36px;
  font-size: 18px;
}

::v-deep(.ant-pagination-item-active a) {
  color: #ffffff !important;
}

::v-deep(.ant-pagination-item a) {
  padding: 0 !important;
}

::v-deep(.ant-pagination-next a) {
  color: black;
}

::v-deep(.ant-pagination-prev a) {
  color: black;
}

::v-deep(.ant-pagination-item-link-icon) {
  color: black !important;
}

::v-deep(.ant-pagination-item:hover a) {
  color: black;
}

@media screen and (max-width: 540px) {
  .ant-pagination {
    min-width: 355px;
  }
}
</style>
