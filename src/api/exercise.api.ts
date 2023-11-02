import { http } from '@/utils/http-client';

export const getExerciseType = () => {
    return http.get('api/ExerciseType');
};

export const getExerciseLevel = () => {
    return http.get('api/ExerciseLevel');
};

export const createExercise = (formData : any) => {
    return http.upload('api/Exercise', {
        data: formData
    });
}

