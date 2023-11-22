import type { CommentRequest, CommentResponse } from '@/types/interfaces/comment';
import { http } from '@/utils/http-client';

export const commentApi = (param: CommentRequest) => {
  return http.post('/api/Comment', {
    data: param
  });
};

export const getCommentApi = (exerciseId: string) => {
  return http.get(`/api/Comment?ExerciseId=${exerciseId}`)
}