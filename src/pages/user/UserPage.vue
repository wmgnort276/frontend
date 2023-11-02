<script setup lang="ts">
import { ref } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';

let isLoading = ref<boolean>(false);
let data = ref<any>([]);

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
]
</script>

<template>
    <page-layout :is-loading="isLoading">
        <div class="main-page">
            <div class="flex gap-20 wrapper">
                <a-col :md="6" class="card">
                    <a-row class="user-information flex gap-20">
                        <a-col class="pointer">
                            <img src="../../components/icons8-user-48.png" />
                        </a-col>
                        <a-col>
                            <a-row style="font-weight: 700;">
                                NamVu276
                            </a-row>
                            <a-row>
                                Rank 123
                            </a-row>
                        </a-col>
                    </a-row>

                    <a-row class="button-edit-info mt-10">
                        <a-button class="edit-profile">Edit Profile</a-button>
                    </a-row>

                    <a-divider />

                    <a-row class="flex-column gap-10">
                        <a-row>
                            <h4>Skills</h4>
                        </a-row>

                        <a-row>
                            <h5>Advanced</h5>
                        </a-row>

                        <a-row class="flex align-center mb-10">
                            <a-button class="button-classify-problem mr-10"> Dynamic Programming</a-button>
                            <s-pan> x4</s-pan>
                        </a-row>

                        <a-row class="flex align-center mb-10">
                            <a-button class="button-classify-problem mr-10"> Backtracking </a-button>
                            <s-pan> x10</s-pan>
                        </a-row>

                        <a-row class="flex align-center mb-10">
                            <a-button class="button-classify-problem mr-10"> Devide and Conquer</a-button>
                            <s-pan> x8</s-pan>
                        </a-row>
                    </a-row>

                </a-col>

                <a-col :md="16" class="flex-column gap-20">
                    <a-row class="solved-problems flex-column card">
                        <a-row>
                            <h5>Solved Problems</h5>
                        </a-row>
                        <a-row class="flex gap-10 align-center">
                            <a-col :md="6" class="mt-20">
                                <a-progress type="circle" :percent="1" size="small" />
                            </a-col>
                            <a-col :md="16">
                                <a-row>
                                    <span class="mr-50">Easy</span>
                                    <span> 15/70 </span>
                                    <a-progress :percent="15 * 100 / 70" class="progress easy" />
                                </a-row>

                                <a-row>
                                    <span class="mr-50">Medium</span>
                                    <span> 25/70 </span>
                                    <a-progress :percent="25 * 100 / 70" class="progress medium" />
                                </a-row>

                                <a-row>
                                    <span class="mr-50">Hard</span>
                                    <span> 5/70 </span>
                                    <a-progress :percent="5 * 100 / 70" class="progress hard" />
                                </a-row>
                            </a-col>
                        </a-row>
                    </a-row>

                    <a-row class="card flex-column">
                        <a-row class="flex list-problem-header">
                            <h4 class="pointer">Recent AC</h4>
                        </a-row>
                        <a-row>
                            <a-table :columns="columns" :data-source="data">
                                <template #bodyCell="{ column, text }">
                                    <template v-if="column.dataIndex === 'name'">
                                        <a>{{ text }}</a>
                                    </template>
                                </template>
                            </a-table>
                        </a-row>
                    </a-row>
                </a-col>
            </div>
        </div>
    </page-layout>
</template>

<style scoped>
@import '../../assets/styles/common.css';

.main-page {}

.wrapper {
    max-width: 80%;
    margin: 0 auto;
    padding-top: 30px;
}

.edit-profile {
    background-color: #2db55d26;
    border: none;
    border-radius: 5px;
    width: 100%;
    font-weight: 500;
    color: rgb(0, 175, 128);
    height: 40px;
}

.progress :deep(.ant-progress-text) {
    display: none;
}

.easy :deep(.ant-progress-inner) {
    background-color: #2db55d26;
}

.easy :deep(.ant-progress-bg) {
    background-color: rgb(0, 175, 155);
}

.medium :deep(.ant-progress-inner) {
    background-color: #ffb80026;
}

.medium :deep(.ant-progress-bg) {
    background-color: rgb(255, 184, 0);
}

.hard :deep(.ant-progress-inner) {
    background-color: #ef474326;
}

.hard :deep(.ant-progress-bg) {
    background-color: rgb(239, 71, 67);
}

.list-problem-header {
    justify-content: space-between;
}
</style>