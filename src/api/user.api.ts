import { http } from '@/utils/http-client';

export const getUserResolveExerciseApi = () => {
    return http.get("/api/User");
}

export const getUserAllExerciseApi = () => {
    return http.get("/api/User/all");
}

