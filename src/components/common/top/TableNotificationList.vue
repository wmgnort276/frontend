<script lang="ts">
import { defineComponent } from 'vue';
import { NOTIFICATION_BUSINESS_DIVISION, NOTIFICATION_STATUS } from '@/stores/constants/constant';
import table from '@/stores/mixins/table';
import { t } from '@/plugins/i18n';

export default defineComponent({
  name: 'TableNotificationList',
  computed: {
    table() {
      return table;
    }
  },
  props: {
    columns: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      business_division: NOTIFICATION_BUSINESS_DIVISION,
      notification_status: NOTIFICATION_STATUS,
      locale: { emptyText: t('common.table.empty_data') }
    };
  },
  methods: {
    fillData(row: any, columns: any) {
      columns = columns + '';
      const columnArray = columns.split('.');
      let result = { ...row };
      columnArray.forEach((el: string | number) => {
        (result && result[el]) || (result && result[el] === 0)
          ? (result = result[el])
          : (result = null);
      });

      return result;
    }
  }
});
</script>

<template>
  <div class="table-notifications">
    <div class="table-content">
      <a-table
        :locale="locale"
        class="ant-table-striped"
        size="middle"
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :row-class-name="(_record:any, index:any) => (index % 2 === 1 ? 'table-striped' : null)"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.type === 'date'">
            <span class="fs-16">
              {{ table.formatDate(new Date(fillData(record, column.dataIndex)), 'YYYY/M/D') }}
            </span>
          </template>

          <template v-else-if="column.type === 'array' && column.key === 'business_division'">
            <span v-for="item in fillData(record, column.dataIndex)" :key="item">
              <button v-if="item === business_division.SOCIAL_SECURITY" class="btn-business social">
                {{ $t('top.table.notification_list.social_security') }}
              </button>
              <button
                v-else-if="item === business_division.IMPORTANT"
                class="btn-business important"
              >
                {{ $t('top.table.notification_list.important') }}
              </button>
              <button v-else-if="item === business_division.UNREAD" class="btn-business unread">
                {{ $t('top.table.notification_list.unread') }}
              </button>
              <button v-else-if="item === business_division.YEAR" class="btn-business year">
                {{ $t('top.table.notification_list.year') }}
              </button>
            </span>
          </template>

          <template v-else-if="column.type === 'status' || column.type === 'situation'">
            <button
              v-if="fillData(record, column.dataIndex) === notification_status.ACCEPTED"
              class="btn-status accepted"
            >
              {{ $t('top.table.notification_list.year') }}
            </button>
            <button
              v-else-if="fillData(record, column.dataIndex) === notification_status.SENT"
              class="btn-status sent"
            >
              {{ $t('top.table.notification_list.year') }}
            </button>
            <button
              v-else-if="fillData(record, column.dataIndex) === notification_status.RECEIVED"
              class="btn-status received"
            >
              {{ $t('top.table.notification_list.year') }}
            </button>
          </template>

          <template v-else>
            <span class="fs-16">{{ fillData(record, column.dataIndex) }}</span>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped>
.ant-table-striped ::v-deep(.table-striped) td {
  background-color: #eceff1;
}

.table-content {
  margin-top: 20px;
}

.btn-business {
  width: 56px;
  height: 29px;
  border-radius: 16px;
  margin-right: 14px;
  color: #fff;
  border: none;
  font-size: 16px;
}

.btn-status {
  width: 72px;
  height: 29px;
  border-radius: 16px;
  color: rgba(0, 0, 0, 0.87);
  border: none;
  font-size: 16px;
}

.fs-16 {
  font-size: 16px;
}

.received {
  background-color: rgba(0, 0, 0, 0.12);
}

.sent {
  background-color: rgba(187, 222, 251, 0.6);
}

.accepted {
  background-color: rgba(178, 223, 219, 0.6);
}

.year {
  background-color: rgba(0, 137, 123, 0.8);
}

.important {
  background-color: rgba(229, 57, 53, 0.8);
}

.unread {
  background-color: rgba(251, 140, 0, 0.8);
}

.social {
  background-color: rgba(21, 101, 192, 0.8);
}

::v-deep(.ant-table-thead) > tr > th {
  background-color: rgba(207, 216, 220, 1);
  color: rgba(55, 71, 79, 1);
  font-size: 16px;
  font-weight: 700;
}

::v-deep(
    .ant-table-thead
      > tr
      > th:not(:last-child):not(.ant-table-selection-column):not(
        .ant-table-row-expand-icon-cell
      ):not([colspan])::before
  ) {
  width: 0 !important;
}
</style>
