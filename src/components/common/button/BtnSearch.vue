<script setup lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue';

interface Props {
  placeholder: string;
  span?: number;
  size?: 'large' | 'default' | 'small';
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  size: 'large',
  span: 24
});
</script>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  emits: ['handle-search', 'clear-search'],
  data() {
    return {
      valueSearch: null
    };
  },
  methods: {
    handleSearch(searchValue: string) {
      this.$emit('handle-search', searchValue);
    },
    clearSearch() {
      this.valueSearch = null;
      this.$emit('clear-search');
    }
  }
});
</script>

<template>
  <a-row class="input-search">
    <a-col :span="span">
      <div class="d-flex">
        <a-input-search
          v-model:value="valueSearch"
          :placeholder="placeholder"
          :size="size"
          @search="handleSearch"
        >
          <template #enterButton>
            <a-button class="btn-faq">
              <SearchOutlined /> {{ $t('faq.form.button.search') }}
            </a-button>
          </template>
        </a-input-search>

        <a-button
          type="primary"
          class="m-r-15 btn-common btn-rounned btn-clear-search"
          @click="clearSearch()"
        >
          {{ $t('faq.form.button.clearSearch') }}
        </a-button>
      </div>
    </a-col>
  </a-row>
</template>

<style scoped>
@import '@/assets/styles/common.css';
@import '@/assets/styles/button.css';

.btn-clear-search {
  height: 40px !important;
  margin-left: 20px;
}
</style>
