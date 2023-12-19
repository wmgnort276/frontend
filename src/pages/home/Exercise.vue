<script setup lang="ts">
import { ref, computed } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';
import { Codemirror } from 'vue-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import { useRoute } from 'vue-router';
import router from '@/router';
import { COMMENT_PAGE, DESCRIPTION_PAGE, SUBMISSION_PAGE } from '@/stores/constants/constant';
import { useExerciseStore } from '@/stores/exercise.store';
import { useSubmissionStore } from '@/stores/submission.store';

const route = useRoute();
const routeService = useRoute();
const exerciseStore = useExerciseStore();
const submissionStore = useSubmissionStore();
const isLoading = ref<boolean>(false);
const extensions = [cpp(), oneDark];
const isDescriptionTab = computed(() => routeService.name == DESCRIPTION_PAGE);
const isSubmissionTab = computed(() => routeService.name == SUBMISSION_PAGE);
const isDiscussionTab = computed(() => routeService.name == COMMENT_PAGE);
const exerciseId = ref<string>(route?.query?.id as string);
const isTestCaseTab = ref<boolean>(true);
const isResultTab = ref<boolean>(false);

const code = computed(() => exerciseStore.exerciseHintCode);

const handleReady = () => {};

const handleChange = () => {};

const handleFocus = () => {};

const handleBlur = () => {};

const handleSubmit = async () => {
  isLoading.value = true;
  await submissionStore.handleSubmitCode(exerciseId.value, exerciseStore.exerciseHintCode);
  isResultTab.value = true;
  isTestCaseTab.value = false;
  isLoading.value = false;
  if (route.name == SUBMISSION_PAGE) {
    await submissionStore.getUserSubmissionsData(exerciseId.value);
  }
  await changeToSubmission();
};

const changeToSubmission = async () => {
  await router.push({
    path: '/exercises/submission',
    query: {
      id: exerciseId.value
    }
  });
};

const changeToDescription = () => {
  router.push({
    path: '/exercises/desc',
    query: {
      id: exerciseId.value
    }
  });
};

const changeToDiscussion = () => {
  router.push({
    path: '/exercises/comment',
    query: {
      id: exerciseId.value
    }
  });
};
</script>

<template>
  <page-layout :is-loading="isLoading">
    <div class="main-page gap-10" style="display: flex">
      <a-col class="card left-side" :lg="10" :md="10">
        <a-row class="flex gap-20">
          <a-col
            class="exercise-header"
            @click="changeToDescription"
            :class="{ 'is-chosen': isDescriptionTab }"
          >
            Description
          </a-col>
          <a-col
            class="exercise-header"
            @click="changeToSubmission"
            :class="{ 'is-chosen': isSubmissionTab }"
          >
            Submission
          </a-col>
          <a-col
            class="exercise-header"
            @click="changeToDiscussion"
            :class="{ 'is-chosen': isDiscussionTab }"
          >
            Discussion
          </a-col>
        </a-row>
        <a-divider />
        <router-view />
      </a-col>

      <a-col :lg="14" :md="14" class="flex-column gap-10 right-side">
        <a-row class="card code-wrapper">
          <div class="code-section">
            <codemirror
              v-model="exerciseStore.exerciseHintCode"
              :style="{ height: '400px' }"
              :autofocus="true"
              :indent-with-tab="true"
              :tab-size="2"
              :extensions="extensions"
              @ready="handleReady"
              @change="handleChange"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </div>
        </a-row>

        <a-row class="test-case-wrapper card">
          <div style="width: 100%">
            <a-col :lg="24" :md="24" class="flex gap-10">
              <span
                style="cursor: pointer"
                :class="{ 'is-chosen': isTestCaseTab }"
                @click="
                  isTestCaseTab = true;
                  isResultTab = false;
                "
                >Test case</span
              >
              <span
                style="cursor: pointer"
                :class="{ 'is-chosen': isResultTab }"
                @click="(isResultTab = true), (isTestCaseTab = false)"
                >Result</span
              >
            </a-col>
            <a-divider></a-divider>
            <div v-if="isTestCaseTab">
              <div class="flex gap-10">
                <a-button class="button-classify-problem">Case 1</a-button>
                <a-button class="button-classify-problem">Case 2</a-button>
                <a-button class="button-classify-problem">Case 3</a-button>
              </div>
              <h4 class="mt-10" style="display: block">Input</h4>
              <span style="display: block"> 1, 2, 3 </span>
            </div>
            <div v-if="isResultTab">
              <p
                :class="{
                  success: submissionStore.responseStatus,
                  fail: !submissionStore.responseStatus
                }"
              >
                {{ submissionStore.response }}
              </p>
            </div>
            <a-row class="flex submit">
              <a-button
                class="button-classify-problem submit-btn main-color text-second-color"
                @click="handleSubmit"
              >
                Run
              </a-button>
              <a-button
                class="button-classify-problem submit-btn main-color text-second-color"
                @click="handleSubmit"
              >
                Submit
              </a-button>
            </a-row>
          </div>
        </a-row>
      </a-col>
    </div>
  </page-layout>
</template>

<style scoped>
@import '../../assets/styles/color.css';
@import '../../assets/styles/common.css';

.main-page {
  overflow-x: hidden;
  /* padding: 5px; */
}

.card {
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  border-radius: 0px !important;
}

.wrapper {
  max-width: 98%;
  margin: 0 auto;
  justify-content: space-around;
  padding-top: 10px;
  height: 100%;
}

.test-case {
  width: 100%;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.code-wrapper {
  padding: 0;
  height: 70%;
  width: 98%;
}

.code-section {
  width: 100%;
}

.left-side {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}

.code-section {
  height: 100%;
}

:deep(.cm-editor) {
  height: 100%;
}

.test-case-wrapper {
  height: 30%;
  width: 98%;
}

:deep(.ant-divider) {
  margin: 10px 5px;
}

.submit {
  width: 100%;
  align-items: end;
  justify-content: end;
  position: absolute;
  right: 30px;
  bottom: 15px;
  gap: 10px;
}

.exercise-header {
  font-size: 16px;
  cursor: pointer;
}

.is-chosen {
  font-weight: 500;
}

.accepted-submission {
  color: rgb(45 181 93);
  font-weight: 500;
}

.error-submission {
  color: #ef4743;
  font-weight: 500;
}

.success {
  color: rgb(45 181 93);
}

.fail {
  color: #ef4743;
}

/* width */
::-webkit-scrollbar {
  width: 5px;
}
/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #bec4c4;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
