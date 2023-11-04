<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';
import { getExerciseType, getExerciseLevel, createExercise } from '@/api/exercise.api';

let isLoading = ref<boolean>(false);
let exerciseTypes = ref<any[]>([]);
let exerciseLevels = ref<any[]>([]);
let runFile = ref<any>()
let exercise = ref<any>({
    name: '',
    description: '',
    exerciseLevelId: null,
    exerciseTypeId: null,
})


onMounted(async () => {
    isLoading.value = true;
    await getExerciseLevel().then(res => {
        exerciseLevels.value = res as any[];
    })

    await getExerciseType().then(res => {
        exerciseTypes.value = res as any[];
    })

    isLoading.value = false;
})

const handleFileChange = (event : any) => {
    runFile.value = event.target.files[0];
}

const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('File', runFile.value);
    formData.append('Name', exercise.value.name);
    formData.append('Description', exercise.value.description);
    formData.append('ExerciseLevelId', exercise.value.exerciseLevelId);
    formData.append('ExerciseTypeId', exercise.value.exerciseTypeId);
    console.log(formData);
    await createExercise(formData);
}
</script>

<template>
    <page-layout :is-loading="isLoading">
        <div class="main-page">
            <div></div>
            <div class="wrapper">
                <h3>Form create exercise</h3>
                <a-form class="card flex-column">
                    <a-row>
                        <a-col :lg="6" :md="6" :sm="6">
                            <span>Name</span>
                        </a-col>
                        <a-col :lg="24" :md="24" :sm="24">
                            <a-form-item>
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
                            <a-form-item>
                                <a-textarea :rows="5" v-model:value="exercise.description">

                                </a-textarea>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row>
                        <a-col :lg="6" :md="6" :sm="6">
                            <span>Level</span>
                        </a-col>
                        <a-col :lg="24" :md="24" :sm="24">
                            <a-form-item>
                                <a-select :options="exerciseLevels" :fieldNames="{
                                    value: 'id',
                                    label: 'name'
                                }"
                                placeholder="Choose exercise level"
                                v-model:value="exercise.exerciseLevelId"
                                >

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
                                <a-select :options="exerciseTypes" :fieldNames="{
                                    value: 'id',
                                    label: 'name'
                                }"
                                
                                v-model:value="exercise.exerciseTypeId">

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
                                <input type="file" @change="handleFileChange"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-button type="primary" @click="handleSubmit">
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

</style>