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
      commentList.value = await getCommentApi(exerciseId);
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