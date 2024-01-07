<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useExerciseStore } from '@/stores/exercise.store';
import RatingPopup from '../popup/RatingPopup.vue'

const route = useRoute();
const exerciseStore = useExerciseStore();
const isLoading = ref<boolean>(false);
const rateValue = ref<number>(0);
const exerciseId: string = route?.query?.id as string;
const isOpenRatingPopup = ref<boolean>(false);

const getExerciseDetail = async (id: string) => {
  isLoading.value = true;
  try {
    await exerciseStore.getExerciseDetail(id);
  } catch(err) {
    isLoading.value = false;
  }
  isLoading.value = false;
};

getExerciseDetail(exerciseId);

const handleVoting = async () => {
  isOpenRatingPopup.value = true;
};

const handleCloseRatingPopup = async () => {
  isOpenRatingPopup.value = false;
  await getExerciseDetail(exerciseId);
}
</script>

<template>
  <div>
    <a-row>
      <h4>{{ exerciseStore.exercise?.name }}</h4>
    </a-row>
    <a-row class="description flex align-center gap-10 mb-10">
      <span
        :class="{
          easy: exerciseStore.exercise?.exerciseLevelName == 'Easy',
          medium: exerciseStore.exercise?.exerciseLevelName == 'Medium',
          hard: exerciseStore.exercise?.exerciseLevelName == 'Hard'
        }"
      >
        {{ exerciseStore.exercise?.exerciseLevelName }}
      </span>
      <a-rate v-model:value="exerciseStore.averageRating" @click="handleVoting" allow-half disabled/>
      <span>({{ (exerciseStore.averageRating).toFixed(1) }} / {{ exerciseStore.exercise.ratingCount }})</span>
    </a-row>
    <a-row class="content">
      <!-- <a-textarea
        v-html="exerciseStore.exercise?.description"
        :autoSize="true"
        :readonly="true"
        class="description"
      >
      </a-textarea> -->
      <div class="ck-content">
        <span v-html="exerciseStore.exercise?.description"></span>
      </div>
    </a-row>
  </div>

  <RatingPopup :visible="isOpenRatingPopup" @cancel="handleCloseRatingPopup" :exerciseId="exerciseId"/>
</template>

<style scoped>
@import '../../../assets/styles/color.css';
@import '../../../assets/styles/common.css';

.description {
  border: none;
}

.ck-content {
  max-width: 100%;
}

.ck-content img {
  max-width: 100% !important;
}

.ck-content > span > figure > img { 
  max-width: 100% !important;
}
</style>

<style>
.ck-content img {
  max-width: 100% !important;
}

</style>
