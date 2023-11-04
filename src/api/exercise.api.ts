import { http } from '@/utils/http-client';
import type { ExerciseType, ExerciseLevel, Exercise } from '@/types/interfaces/exercise'

export const getExerciseType = () => {
    return http.get<ExerciseType[]>('api/ExerciseType');
};

export const getExerciseLevel = () => {
    return http.get<ExerciseLevel[]>('api/ExerciseLevel');
};

export const createExercise = (formData: any) => {
    return http.upload('api/Exercise', {
        data: formData
    });
}

export const getExerciseApi = () => {
    return http.get<Exercise[]>('api/Exercise');
}

