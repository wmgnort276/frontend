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
    }).catch((error : any) => {
        message.error(error?.response?.data ? error?.response?.data : 'Compile failed!' );
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
        <div>
            <codemirror v-model="code" placeholder="Code goes here..." :style="{ height: '400px' }" :autofocus="true"
                :indent-with-tab="true" :tab-size="2" :extensions="extensions" @ready="handleReady" @change="handleChange"
                @focus="handleFocus" @blur="handleBlur" />
            <span>
                Output:
            </span>
            <a-textarea :value="codeOutput" :autosize="true" :readonly="true"></a-textarea>
            <div class="flex align-center">
                <a-button class="mt-20 main-color text-second-color" @click="handleSubmit">
                    Run code
                </a-button>
            </div>
            <!-- <div>
                <a-button @click="handleCallFakeApi">
                    Call Fake Api
                </a-button>
            </div> -->
        </div>
    </page-layout>
</template>

<style scoped>
@import '../../assets/styles/color.css';
@import '../../assets/styles/common.css';
</style>