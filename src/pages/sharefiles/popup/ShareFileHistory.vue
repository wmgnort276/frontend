<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { computed, ref } from 'vue';
import table from '@/stores/mixins/table';

const props = defineProps({
  status: {
    type: Boolean,
    required: true
  },
  histories: {
    type: Array,
    required: true,
    default() {
      return [];
    }
  }
});

const tableFormat = computed(() => {
  return table;
});

const emits = defineEmits(['cancel']);

let loading = ref<boolean>(false);

const columns = [
  {
    title: t('sharefile.history.table.timeProcess'),
    key: 'timeProcess',
    width: '250px'
  },
  {
    title: t('sharefile.history.table.processUser'),
    key: 'processUser',
    width: '150px'
  },
  {
    title: t('sharefile.history.table.processStatus'),
    key: 'processStatus',
    width: '150px'
  },
  {
    title: t('sharefile.history.table.assignedTo'),
    key: 'assignedTo',
    width: '150px'
  },
  {
    title: t('sharefile.history.table.comment'),
    key: 'comment',
    width: '250px',
    ellipsis: true
  }
];

const handleClose = () => {
  emits('cancel');
};
</script>

<template>
  <a-modal :visible="props.status" centered :footer="null" :closable="false">
    <div class="main-page">
      <div class="card">
        <!-- Page header -->
        <div class="section-header">{{ $t('sharefile.history.header') }}</div>

        <!-- Table title -->
        <div class="title">
          <span>
            {{ $t('sharefile.history.table.title') }}
          </span>
        </div>

        <!-- Table data -->
        <div class="history-table">
          <a-table
            class="ant-table-striped"
            size="middle"
            :columns="columns"
            :data-source="histories"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'timeProcess'">
                <div>
                  <span class="table-data">
                    {{ tableFormat.formatDate(new Date(record.timeProcess), 'YYYY/MM/DD HH:mm') }}
                  </span>
                </div>
              </template>

              <template v-else-if="column.key === 'processUser'">
                <span class="table-data">
                  {{ record.processUser }}
                </span>
              </template>

              <template v-else-if="column.key === 'processStatus'">
                <span class="table-data">
                  {{ record.processStatus }}
                </span>
              </template>

              <template v-else-if="column.key === 'assignedTo'">
                <span class="table-data">
                  {{ record.assignedTo }}
                </span>
              </template>

              <template v-else-if="column.key === 'comment'">
                <span class="table-data">
                  {{ record.comment }}
                </span>
              </template>
            </template>
          </a-table>
        </div>

        <!-- Button-->
        <div class="close-btn">
          <a-button type="primary" class="btn-common btn-rounned" @click="handleClose">
            {{ $t('sharefile.history.closeButton') }}
          </a-button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
@import './../../../assets/styles/common.css';
@import './../../../assets/styles/page.css';
@import './../../../assets/styles/button.css';

.main-page {
  max-width: 1120px;
  margin: 0 auto;
}

.section-header {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 40px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.87);
  margin-bottom: 20px;
}

.history-table {
  margin-left: 20px;
}

.title {
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.95);
  margin-bottom: 20px;
}

::v-deep(.ant-table-pagination.ant-pagination) {
  display: none;
}

::v-deep(.ant-table-thead > tr > th) {
  background-color: #cfd8dc;
  font-weight: 700;
  font-size: 15px;
  line-height: 20px;
  padding: 10px 16px !important;
  color: #37474f;
}

::v-deep(.ant-table-tbody > tr > td) {
  padding: 10px 16px !important;
}

.table-data {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.87);
}

.close-btn {
  align-items: center;
  justify-content: center;
  display: flex;
  margin-top: 30px;
}
</style>

<style>
.ant-modal {
  min-width: 1120px !important;
}
</style>
