<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useExerciseStore } from '@/stores/exercise.store'

const route = useRoute();
const exerciseStore = useExerciseStore();
const isLoading = ref<boolean>(false);
const rateValue = ref<number>(3);
const exerciseId: string = route?.query?.id as string;

const getExerciseDetail = async (id: string) => {
  isLoading.value = true;
  await exerciseStore.getExerciseDetail(id);
  isLoading.value = false;
};

getExerciseDetail(exerciseId);
</script>

<template>
  <div>
    <a-row>
      <h4>{{ exerciseStore.exercise?.name }}</h4>
    </a-row>
    <a-row class="description flex align-center gap-10 mb-10">
      <span :class="{
        easy: exerciseStore.exercise?.exerciseLevelName == 'Easy',
        medium: exerciseStore.exercise?.exerciseLevelName == 'Medium',
        hard: exerciseStore.exercise?.exerciseLevelName == 'Hard'
      }">
        {{ exerciseStore.exercise?.exerciseLevelName }}
      </span>
      <a-rate v-model:value="rateValue" />
    </a-row>
    <a-row class="content">
      <a-textarea :value="exerciseStore.exercise?.description" :autoSize="true" :readonly="true" class="description">
      </a-textarea>
    </a-row>
  </div>
</template>

<style scoped>
@import '../../../assets/styles/color.css';
@import '../../../assets/styles/common.css';

.description {
  border: none;
}
</style>