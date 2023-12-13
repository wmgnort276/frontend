import { ref } from 'vue';
import { defineStore } from 'pinia';
import { commentApi, getCommentApi } from '@/api/comment.api';
import type { CommentRequest, CommentResponse } from '@/types/interfaces/comment';
import { message } from 'ant-design-vue';

export const useCommentStore = defineStore('commentStore', () => {

  const commentList = ref<CommentResponse[]>([])

  const addComment = async (body: CommentRequest) => {
    try {
      await commentApi(body);
    } catch (error) {
      message.error("Error");
    }
  }

  const getComments = async (exerciseId: string) => {
    try {
    const result : any = await getCommentApi(exerciseId);
    commentList.value = result?.data;
    } catch (error) {
      message.error("Error");
    }
  }

  return {
    commentList,
    addComment,
    getComments
  }
})