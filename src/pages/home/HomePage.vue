<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';
import { getExerciseType, getExerciseLevel, getExerciseApi } from '@/api/exercise.api';
import { message } from 'ant-design-vue';
import type { ExerciseType, ExerciseLevel, Exercise } from '@/types/interfaces/exercise';
import router from '@/router';
import { useAuthStoreHook } from '@/stores/auth.store';
import DoneIcon from '@/components/DoneIcon.vue';

const authStore = useAuthStoreHook();
const isLoading = ref<boolean>(false);
const listCategory = ref<ExerciseType[]>([]);
const exerciseLevels = ref<ExerciseLevel[]>([]);
const exercises = ref<Exercise[]>([]);
const queryBuilder = ref<any>({
  exerciseLevelId: '',
  exerciseTypeId: '',
  keyword: '',
  pageIndex: 1,
  pageSize: 5
});

const optionsExercise = ref<any[]>([
  {
    id: 'Most resolve problem',
    name: 'Most resolve problem'
  }
]);

const columns = [
  { title: 'Status', dataIndex: 'status', key: 'status', width: 100 },
  { title: 'Title', dataIndex: 'title', key: 'title', width: 600 },
  // { title: 'Acceptance', dataIndex: 'acceptance', key: 'acceptance' },
  { title: 'Difficulty', dataIndex: 'level', key: 'level' }
];

const columnsAdmin = [
  { title: 'Title', dataIndex: 'title', key: 'title', width: 500 },
  { title: 'Level', dataIndex: 'level', key: 'level' },
  { title: 'Action', dataIndex: 'action', key: 'action' }
];

const getExerciseCategory = async () => {
  await getExerciseType()
    .then((res: any) => {
      listCategory.value = res?.data;
    })
    .catch((error: any) => {
      // message.error('Fail to get category');
    });
};

const getExerciseLevels = async () => {
  await getExerciseLevel()
    .then((res: any) => {
      exerciseLevels.value = res?.data;
    })
    .catch((error: any) => {
      // message.error('Fail to get exercise level');
    });
};

const getExercise = async () => {
  queryBuilder.value = {
    ...queryBuilder.value,
    exerciseLevelId: queryBuilder.value.exerciseLevelId ?? ''
  };
  await getExerciseApi(queryBuilder.value)
    .then((res: Exercise[]) => {
      exercises.value = res;
    })
    .catch((error: any) => {
      // message.error('Fail to get exercise');
    });
};

onMounted(async () => {
  isLoading.value = true;
  await Promise.all([getExerciseCategory(), getExerciseLevels(), getExercise()]);
  isLoading.value = false;
});

const chooseExercise = async (record: Exercise) => {
  await router.push(`/exercises/desc?id=${record.id}&name=${record.name}`);
};

const handleEditExercise = async (record: any) => {
  await router.push(`/exercise-edit?id=${record.id}`);
};

const handleSelectType = async (item: ExerciseType) => {
  queryBuilder.value = {
    ...queryBuilder.value,
    exerciseTypeId: item.id
  };
  isLoading.value = true;
  await getExercise();
  isLoading.value = false;
};

const handleSelectAll = async () => {
  queryBuilder.value = {
    ...queryBuilder.value,
    exerciseTypeId: ''
  };
  isLoading.value = true;
  await getExercise();
  isLoading.value = false;
};

const onSearch = async () => {
  await getExercise();
};
</script>

<template>
  <page-layout :is-loading="isLoading">
    <div class="main-page">
      <div class="wrapper">
        <div class="exercise-category flex">
          <a-button class="button-classify-problem mr-10" @click="handleSelectAll">All</a-button>
          <div v-for="(item, index) in listCategory" :key="index" class="inline">
            <a-button class="button-classify-problem mr-10" @click="() => handleSelectType(item)">
              {{ item.name }}</a-button
            >
          </div>
        </div>

        <!-- Filter exercise -->
        <div class="filter-exercise flex mb-20">
          <!-- <a-select class="select" placeholder="Lists" :options="optionsExercise" :fieldNames="{
            value: 'id',
            label: 'name'
          }"></a-select> -->

          <a-select
            class="select"
            placeholder="Level"
            :options="exerciseLevels"
            :fieldNames="{
              value: 'id',
              label: 'name'
            }"
            v-model:value="queryBuilder.exerciseLevelId"
            allowClear
            @change="getExercise"
          >
          </a-select>

          <a-input-search
            v-model:value="queryBuilder.keyword"
            style="width: 230px"
            placeholder="Search..."
            enter-button
            @search="onSearch"
          />
        </div>

        <!-- Table of exercise -->
        <div>
          <a-table
            class="ant-table-striped"
            size="middle"
            :columns="authStore.isAdmin ? columnsAdmin : columns"
            :data-source="exercises"
            :class="(_record: any, index: any) => (index % 2 === 1 ? 'table-striped' : null)"
            :pagination="{ defaultPageSize: 5 }"
          >
            <template #bodyCell="{ record, column }">
              <template v-if="column.key === 'status'">
                <DoneIcon v-if="record.isResolved" />
              </template>

              <template v-if="column.key === 'title'">
                <a @click="chooseExercise(record)" class="exercise-name">{{ record?.name }}</a>
              </template>

              <template v-if="column.key === 'level'">
                <span
                  :class="{
                    easy: record?.exerciseLevelName == 'Easy',
                    medium: record?.exerciseLevelName == 'Medium',
                    hard: record?.exerciseLevelName == 'Hard'
                  }"
                  >{{ record?.exerciseLevelName }}</span
                >
              </template>

              <template v-if="column.key === 'action'">
                <a-button @click="() => handleEditExercise(record)">Edit</a-button>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </page-layout>
</template>

<style scoped>
@import '../../assets/styles/common.css';
@import '../../assets/styles/color.css';

.wrapper {
  max-width: 80%;
  margin: 0 auto;
  padding-top: 30px;
}

.exercise-category {
  flex-wrap: wrap;
  gap: 10px;
}

.button-classify-problem {
  background-color: #d5e6da26;
  box-shadow: rgba(9, 9, 9, 0.35) 0px 5px 15px;
}

.filter-exercise {
  margin-top: 30px;
  gap: 20px;
}

.select {
  width: 220px;
  border: none;
}

:deep(.table-striped) {
  background-color: rgb(221, 229, 235);
}

.exercise-name {
  color: rgb(115, 147, 147);
}

:deep(.ant-input) {
  height: 32px;
}

:deep(.ant-input-group-addon) {
  height: 31px;
}

.filter-exercise :deep(.ant-input-group-addon) {
  display: none;
}

:deep(.ant-select-selector) {
  border-radius: 8px !important;
}

:deep(.ant-input) {
  border-radius: 8px !important;
}
</style>
