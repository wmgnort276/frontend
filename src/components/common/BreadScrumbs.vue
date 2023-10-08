<script setup lang="ts">
const props = defineProps({
  breadcrumbsList: Array
});

const emit = defineEmits(['on-click']);

const handleClick = (index: number) => {
  emit('on-click', index);
};
</script>

<template>
  <a-breadcrumb class="breadScrumb" separator=">">
    <a-breadcrumb-item
      class="item"
      v-for="(item, index) in props.breadcrumbsList"
      :key="index"
      @click="handleClick(index)"
    >
      <span v-if="!!item">{{ item }}</span>
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

.breadScrumb ::v-deep(.ant-breadcrumb-separator) {
  color: black;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  vertical-align: text-top;
  letter-spacing: 0.25px;
  margin: 15px;
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
