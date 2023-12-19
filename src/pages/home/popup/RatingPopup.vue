<script setup lang="ts">
import { ref } from 'vue';
import { useExerciseStore } from '@/stores/exercise.store';
import type { Rating } from '@/types/interfaces/rating';
const exerciseStore = useExerciseStore();

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  exerciseId: {
    type: String
  }
});
const emits = defineEmits(['cancel', 'update']);
const ratingValue = ref<number>(5);

const handleOk = async () => {
  const payload: Rating = {
    exerciseId: props.exerciseId!,
    ratingValue: ratingValue.value
  };
  await exerciseStore.createRating(payload);
  emits('cancel');
};

const handleClose = () => {
  emits('cancel');
};
</script>

<template>
  <a-modal
    :visible="open"
    title="Rating this exercise"
    @ok="handleOk"
    :closable="false"
    @update:visible="handleClose"
  >
    <a-rate v-model:value="ratingValue" />
  </a-modal>
</template>
