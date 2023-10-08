<script lang="ts">
import { defineComponent } from 'vue';
import table from '@/stores/mixins/table';
import { NOTIFICATION_BUSINESS_DIVISION } from '@/stores/constants/constant';
import IconCommentTop from '@/components/icon/top/IconCommentTop.vue';
import type { Notifications } from '@/types/interfaces/top';

export default defineComponent({
  name: 'NotificationList',
  components: { IconCommentTop },
  computed: {
    table() {
      return table;
    }
  },
  data() {
    return {
      notification_business_division: NOTIFICATION_BUSINESS_DIVISION
    };
  },
  props: {
    notificationList: {
      type: Array<Notifications>,
      required: true,
      default: () => []
    }
  },
  methods: {}
});
</script>

<template>
  <div class="list-notification">
    <div class="title-card">{{ $t('top.table.notification_list.title') }}</div>
    <div class="table-content">
      <a-row v-for="(item, index) in notificationList" :key="index" class="row-notification">
        <div class="business-division-content d-flex">
          <div v-for="(businessDivision, key) in item.business_division" :key="key">
            <span
              v-if="businessDivision === notification_business_division.SOCIAL_SECURITY"
              class="business-division social"
            >
              {{ $t('top.table.notification_list.social_security') }}
            </span>

            <span
              v-else-if="businessDivision === notification_business_division.IMPORTANT"
              class="business-division important"
            >
              {{ $t('top.table.notification_list.important') }}
            </span>

            <span
              v-else-if="businessDivision === notification_business_division.UNREAD"
              class="business-division unread"
            >
              {{ $t('top.table.notification_list.unread') }}
            </span>

            <span
              v-else-if="businessDivision === notification_business_division.YEAR"
              class="business-division year"
            >
              {{ $t('top.table.notification_list.year') }}
            </span>
          </div>
        </div>
        <div class="row-content date-notification">
          {{ table.formatDate(new Date(item.created_at), 'YYYY/M/D') ?? null }}
        </div>
        <div class="row-content content-notification">
          {{ item.content ?? null }}
        </div>
      </a-row>
    </div>
    <div class="f-r">
      <router-link to="">
        <div class="notification">
          <div class="icon-cmt">
            <IconCommentTop></IconCommentTop>
          </div>
          <div class="text-all-noti">
            <span>{{ $t('top.button.all_notification') }}</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.list-notification {
  padding: 25px 40px 34px 30px;
  border-radius: 8px;
  gap: 20px;
  background-color: #fff;
  display: flow-root;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
    0 1px 5px rgba(0, 0, 0, 0.12);
}

.notification {
  display: flex;
  height: 50px;
  width: 232px;
  border: 1px solid rgba(25, 118, 210, 1);
  border-radius: 4px;
  padding: 12px 16px;
}

.text-all-noti {
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  color: rgba(25, 118, 210, 1);
  margin-left: 12px;
}

.table-content {
  margin: 25px 25px 0 15px;
}

.row-notification {
  height: 44px;
  padding: 5px 0;
}

.row-content {
  font-size: 20px;
  font-weight: 500;
  line-height: 25px;
}

.business-division {
  height: 34px;
  width: 56px;
  padding: 6px 12px;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  border-radius: 36px;
  margin: 7px;
  color: #fff;
}

.business-division-content {
  width: 30%;
}

.date-notification {
  width: 12%;
}

.content-notification {
  width: 58%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(0, 0, 0, 1);
  padding-left: 15px;
}

.d-flex {
  display: flex;
}

.f-r {
  float: right;
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

@media only screen and (max-width: 980px) {
  .business-division-content {
    width: 75%;
    margin: 5px;
  }

  .row-notification {
    height: 80px;
  }

  .row-content {
    margin: 5px;
  }

  .content-notification {
    width: 100%;
  }
}

@media only screen and (max-width: 540px) {
  .table-content {
    margin: 20px 10px 10px 10px;
  }

  .business-division-content {
    width: 100%;
    margin: 5px 0;
  }

  .date-notification {
    width: 100%;
  }

  .row-content {
  }

  .content-notification {
    padding-left: 0;
  }

  :deep(.ant-row) {
    height: auto;
  }
}
</style>
