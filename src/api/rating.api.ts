import type { Rating } from '@/types/interfaces/rating';
import { http } from '@/utils/http-client';

export const ratingApi = (param: Rating) => {
  return http.post('/api/Rating', {
    data: param
  });
};
