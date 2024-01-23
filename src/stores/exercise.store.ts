import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { getExerciseById } from '@/api/exercise.api';
import type { Rating } from '@/types/interfaces/rating';
import { ratingApi } from '@/api/rating.api';
import type { TestCase } from '@/types/interfaces/exercise';

export const useExerciseStore = defineStore('exerciseStore', () => {
  const exercise = ref<any>('');
  const exerciseHintCode = ref<any>('');
  const exerciseFlag = ref<boolean>(false); // use to check if exercise data is ready
  const averageRating = ref<number>(0);
  const listTestCase = ref<TestCase[]>([]);

  const getExerciseDetail = async (exerciseId: string) => {
    await getExerciseById(exerciseId)
      .then((res: any) => {
        exercise.value = res?.data;
        exerciseHintCode.value = res?.data?.hintCode;
        exerciseFlag.value = true;
        averageRating.value = exercise?.value?.rating;

        listTestCase.value = [];

        listTestCase.value.push({
          input: exercise?.value?.input1,
          output: "",
          expectedOutput: exercise?.value?.output1,
          status: true,
          isSubmitted: false
        })

        listTestCase.value.push({
          input: exercise?.value?.input2,
          output: "",
          expectedOutput: exercise?.value?.output2,
          status: true,
          isSubmitted: false
        })

        listTestCase.value.push({
          input: exercise?.value?.input3,
          output: "",
          expectedOutput: exercise?.value?.output3,
          status: true,
          isSubmitted: false
        })

        console.log(listTestCase.value);
      })
      .catch((error: any) => {

      })
  };

  const createRating = async (rating: Rating) => {
    try {
      await ratingApi(rating);
    } catch (error: any) { }
  }

  const changeLanguage = (lang: string) => {
    if (lang == 'C++') {
      exerciseHintCode.value = exercise.value.hintCode;
    } else if (lang == 'Java') {
      exerciseHintCode.value = exercise.value.hintCodeJava;
    }
  }

  return {
    exerciseHintCode,
    exercise,
    exerciseFlag,
    averageRating,
    listTestCase,
    getExerciseDetail,
    createRating,
    changeLanguage
  }
})