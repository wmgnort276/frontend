import { http } from '@/utils/http-client';

export const getUserResolveExerciseApi = () => {
    return http.get("/api/User");
}

export const getUserAllExerciseApi = () => {
    return http.get("/api/User/all");
}

export const getListRankingApi = () => {
    return http.get("/api/User/rank");
}

export const getUserRankApi = () => {
    return http.get("/api/User/user-rank");
}