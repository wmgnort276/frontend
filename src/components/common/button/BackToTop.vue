<script setup lang="ts">
import { onMounted } from 'vue';
import IconBackToTop from '@/components/icon/IconBackToTop.vue';

onMounted(() => {
  // window.addEventListener('scroll', handleScroll);
});

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};
</script>

<template>
  <div @click="scrollToTop" class="scroll">
    <div class="text-center">
      <IconBackToTop></IconBackToTop>
    </div>
    {{ $t('common.page.button.backToTop') }}
  </div>
</template>

<style scoped>
.scroll {
  position: fixed;
  bottom: 100px;
  left: 150px;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  color: rgba(55, 71, 79, 0.87);
  z-index: 9999;
}

.text-center {
  background-color: rgba(159, 168, 218, 0.8);
  height: 80px;
  width: 80px;
  padding: 18px 20px;
  border-radius: 40px;
  margin-left: 12px;
  margin-bottom: 20px;
}

@media screen and (max-width: 1400px) and (min-width: 927px) {
  .scroll{
    left:10px;
    bottom: 50px;
  }

}


</style>
