<script setup lang="ts"></script>

<template>
  <div class="tag">
    <slot />
  </div>
</template>
<style scoped>
.tag {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  border-radius: 30px;
  max-height: 36px;
  font-weight: 700;
  font-size: 14px;
  line-height: 36px;
  display: flex;
  text-align: center;
  letter-spacing: 1.25px;
}
</style>
