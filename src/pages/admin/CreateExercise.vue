<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';
import { getExerciseType, getExerciseLevel, createExercise } from '@/api/exercise.api';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';

const formRef = ref<FormInstance>();
let isLoading = ref<boolean>(false);
let exerciseTypes = ref<any[]>([]);
let exerciseLevels = ref<any[]>([]);
let runFile = ref<any>()
let exercise = ref<any>({
    name: '',
    description: '',
    hintCode: '',
    timeLimit: null,
    exerciseLevelId: null,
    exerciseTypeId: null,
})

const getExerciseLevelFunction = async () => {
    await getExerciseLevel().then((res: any) => {
        exerciseLevels.value = res?.data;
    })
}

const getExerciseLevelTypeFunction = async () => {
    await getExerciseType().then((res: any) => {
        exerciseTypes.value = res?.data;
    })
}


onMounted(async () => {
    isLoading.value = true;
    try {
        await Promise.all([getExerciseLevelFunction(), getExerciseLevelTypeFunction()]);
    } catch {
        message.error("Fail to get exercise category and level")
    }
    isLoading.value = false;
})

const handleFileChange = (event: any) => {
    runFile.value = event.target.files[0];
}

const clearForm = () => {
    exercise.value = {
        name: '',
        description: '',
        exerciseLevelId: null,
        exerciseTypeId: null,
        hintCode: '',
        timeLimit: null,
    }
}

const handleSubmit = async () => {
    await formRef.value!.validate();
    isLoading.value = true;
    const formData = new FormData();
    formData.append('File', runFile.value);
    formData.append('Name', exercise.value.name);
    formData.append('Description', exercise.value.description);
    formData.append('ExerciseLevelId', exercise.value.exerciseLevelId);
    formData.append('ExerciseTypeId', exercise.value.exerciseTypeId);
    formData.append('HintCode', exercise.value.hintCode);
    formData.append('TimeLimit', exercise.value.timeLimit);
    try {
        await createExercise(formData);
        clearForm();
        message.success("Success!")
        isLoading.value = false;
    } catch {
        message.error("Create fail!");
        isLoading.value = false;
    }
}
</script>

<template>
    <page-layout :is-loading="isLoading">
        <div class="main-page">
            <div></div>
            <div class="wrapper">
                <h3>Form create exercise</h3>
                <a-form class="card flex-column" :model="exercise" ref="formRef">
                    <a-row>
                        <a-col :lg="6" :md="6" :sm="6">
                            <span>Name</span>
                        </a-col>
                        <a-col :lg="24" :md="24" :sm="24">
                            <a-form-item 
                            name="name"
                            :rules="[{ required: true, message: 'Required' }]"
                             >
                                <a-input v-model:value="exercise.name">
                                </a-input>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row>
                        <a-col :lg="6" :md="6" :sm="6">
                            <span>Description</span>
                        </a-col>
                        <a-col :lg="24" :md="24" :sm="24">
                            <a-form-item 
                            name="description"
                            :rules="[{ required: true, message: 'Required' }]">
                                <a-textarea :rows="5" :autosize="true" v-model:value="exercise.description">

                                </a-textarea>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row>
                        <a-col :lg="6" :md="6" :sm="6">
                            <span>Hint Code</span>
                        </a-col>
                        <a-col :lg="24" :md="24" :sm="24">
                            <a-form-item
                             name="hintCode"
                             :rules="[{ required: true, message: 'Required' }]"
                            >
                                <a-textarea :rows="5" :autosize="true" v-model:value="exercise.hintCode">

                                </a-textarea>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row>
                        <a-col :lg="6" :md="6" :sm="6">
                            <span>Time limit</span>
                        </a-col>
                        <a-col :lg="24" :md="24" :sm="24">
                            <a-form-item
                             name="timeLimit"
                             :rules="[{ required: true, message: 'Required' }]"
                            >
                                <a-input-number v-model:value="exercise.timeLimit">
                                </a-input-number>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row>
                        <a-col :lg="6" :md="6" :sm="6">
                            <span>Level</span>
                        </a-col>
                        <a-col :lg="24" :md="24" :sm="24">
                            <a-form-item
                            name="exerciseLevelId"
                            :rules="[{ required: true, message: 'Required' }]"
                            >
                                <a-select :options="exerciseLevels" :fieldNames="{
                                    value: 'id',
                                    label: 'name'
                                }" placeholder="Choose exercise level" v-model:value="exercise.exerciseLevelId">

                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row>
                        <a-col :lg="6" :md="6" :sm="6">
                            <span>Category</span>
                        </a-col>
                        <a-col :lg="24" :md="24" :sm="24">
                            <a-form-item
                            name="exerciseTypeId"
                            :rules="[{ required: true, message: 'Required' }]"
                            >
                                <a-select :options="exerciseTypes" :fieldNames="{
                                    value: 'id',
                                    label: 'name'
                                }" v-model:value="exercise.exerciseTypeId">

                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row>
                        <a-col :lg="6" :md="6" :sm="6">
                            <span>Category</span>
                        </a-col>
                        <a-col :lg="24" :md="24" :sm="24">
                            <a-form-item>
                                <input type="file" @change="handleFileChange" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-button type="primary" class="main-color text-second-color submit-button" @click="handleSubmit">
                        Submit
                    </a-button>
                </a-form>
            </div>
        </div>
    </page-layout>
</template>

<style scoped>
@import '../../assets/styles/color.css';
@import '../../assets/styles/common.css';

.wrapper {
    width: 90%;
    margin: 0 auto;
}

.submit-button {
    height: 50px;
    width: 300px;
    margin: 0 auto;
}
</style>