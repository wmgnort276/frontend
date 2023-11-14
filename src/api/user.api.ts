import { http } from '@/utils/http-client';

export const getUserListExercise = () => {
    return http.get("/api/User");
}