<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';
import { getExerciseType, getExerciseLevel, editExercise } from '@/api/exercise.api';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router';
import { getExerciseById } from '@/api/exercise.api';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const route = useRoute();
const formRef = ref<FormInstance>();
const isLoading = ref<boolean>(false);
const exerciseTypes = ref<any[]>([]);
const exerciseLevels = ref<any[]>([]);
const runFile = ref<any>();
const runFileJava = ref<any>();
const testFile = ref<any>();
const testFileJava = ref<any>();
const editor = ClassicEditor;

let exercise = ref<any>({
  name: '',
  description: '',
  hintCode: '',
  hintCodeJava: '',
  timeLimit: null,
  exerciseLevelId: null,
  exerciseTypeId: null,
  input1: '',
  output1: '',
  input2: '',
  output2: '',
  input3: '',
  output3: ''
});

const getExerciseDetail = async () => {
  let exerciseId: string = route?.query?.id as string;
  isLoading.value = true;
  await getExerciseById(exerciseId)
    .then((res: any) => {
      exercise.value = res?.data;
    })
    .catch((error: any) => {
      message.error('Error!');
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const getExerciseLevelFunction = async () => {
  await getExerciseLevel().then((res: any) => {
    exerciseLevels.value = res?.data;
  });
};

const getExerciseLevelTypeFunction = async () => {
  await getExerciseType().then((res: any) => {
    exerciseTypes.value = res?.data;
  });
};

onMounted(async () => {
  isLoading.value = true;
  try {
    await Promise.all([
      getExerciseDetail(),
      getExerciseLevelFunction(),
      getExerciseLevelTypeFunction()
    ]);
  } catch {
    // message.error('Fail to get exercise category and level');
  }
  isLoading.value = false;
});

const handleFileChange = (event: any) => {
  runFile.value = event.target.files[0];
};

const handleTestFileChange = (event: any) => {
  testFile.value = event.target.files[0];
};

const handleFileChangeJava = (event: any) => {
  runFileJava.value = event.target.files[0];
};

const handleTestFileJavaChange = (event: any) => {
  testFileJava.value = event.target.files[0];
};

const clearForm = () => {
  exercise.value = {
    name: '',
    description: '',
    exerciseLevelId: null,
    exerciseTypeId: null,
    hintCode: '',
    timeLimit: null,
    hintCodeJava: '',
    input1: '',
    output1: '',
    input2: '',
    output2: '',
    input3: '',
    output3: ''
  };
};

const handleSubmit = async () => {
  await formRef.value!.validate();
  let exerciseId: string = route?.query?.id as string;
  isLoading.value = true;
  const formData = new FormData();
  formData.append('File', runFile.value);
  formData.append('FileJava', runFileJava.value);
  formData.append('TestFile', testFile.value);
  formData.append('TestFileJava', testFileJava.value);
  formData.append('Id', exerciseId);
  formData.append('Name', exercise.value.name);
  formData.append('Description', exercise.value.description);
  formData.append('ExerciseLevelId', exercise.value.exerciseLevelId);
  formData.append('ExerciseTypeId', exercise.value.exerciseTypeId);
  formData.append('HintCode', exercise.value.hintCode);
  formData.append('TimeLimit', exercise.value.timeLimit);
  formData.append('HintCodeJava', exercise.value.hintCodeJava);
  formData.append('Input1', exercise.value.input1);
  formData.append('Output1', exercise.value.output1);
  formData.append('Input2', exercise.value.input2);
  formData.append('Output2', exercise.value.output2);
  formData.append('Input3', exercise.value.input3);
  formData.append('Output3', exercise.value.output3);

  try {
    await editExercise(formData);
    clearForm();
    message.success('Success!');
    isLoading.value = false;
  } catch {
    message.error('Create fail!');
    isLoading.value = false;
  } finally {
    await getExerciseDetail();
  }
};
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
              <a-form-item name="name" :rules="[{ required: true, message: 'Required' }]">
                <a-input v-model:value="exercise.name"> </a-input>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :lg="6" :md="6" :sm="6">
              <span>Description</span>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item name="description" :rules="[{ required: true, message: 'Required' }]">
                <!-- <a-textarea :rows="5" :autosize="true" v-model:value="exercise.description">
                </a-textarea> -->
                <ckeditor :editor="editor" v-model="exercise.description"></ckeditor>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :lg="6" :md="6" :sm="6">
              <span>Hint Code C++</span>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item name="hintCode" :rules="[{ required: true, message: 'Required' }]">
                <a-textarea :rows="5" :autosize="true" v-model:value="exercise.hintCode">
                </a-textarea>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :lg="6" :md="6" :sm="6">
              <span>Hint Code Java</span>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item name="hintCodeJava" :rules="[{ required: true, message: 'Required' }]">
                <a-textarea :rows="5" :autosize="true" v-model:value="exercise.hintCodeJava">
                </a-textarea>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :lg="6" :md="6" :sm="6">
              <span>Time limit</span>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item name="timeLimit" :rules="[{ required: true, message: 'Required' }]">
                <a-input-number v-model:value="exercise.timeLimit"> </a-input-number>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :lg="6" :md="6" :sm="6">
              <span>Level</span>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item name="exerciseLevelId" :rules="[{ required: true, message: 'Required' }]">
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
              <a-form-item name="exerciseTypeId" :rules="[{ required: true, message: 'Required' }]">
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
              <span>Test Case 1</span>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item name="input1" :rules="[{ required: true, message: 'Required' }]">
                <a-textarea :rows="1" :autosize="true" v-model:value="exercise.input1" placeholder="Input">
                </a-textarea>
              </a-form-item>
              <a-form-item name="output1" :rules="[{ required: true, message: 'Required' }]">
                <a-textarea :rows="1" :autosize="true" v-model:value="exercise.output1" placeholder="Output">
                </a-textarea>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :lg="6" :md="6" :sm="6">
              <span>Test Case 2</span>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item name="input2" :rules="[{ required: true, message: 'Required' }]">
                <a-textarea :rows="1" :autosize="true" v-model:value="exercise.input2" placeholder="Input">
                </a-textarea>
              </a-form-item>
              <a-form-item name="output2" :rules="[{ required: true, message: 'Required' }]">
                <a-textarea :rows="1" :autosize="true" v-model:value="exercise.output2" placeholder="Output">
                </a-textarea>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :lg="6" :md="6" :sm="6">
              <span>Test Case 3</span>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item name="input3" :rules="[{ required: true, message: 'Required' }]">
                <a-textarea :rows="1" :autosize="true" v-model:value="exercise.input3" placeholder="Input">
                </a-textarea>
              </a-form-item>
              <a-form-item name="output3" :rules="[{ required: true, message: 'Required' }]">
                <a-textarea :rows="1" :autosize="true" v-model:value="exercise.output3" placeholder="Output">
                </a-textarea>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :lg="6" :md="6" :sm="6">
              <span>Run file C++</span>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item>
                <input type="file" @change="handleFileChange" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :lg="6" :md="6" :sm="6">
              <span>Test case file C++</span>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item>
                <input type="file" @change="handleTestFileChange" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :lg="6" :md="6" :sm="6">
              <span>Run file Java</span>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item>
                <input type="file" @change="handleFileChangeJava" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :lg="6" :md="6" :sm="6">
              <span>Test case file Java</span>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item>
                <input type="file" @change="handleTestFileJavaChange" />
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

.main-page {
  min-height: 100%;
  height: fit-content !important;
}

.wrapper {
  width: 90%;
  margin: 0 auto;
  padding-bottom: 30px;
}

.submit-button {
  height: 50px;
  width: 300px;
  margin: 0 auto;
}
</style>
