import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { UserExercise } from '@/types/interfaces/user';
import { EASY_EXERCISE, HARD_EXERCISE, MEDIUM_EXERCISE } from './constants/constant';
import { getUserResolveExerciseApi } from '../api/user.api'
import { getExerciseApi } from '@/api/exercise.api';
import type { Exercise } from '@/types/interfaces/exercise';
import dayjs from 'dayjs';

export const useUserStore = defineStore('userStore', () => {
    const listAllExercises = ref<Exercise[]>([]);
    const listResolveExercise = ref<UserExercise[]>([]);
    const totalExercise = computed(() => listAllExercises.value.length);

    const totalResolveExercise = computed(() => listResolveExercise.value.length);
    const easyExerciseCount = computed(() => listResolveExercise.value?.filter(item => item.exerciseLevelName == EASY_EXERCISE).length);
    const mediumExerciseCount = computed(() => listResolveExercise.value?.filter(item => item.exerciseLevelName == MEDIUM_EXERCISE).length);
    const hardExerciseCount = computed(() => listResolveExercise.value?.filter(item => item.exerciseLevelName == HARD_EXERCISE).length);

    const totalEasyExerciseCount = computed(() => listAllExercises.value?.filter(item => item.exerciseLevelName == EASY_EXERCISE).length);
    const totalMediumExerciseCount = computed(() => listAllExercises.value?.filter(item => item.exerciseLevelName == MEDIUM_EXERCISE).length);
    const totalHardExerciseCount = computed(() => listAllExercises.value?.filter(item => item.exerciseLevelName == HARD_EXERCISE).length);

    const easyPercent = computed(() => (easyExerciseCount.value * 100) / totalEasyExerciseCount.value);
    const mediumPercent = computed(() => (mediumExerciseCount.value * 100) / totalMediumExerciseCount.value);
    const hardPercent = computed(() => (hardExerciseCount.value * 100) / totalHardExerciseCount.value);

    const totalPercent = computed(() => ((totalResolveExercise.value * 100) / totalExercise.value).toFixed(2));

    const columns = [
        {
            title: 'Exercise',
            dataIndex: 'name',
            key: 'name',
            width: '350px'
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            width: '200px'
        },
        {
            title: 'Submit At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '200px'
        }
    ];

    const getUserResolveExercises = async () => {
        await getUserResolveExerciseApi().then((res: any) => {
            listResolveExercise.value = res.data;
            listResolveExercise.value = listResolveExercise.value?.map((item: UserExercise) => {
                return {
                    ...item,
                    createdAt: dayjs(item.createdAt).format('YYYY-MM-DD')
                }
            })
        }).catch((error: any) => {

        });
    }

    const getAllExercises = async () => {
        const queryBuilder = {
            exerciseLevelId: '',
            exerciseTypeId: '',
            keyword: '',
            pageIndex: 1,
            pageSize: 5
        }

        await getExerciseApi(queryBuilder).then((res: Exercise[]) => {
            listAllExercises.value = res;
        }).catch((error: any) => {

        })
    }

    return {
        listResolveExercise,
        easyExerciseCount,
        mediumExerciseCount,
        hardExerciseCount,
        totalEasyExerciseCount,
        totalMediumExerciseCount,
        totalHardExerciseCount,
        easyPercent,
        mediumPercent,
        hardPercent,
        totalExercise,
        totalPercent,
        columns,
        getUserResolveExercises,
        getAllExercises,
    }
})