<script setup lang="ts">
import { useFaqCreateStore } from '@/stores/faqCreate.store';
import { ref } from 'vue';
const store = useFaqCreateStore();
const props = defineProps({
  ambiguousKeywords: Array
});
const emit = defineEmits(['on-click']);

const handleClick = (item: any) => {
  emit('on-click', item);
};
</script>
<template>
  <div class="related-keyword">
    <div class="card-title">{{ $t('faq.ambiguouKeyword') }}</div>
    <div class="keyword-wrap">
      <div class="keyword-list" v-for="(item, index) in props.ambiguousKeywords">
        <a-button :key="index" class="btn-rounned btn-default keyword" @click="handleClick(item)">
          {{ item }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './../../assets/styles/button.css';
@import './../../assets/styles/common.css';
@import './../../assets/styles/page.css';

.keyword-list {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.keyword-list ::v-deep(.ant-btn) {
  background-color: #ffffff;
  text-transform: none;
}

.keyword {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.keyword-list ::v-deep(.ant-btn > span) {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.keyword-wrap {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  width: 100%;
}
</style>
