import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { getExerciseById } from '@/api/exercise.api';

export const useExerciseStore = defineStore('exerciseStore', () => {
  const exercise = ref<any>('');
  const exerciseHintCode = ref<any>('');
  const exerciseFlag = ref<boolean>(false); // use to check if exercise data is ready

  const getExerciseDetail = async (exerciseId: string) => {
    await getExerciseById(exerciseId)
      .then((res: any) => {
        exercise.value = res?.data;
        exerciseHintCode.value = res?.data.hintCode;
        exerciseFlag.value = true;
      })
      .catch((error: any) => {

      })
  };

  return {
    exerciseHintCode,
    exercise,
    exerciseFlag,
    getExerciseDetail
  }
})