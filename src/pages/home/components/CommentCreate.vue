<script setup lang="ts">
import { ref } from 'vue';
import { commentApi } from '@/api/comment.api';
import type { CommentRequest } from '@/types/interfaces/comment';
import { message } from 'ant-design-vue';
import { useCommentStore } from '@/stores/comment.store';
import { useAuthStoreHook } from '@/stores/auth.store';

const props = defineProps({
  exercisedId: {
    type: String,
    required: true
  }
});

const authStore = useAuthStoreHook();
const commentStore = useCommentStore();

const payLoad = ref<CommentRequest>({
  content: '',
  exerciseId: props.exercisedId
});

const createComment = async () => {
  try {
    await commentApi(payLoad.value);
    await commentStore.getComments(props.exercisedId);
  } catch (error) {
    message.error('Error!');
  }
};
</script>

<template>
  <div class="flex gap-10">
    <a-avatar style="color: #f56a00; background-color: #fde3cf">{{
      authStore.authUser.userName.slice(0, 1)
    }}</a-avatar>
    <a-textarea
      placeHolder="Comment..."
      class="comment"
      :rows="5"
      v-model:value="payLoad.content"
    ></a-textarea>
  </div>
  <div class="fex item-end mt-10">
    <a-button
      class="button-classify-problem submit-btn main-color text-second-color"
      @click="createComment"
    >
      Comment
    </a-button>
  </div>
</template>

<style scoped>
@import '../../../assets/styles/color.css';
@import '../../../assets/styles/common.css';

.comment {
  border: none;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  border-radius: 10px;
}

.item-end {
  display: flex;
  align-items: end;
}
</style>
