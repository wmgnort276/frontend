<script setup lang="ts">
import type { BreadCrumbs } from '@/types/interfaces/faq';

const props = defineProps({
  breadCrumbs: {
    type: Array<BreadCrumbs>,
    default: () => []
  }
});

const emit = defineEmits(['click-breadCrumb']);

const handleClick = (breadCrumb: any, index: number) => {
  emit('click-breadCrumb', { breadCrumb: breadCrumb, index: index });
};
</script>

<template>
  <a-breadcrumb v-if="props.breadCrumbs?.length > 0" class="breadCrumb" separator=">">
    <a-breadcrumb-item
      :class="[breadCrumb.class, 'item']"
      v-for="(breadCrumb, index) in props.breadCrumbs"
      :key="index"
      @click="handleClick(breadCrumb, index)"
    >
      <span>{{ breadCrumb.name ?? '' }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<style scoped>
.item ::v-deep(.ant-breadcrumb-link) {
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: black;
  cursor: pointer;
}

.last-category ::v-deep(.ant-breadcrumb-separator) {
  display: none;
}

.last-category ::v-deep(.ant-breadcrumb-link) {
  margin-right: 12px;
}

.breadCrumb ::v-deep(.ant-breadcrumb-separator) {
  color: black;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  vertical-align: text-top;
  letter-spacing: 0.25px;
  margin: 20px;
}

@media screen and (max-width: 540px) {
  ::v-deep(.ant-breadcrumb-link) {
    font-size: 10px !important;
  }

  ::v-deep(.ant-breadcrumb-separator) {
    font-size: 10px !important;
    margin: 10px !important;
    line-height: 30px !important;
  }
}
</style>
