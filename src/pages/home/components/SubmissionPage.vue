<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { FieldTimeOutlined } from '@ant-design/icons-vue';
import { useSubmissionStore } from '@/stores/submission.store';
import PageLayout from '@/pages/layouts/PageLayout.vue';
import { useExerciseStore } from '@/stores/exercise.store';
import { convertByteToMb } from '@/utils/index';
import dayjs from 'dayjs';

const route = useRoute();
let isLoading = ref<boolean>(false);
const submissionStore = useSubmissionStore();
const exerciseStore = useExerciseStore();
const exerciseId = ref<string>(route?.query?.id as string);

const getUserSubmissionsData = async () => {
  isLoading.value = true;
  await submissionStore.getUserSubmissionsData(exerciseId.value);
  isLoading.value = false;
};

onMounted(async () => {
  await getUserSubmissionsData();
  if(!exerciseStore.exerciseFlag) {
    await exerciseStore.getExerciseDetail(exerciseId.value)
  }
})
</script>

<template>
  <page-layout :is-loading="isLoading">
    <a-table class="ant-table-striped" size="middle" :columns="submissionStore.columns"
      :data-source="submissionStore.submissionList"
      :class="(_record: any, index: any) => (index % 2 === 1 ? 'table-striped' : null)"
      :pagination="{ defaultPageSize: 10 }">
      <template #bodyCell="{ record, column }">
        <template v-if="column.key === 'status'">
          <span v-if="record?.status" class="accepted-submission"> Accepted </span>
          <span v-else class="error-submission"> Error </span>
        </template>

        <template v-if="column.key === 'createAt'">
          <span>{{ dayjs(record.createdAt).format("YYYY-MM-DD hh:ss:mm") }}</span>
        </template>

        <template v-if="column.key === 'runtime'">
          <span>
            <FieldTimeOutlined />
            <span class="ml-5">{{ record.runtime }} ms</span>
          </span>
        </template>

        <template v-if="column.key === 'memory'">
          <span>
            <FieldTimeOutlined />
            <span class="ml-5">{{ convertByteToMb(record.memory) }} MB</span>
          </span>
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