<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';
import { useAuthStoreHook } from '@/stores/auth.store';
import { useUserStore } from '@/stores/user.store';
import router from '@/router';

const authStore = useAuthStoreHook();
const userStore = useUserStore();

let isLoading = ref<boolean>(false);

onMounted(async () => {
  await Promise.all([
    userStore.getUserResolveExercises(),
    userStore.getAllExercises(),
    authStore.getAuthInfo()
  ]);
});

const handleLogout = () => {
  authStore.clearAuthInfo();
  location.reload();
};

const chooseExercise = async (record: any) => {
  await router.push(`/exercises/desc?id=${record.exerciseId}&name=${record.exerciseName}`);
};
</script>

<template>
  <page-layout :is-loading="isLoading">
    <div class="main-page">
      <div class="flex gap-20 wrapper">
        <a-col :md="6" class="card">
          <a-row class="user-information flex gap-20">
            <a-col class="pointer">
              <img src="../../components/icons8-user-48.png" />
            </a-col>
            <a-col>
              <a-row style="font-weight: 700"> {{ authStore.userName }} </a-row>
              <a-row> Score: {{ authStore.authUser?.score }} </a-row>
            </a-col>
          </a-row>

          <a-row class="button-edit-info mt-10">
            <a-button class="edit-profile">Edit Profile</a-button>
          </a-row>

          <a-row class="button-edit-info mt-10">
            <a-button class="edit-profile" @click="handleLogout">Logout</a-button>
          </a-row>

          <a-divider />

          <a-row class="flex-column gap-10">
            <a-row>
              <h4>Skills</h4>
            </a-row>

            <a-row>
              <h5>Advanced</h5>
            </a-row>

            <!-- User skills -->
            <a-row
              class="flex align-center mb-10"
              v-for="(item, index) in userStore.listExerciseCategories"
            >
              <a-button class="button-classify-problem mr-10">
                {{ item.exerciseTypeName }}</a-button
              >
              <s-pan> x {{ item.count }}</s-pan>
            </a-row>
          </a-row>
        </a-col>

        <a-col :md="16" class="flex-column gap-20">
          <a-row class="solved-problems flex-column card">
            <a-row>
              <h5>Solved Problems</h5>
            </a-row>
            <a-row class="flex gap-10 align-center">
              <a-col :md="6" class="mt-20">
                <a-progress type="circle" :percent="userStore.totalPercent" size="small" />
              </a-col>
              <a-col :md="16">
                <a-row>
                  <span class="mr-50">Easy</span>
                  <span>
                    {{ userStore.easyExerciseCount }} / {{ userStore.totalEasyExerciseCount }}
                  </span>
                  <a-progress :percent="userStore.easyPercent" class="progress easy" />
                </a-row>

                <a-row>
                  <span class="mr-50">Medium</span>
                  <span>
                    {{ userStore.mediumExerciseCount }} / {{ userStore.totalMediumExerciseCount }}
                  </span>
                  <a-progress :percent="userStore.mediumPercent" class="progress medium" />
                </a-row>

                <a-row>
                  <span class="mr-50">Hard</span>
                  <span>
                    {{ userStore.hardExerciseCount }} / {{ userStore.totalHardExerciseCount }}
                  </span>
                  <a-progress :percent="userStore.hardPercent" class="progress hard" />
                </a-row>
              </a-col>
            </a-row>
          </a-row>

          <a-row class="card flex-column">
            <a-row class="flex list-problem-header">
              <h4 class="pointer">Recent AC</h4>
            </a-row>
            <a-row>
              <a-table
                :columns="userStore.columns"
                :data-source="userStore.listResolveExercise"
                :pagination="{ defaultPageSize: 10 }"
              >
                <template #bodyCell="{ record, column }">
                  <template v-if="column.key === 'name'">
                    <a @click="() => chooseExercise(record)">{{ record.exerciseName }}</a>
                  </template>

                  <template v-if="column.key === 'level'">
                    <span
                      :class="{
                        easy: record?.exerciseLevelName == 'Easy',
                        medium: record?.exerciseLevelName == 'Medium',
                        hard: record?.exerciseLevelName == 'Hard'
                      }"
                      >{{ record.exerciseLevelName }}</span
                    >
                  </template>
                </template>
              </a-table>
            </a-row>
          </a-row>
        </a-col>
      </div>
    </div>
  </page-layout>
</template>

<style scoped>
@import '../../assets/styles/common.css';
@import '../../assets/styles/color.css';

.main-page {
  min-height: 100%;
  height: fit-content !important;
}
.wrapper {
  max-width: 80%;
  margin: 0 auto;
  padding-top: 30px;
  padding-bottom: 30px;
}

.edit-profile {
  background-color: #2db55d26;
  border: none;
  border-radius: 5px;
  width: 100%;
  font-weight: 500;
  color: rgb(0, 175, 128);
  height: 40px;
}

.progress :deep(.ant-progress-text) {
  display: none;
}

.easy :deep(.ant-progress-inner) {
  background-color: #2db55d26;
}

.easy :deep(.ant-progress-bg) {
  background-color: rgb(0, 175, 155);
}

.medium :deep(.ant-progress-inner) {
  background-color: #ffb80026;
}

.medium :deep(.ant-progress-bg) {
  background-color: rgb(255, 184, 0);
}

.hard :deep(.ant-progress-inner) {
  background-color: #ef474326;
}

.hard :deep(.ant-progress-bg) {
  background-color: rgb(239, 71, 67);
}

.list-problem-header {
  justify-content: space-between;
}
</style>
