import { http } from '@/utils/http-client';
import type { ExerciseType, ExerciseLevel, Exercise } from '@/types/interfaces/exercise'

export const getExerciseType = () => {
    return http.get('api/ExerciseType');
};

export const getExerciseLevel = () => {
    return http.get('api/ExerciseLevel');
};

export const createExercise = (formData: any) => {
    return http.upload('api/Exercise', {
        data: formData
    });
}

export const getExerciseApi = (payload: any) => {
    let qs: any = [];
    Object.entries(payload).forEach((entry) => {
        const [key, value] = entry;
        qs.push(key + '=' + value);
    });
    return http.get<Exercise[]>(`api/Exercise?${qs.join('&')}`);
}


export const getExerciseById = (id: string) => {
    return http.get(`api/Exercise/${id}`);
}

export const submitCode = (param: any) => {
    return http.post(`/api/Exercise/submit?id=${param?.id}`, {
        data: param
    });
};

export const editExercise = (param: any) => {
    return http.upload(`/api/Exercise/edit`, {
        data: param
    });
}

export const getUserSubmissions = (exerciseId: string) => {
    return http.get(`/api/Submission?exerciseId=${exerciseId}`)
}

export const runTestCase = (payload: any) => {
    return http.post(`/api/Exercise/test-case?id=${payload?.id}`, {
        data: payload
    });
};

export const getExerciseAdminApi = (payload: any) => {
    let qs: any = [];
    Object.entries(payload).forEach((entry) => {
        const [key, value] = entry;
        qs.push(key + '=' + value);
    });
    return http.get<Exercise[]>(`api/Exercise/admin?${qs.join('&')}`);
}


export const publishExerciseAPi = (exerciseID: string) => {
    return http.post(`/api/Exercise/publish?id=${exerciseID}`, {
        data: exerciseID
    });
};

export const unPublishExerciseAPi = (exerciseID: string) => {
    return http.post(`/api/Exercise/un-publish?id=${exerciseID}`, {
        data: exerciseID
    });
};