<script setup lang="ts">
import table from '@/stores/mixins/table';
</script>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Pagination',
  emits: ['update:page', 'update:limit', 'pagination'],
  props: {
    total: {
      type: Number,
      required: true
    },
    totalData: {
      type: Number,
      required: true
    },
    page: {
      type: Number,
      required: true,
      default: 1
    },
    limit: {
      type: Number,
      required: true,
      default: 10
    },
    pageSizeOptions: {
      type: Array,
      default: ref<string[]>(['10', '30', '50'])
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(val: any) {
        this.$emit('update:page', val);
      }
    },
    pageSize: {
      get() {
        return this.limit;
      },
      set(val: any) {
        this.$emit('update:limit', val);
      }
    }
  },
  methods: {
    onChangePage(pageNumber: number, pageSize: number) {
      this.$emit('pagination', { page: pageNumber, limit: pageSize });
    }
  }
});
</script>

<template>
  <div class="pagination">
    <div class="show-pagination">
      <div class="d-flex">
        <div class="p-2 mr-7 text-base">
          {{ $t('common.page.pagination.items&page') }}
        </div>

        <div class="p-2 mr-7 text-base">
          {{ table.getNumberRecords(currentPage, pageSize, total) }}
        </div>
      </div>

      <a-pagination
        v-model:current="currentPage"
        v-model:page-size="pageSize"
        :page-size-options="pageSizeOptions"
        :total="total"
        show-size-changer
        @change="onChangePage"
      >
        <template #buildOptionText="props">
          <span>{{ props.value }}</span>
        </template>
      </a-pagination>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  width: 100%;
  float: right;
}
.show-pagination {
  display: flex;
  float: right;
}

@media screen and (max-width: 540px) {
  .show-pagination {
    float: left;
    display: contents;
  }

  .mr-7 {
    margin-right: 0;
  }
}
</style>
