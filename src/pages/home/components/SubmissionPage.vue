<script setup lang="ts">
import { message } from 'ant-design-vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getUserSubmissions } from '@/api/exercise.api';

const route = useRoute();
let isLoading = ref<boolean>(false);

const columns = [
  { title: 'Status', dataIndex: 'status', key: 'status', width: 200 },
  { title: 'CreateAt', dataIndex: 'createAt', key: 'createAt', width: 500 }
];
let submissions = ref<any>('');

const getUserSubmissionsData = async () => {
  let exerciseId: string = route?.query?.id as string;
  isLoading.value = true;

  await getUserSubmissions(exerciseId)
    .then((res: any) => {
      submissions.value = res?.data;
    })
    .catch((error: any) => {
      message.error('Get submission failed!');
    })
    .finally(() => {
      isLoading.value = false;
    });
};

onMounted(async () => {
  await getUserSubmissionsData();
})

</script>

<template>
  <page-layout :is-loading="isLoading">
    <a-table class="ant-table-striped" size="middle" :columns="columns" :data-source="submissions"
      :class="(_record: any, index: any) => (index % 2 === 1 ? 'table-striped' : null)"
      :pagination="{ defaultPageSize: 10 }">
      <template #bodyCell="{ record, column }">
        <template v-if="column.key === 'status'">
          <span v-if="record?.status" class="accepted-submission"> Accepted </span>
          <span v-else class="error-submission"> Error </span>
        </template>

        <template v-if="column.key === 'createAt'">
          <span>{{ record.createdAt }}</span>
        </template>
      </template>
    </a-table>
  </page-layout>
</template>

<style scoped>
@import '../../../assets/styles/color.css';
@import '../../../assets/styles/common.css';

.accepted-submission {
  color: rgb(45 181 93);
  font-weight: 500;
}

.error-submission {
  color: #ef4743;
  font-weight: 500;
}
</style>