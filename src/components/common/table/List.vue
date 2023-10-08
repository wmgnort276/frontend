<script lang="ts">
import { defineComponent } from 'vue';
import Questions from '@/components/icon/Questions.vue';
import ArrowRight from '@/components/icon/ArrowRight.vue';
import router from '@/router';

export default defineComponent({
  name: 'TableList',
  components: { Questions },
  emits: ['clicked'],
  props: {
    tableData: {
      type: Array,
      required: true,
      default: null
    }
  },
  methods: {
    changeFaqDetail(faq: any) {
      this.$emit('clicked', faq);
    }
  }
});
</script>

<template>
  <div class="list-data list-faq-items">
    <a-list item-layout="horizontal" :data-source="tableData">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta description="" @click="changeFaqDetail(item)">
            <template #title>
              <div class="faq-item-body">
                <span class="faq-item-title">{{ item.content }}</span>
                <ArrowRight></ArrowRight>
              </div>
            </template>
            <template #avatar>
              <Questions></Questions>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<style scoped>
::v-deep(.ant-list-item-meta-content) {
  padding-top: 15px;
}
</style>
