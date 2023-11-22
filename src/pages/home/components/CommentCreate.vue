<script setup lang="ts">
import { ref } from 'vue';
import { commentApi } from '@/api/comment.api';
import { string } from 'zod';
import type { CommentRequest } from '@/types/interfaces/comment';
import { message } from 'ant-design-vue';
const props = defineProps({
  exercisedId: {
    type: String,
    required: true
  }
})

const payLoad = ref<CommentRequest>({
  content: '',
  exerciseId: props.exercisedId
});

const createComment = async () => {
  try {
    await commentApi(payLoad.value);
  } catch (error) {
    message.error("Error!")
  }
}
</script>

<template>
  <div class="flex gap-10">
    <a-avatar style="color: #f56a00; background-color: #fde3cf">H</a-avatar>
    <a-textarea placeHolder="Comment..." class="comment" :rows="5" v-model:value="payLoad.content"></a-textarea>
  </div>
  <div class="fex item-end mt-10">
    <a-button class="button-classify-problem submit-btn main-color text-second-color" @click="createComment">
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