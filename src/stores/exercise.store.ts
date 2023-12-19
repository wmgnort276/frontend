import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { getExerciseById } from '@/api/exercise.api';
import type { Rating } from '@/types/interfaces/rating';
import { ratingApi } from '@/api/rating.api';

export const useExerciseStore = defineStore('exerciseStore', () => {
  const exercise = ref<any>('');
  const exerciseHintCode = ref<any>('');
  const exerciseFlag = ref<boolean>(false); // use to check if exercise data is ready
  const averageRating = ref<number>(0);

  const getExerciseDetail = async (exerciseId: string) => {
    await getExerciseById(exerciseId)
      .then((res: any) => {
        exercise.value = res?.data;
        exerciseHintCode.value = res?.data.hintCode;
        exerciseFlag.value = true;
        averageRating.value = exercise.value.rating;
      })
      .catch((error: any) => {

      })
  };

  const createRating = async (rating: Rating) => {
    try {
      await ratingApi(rating);
    } catch(error : any) {}
  }

  return {
    exerciseHintCode,
    exercise,
    exerciseFlag,
    averageRating,
    getExerciseDetail,
    createRating
  }
})