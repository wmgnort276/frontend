<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';
import { Codemirror } from 'vue-codemirror'
import { cpp } from '@codemirror/lang-cpp'
import { oneDark } from '@codemirror/theme-one-dark'
import { getExerciseById } from '@/api/exercise.api'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue';

const route = useRoute()
let isLoading = ref<boolean>(false);
let rateValue = ref<number>(3);
const extensions = [cpp(), oneDark];
let code = ref<any>('');
let exercise = ref<any>();

const handleReady = () => { }

const handleChange = () => {
    // console.log(code.value);
}

const handleFocus = () => { }

const handleBlur = () => { }

const handleSubmit = async () => {

}

const getExerciseDetail = async () => {
    let exerciseId: string = route?.query?.id as string;
    isLoading.value = true;
    await getExerciseById(exerciseId).then((res: any) => {
        exercise.value = res;
    }).catch((error: any) => {
        message.error("Error!");
    }).finally(() => {
        isLoading.value = false;
    });
}

onMounted(async () => {
    getExerciseDetail();
})

</script>

<template>
    <page-layout :is-loading="isLoading">
        <div class="main-page">
            <div class="flex gap-10 wrapper">
                <a-col class="card left-side" :lg="10" :md="10">
                    <a-row>
                        <h4>{{ exercise?.name }}</h4>
                    </a-row>
                    <a-row class="description flex align-center gap-10 mb-10">
                        <span :class="{
                            'easy': exercise?.exerciseLevelName == 'Easy',
                            'medium': exercise?.exerciseLevelName == 'Medium',
                            'hard': exercise?.exerciseLevelName == 'Hard'
                        }">
                            {{ exercise?.exerciseLevelName }}
                        </span>
                        <a-rate v-model:value="rateValue" />
                    </a-row>
                    <a-row class="content">
                        <a-textarea :value="exercise?.description" :autosize="true" :readonly="true" class="description">
                        </a-textarea>
                    </a-row>
                </a-col>

                <a-col :lg="14" :md="14" class="flex-column gap-10 right-side">
                    <a-row class="card code-wrapper">
                        <div class="code-section">
                            <codemirror v-model="code" placeholder="Code goes here..." :style="{ height: '400px' }"
                                :autofocus="true" :indent-with-tab="true" :tab-size="2" :extensions="extensions"
                                @ready="handleReady" @change="handleChange" @focus="handleFocus" @blur="handleBlur" />
                        </div>
                    </a-row>

                    <a-row class="test-case-wrapper card">
                        <div style="width: 100%;">
                            <a-col :lg="24" :md="24">
                                <h4 style="cursor: pointer;">
                                    Test case
                                </h4>
                            </a-col>
                            <a-divider></a-divider>
                            <div>
                                <div class="flex gap-10">
                                    <a-button class="button-classify-problem">Case 1</a-button>
                                    <a-button class="button-classify-problem">Case 2</a-button>
                                    <a-button class="button-classify-problem">Case 3</a-button>
                                </div>
                                <h4 class="mt-10" style="display: block;">
                                    Input
                                </h4>
                                <span style="display: block;">
                                    1, 2, 3
                                </span>
                            </div>
                        </div>
                    </a-row>
                </a-col>
            </div>
        </div>
    </page-layout>
</template>

<style scoped>
@import '../../assets/styles/color.css';
@import '../../assets/styles/common.css';

.card {
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

.wrapper {
    max-width: 98%;
    margin: 0 auto;
    justify-content: space-around;
    padding-top: 30px;
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
}

.code-section {
    width: 100%;
}

.description {
    border: none;
}

.left-side,
.right-side {
    height: 90vh;
    overflow-y: scroll;
}

.code-section {
    height: 100%;
}

:deep(.cm-editor) {
    height: 100%;
}

.test-case-wrapper {
    height: 30%;
}

:deep(.ant-divider) {
    margin: 10px 5px;
}
</style>