<script lang="ts" setup>
import Logo from '@/components/icon/Logo.vue';
</script>
<template>
  <a-layout class="h-screen min-h-[600px]">
    <section class="flex justify-center my-[10%]">
      <div class="w-[360px]">
        <slot />
      </div>
    </section>
  </a-layout>
</template>
