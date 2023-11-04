<script setup lang="ts">
import { ref } from 'vue';
import { Codemirror } from 'vue-codemirror'
//   import { javascript } from '@codemirror/lang-javascript'
import { cpp } from '@codemirror/lang-cpp'
import { oneDark } from '@codemirror/theme-one-dark'
import { submitCode } from '@/api/submit'
import { fakeApi } from '@/api/common.api';
import { message } from 'ant-design-vue';
import PageLayout from '../layouts/PageLayout.vue';

let isLoading = ref<boolean>(false);
let code = ref<any>('');
let codeOutput = ref<any>('');

// const extensions = [javascript(), oneDark]
const extensions = [cpp(), oneDark]

const handleReady = () => {

}

const handleChange = () => {
    // console.log(code.value);
}

const handleFocus = () => {

}

const handleBlur = () => {

}

const handleSubmit = async () => {
    isLoading.value = true;
    await submitCode({
        code: code.value
    }).then((res: any) => {
        codeOutput.value = res;
    }).catch((error: any) => {
        console.log("🚀 ~ file: Compiler.vue:42 ~ handleSubmit ~ error:", error)
        message.error(error?.response?.data ? error?.response?.data : 'Compile failed!');
        console.log(error);
    }).finally(() => {
        isLoading.value = false;
    })
}

const handleCallFakeApi = async () => {
    let result = await fakeApi();
    console.log("🚀 ~ file: HomePage.vue:46 ~ handleCallFakeApi ~ result:", result)
}

</script>

<template>
    <page-layout :is-loading="isLoading">
        <div class="main-page">
            <a-row class="wrapper">
                <a-col :lg="24" :md="24">
                    <codemirror v-model="code" placeholder="Code goes here..." :style="{ height: '400px' }"
                        :autofocus="true" :indent-with-tab="true" :tab-size="2" :extensions="extensions"
                        @ready="handleReady" @change="handleChange" @focus="handleFocus" @blur="handleBlur" />
                </a-col>
                <a-col :lg="24" :md="24">
                    <a-row class="button-submit mb-10">
                        <a-button class="mt-20 main-color text-second-color" @click="handleSubmit">
                            Run code
                        </a-button>
                    </a-row>
                    <a-row :lg="16" :md="16">
                        <a-textarea :value="codeOutput" :rows="5" :readonly="true"></a-textarea>
                    </a-row>

                </a-col>
                <!-- <div>
                    <a-button @click="handleCallFakeApi">
                        Call Fake Api
                    </a-button>
                </div> -->
            </a-row>
        </div>
    </page-layout>
</template>

<style scoped>
@import '../../assets/styles/color.css';
@import '../../assets/styles/common.css';



.wrapper {
    height: 100% !important;
    display: flex;
    gap: 10px;
}

:deep(.cm-editor) {
    height: 500px;
}

.button-submit {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>