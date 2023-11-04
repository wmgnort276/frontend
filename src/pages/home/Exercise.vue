<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';
import { Codemirror } from 'vue-codemirror'
import { cpp } from '@codemirror/lang-cpp'
import { oneDark } from '@codemirror/theme-one-dark'

let isLoading = ref<boolean>(false);
let rateValue = ref<number>(3);
const extensions = [cpp(), oneDark];
let code = ref<any>('');
const handleReady = () => { }

const handleChange = () => {
    // console.log(code.value);
}

const handleFocus = () => { }

const handleBlur = () => { }

const handleSubmit = async () => {
    
}

</script>

<template>
    <page-layout :is-loading="isLoading">
        <div class="main-page">
            <div class="flex gap-10 wrapper">
                <a-col class="card" :lg="10" :md="10">
                    <a-row>
                        <h4>Name of exercise</h4>
                    </a-row>
                    <a-row class="description flex align-center gap-10 mb-10">
                        <span>Medium</span>
                        <a-rate v-model:value="rateValue" />
                    </a-row>
                    <a-row class="content">
                        You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).

                        You have to rotate the image in-place, which means you have to modify the input 2D matrix directly.
                        DO NOT
                        allocate another 2D matrix and do the rotation.
                    </a-row>
                </a-col>

                <a-col :lg="14" :md="14" class="flex-column gap-10 ">
                    <a-col :lg="24" :md="24" class="card">
                        <codemirror v-model="code" placeholder="Code goes here..." :style="{ height: '400px' }"
                            :autofocus="true" :indent-with-tab="true" :tab-size="2" :extensions="extensions"
                            @ready="handleReady" @change="handleChange" @focus="handleFocus" @blur="handleBlur" />
                    </a-col>

                    <div class="card test-case">
                        
                    </div>
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
}

.wrapper {
    max-width: 98%;
    margin: 0 auto;
    justify-content: space-around;
    padding-top: 30px;
    max-height: 100%;
    overflow: hidden;
}

.test-case {
    height: 30px;
}
</style>