<script setup lang="ts">
import router from '@/router';
const handleBackToTop = () => {
    router.push('/top');
}
</script>

<template>
 <div>
    <div class="main-page">
        <div class="content-section card">
            <div class="title">
              {{ $t('contact.success.title') }}
            </div>
            <div class="content">
                {{ $t('contact.success.content') }}
            </div>
        </div>
        <div class="button-section">
            <a-button class="btn-primary" @click="handleBackToTop">
                {{ $t('contact.success.confirmBtn') }}
            </a-button>
        </div>
    </div>
 </div>
</template>

<style scoped>
@import './../../assets/styles/common.css';
@import './../../assets/styles/page.css';
@import './../../assets/styles/button.css';

.button-section {
    display: flex;
    align-items: center;
    justify-content: center;
}
.main-page {
    max-width: 50%;
    margin-top: 100px;
}

.content-section {
    border-radius: 0px;
}
</style>