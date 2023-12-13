<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import CommentCreate from './CommentCreate.vue';
import { useRoute } from 'vue-router';
import { getCommentApi } from '@/api/comment.api';
import type { CommentResponse } from '@/types/interfaces/comment';
import Comment from './Comment.vue';
import { useCommentStore } from '@/stores/comment.store';

const route = useRoute();
const commentList = ref<CommentResponse[]>();
const commentStore = useCommentStore();
const exerciseId = computed(() => route?.query?.id as string);

const getComments = async () => {
  try {
    await commentStore.getComments(exerciseId.value);
  } catch (error) {}
};

onMounted(async () => {
  await getComments();
});
</script>

<template>
  <CommentCreate :exercised-id="exerciseId" />
  <div v-for="(item, index) in commentStore.commentList">
    <Comment :comment="item.content" :username="item.username" :created-at="item.createdAt" />
  </div>
</template>

<style scoped></style>
