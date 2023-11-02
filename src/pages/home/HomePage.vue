<script setup lang="ts">
import { defineComponent } from 'vue'
import { ref } from 'vue';
import { Codemirror } from 'vue-codemirror'
//   import { javascript } from '@codemirror/lang-javascript'
import { cpp } from '@codemirror/lang-cpp'
import { oneDark } from '@codemirror/theme-one-dark'
import { submitCode } from '@/api/submit'
import { getTestApi, fakeApi } from '@/api/common.api';

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
    try {
        codeOutput.value = await submitCode({
            code: code.value
        })
        console.log("🚀 ~ file: HomePage.vue:35 ~ handleSubmit ~ codeOutput.value:", codeOutput.value)
    } catch (error) {
        console.log("🚀 ~ file: HomePage.vue:38 ~ handleSubmit ~ error:", error)
    }
}

const handleCallFakeApi = async () => {
    let result = await fakeApi();
    console.log("🚀 ~ file: HomePage.vue:46 ~ handleCallFakeApi ~ result:", result)
}

</script>

<template>
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
</template>

<style scoped>
@import '../../assets/styles/color.css';
@import '../../assets/styles/common.css';
</style>