<script setup lang="ts">
import { ref, computed } from 'vue';
import CommentCreate from './CommentCreate.vue';
import { useRoute } from 'vue-router';
import { getCommentApi } from '@/api/comment.api';
import type { CommentResponse } from '@/types/interfaces/comment';
import Comment from './Comment.vue';

const route = useRoute();
const commentList = ref<CommentResponse[]>();

const exerciseId = computed(() => route?.query?.id as string)

const getComments = async () => {
  let exerciseId: string = route?.query?.id as string;
  try {
    let res: any = await getCommentApi(exerciseId);
    commentList.value = res?.data;
  } catch (error) {

  }
}

getComments();

</script>

<template>
  <CommentCreate :exercised-id="exerciseId" />
  <div v-for="(item, index) in commentList">
    <Comment :comment="item.content" />
  </div>
</template>

<style scoped></style>