import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { getExerciseById } from '@/api/exercise.api';

export const useExerciseStore = defineStore('exerciseStore', () => {
  const exercise = ref<any>('');
  const exerciseHintCode = ref<any>('');

  const getExerciseDetail = async (exerciseId: string) => {
    await getExerciseById(exerciseId)
      .then((res: any) => {
        exercise.value = res?.data;
        exerciseHintCode.value = res?.data.hintCode;
      })
      .catch((error: any) => {

      })
  };

  return {
    exerciseHintCode,
    getExerciseDetail,
    exercise
  }
})