<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getExerciseById } from '@/api/exercise.api';
import { message } from 'ant-design-vue';

const route = useRoute();
const isLoading = ref<boolean>(false);
const exercise = ref<any>();
const rateValue = ref<number>(3);

onMounted(async () => {
  await getExerciseDetail();
})

const getExerciseDetail = async () => {
  let exerciseId: string = route?.query?.id as string;
  isLoading.value = true;
  await getExerciseById(exerciseId)
    .then((res: any) => {
      exercise.value = res?.data;
    })
    .catch((error: any) => {
      message.error('Error!');
    })
    .finally(() => {
      isLoading.value = false;
    });
};
</script>

<template>
  <div>
    <a-row>
      <h4>{{ exercise?.name }}</h4>
    </a-row>
    <a-row class="description flex align-center gap-10 mb-10">
      <span :class="{
        easy: exercise?.exerciseLevelName == 'Easy',
        medium: exercise?.exerciseLevelName == 'Medium',
        hard: exercise?.exerciseLevelName == 'Hard'
      }">
        {{ exercise?.exerciseLevelName }}
      </span>
      <a-rate v-model:value="rateValue" />
    </a-row>
    <a-row class="content">
      <a-textarea :value="exercise?.description" :autoSize="true" :readonly="true" class="description">
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