<script setup lang="ts">
import { onMounted, ref } from 'vue';
import UserSchema, { type TUser } from '@/types/schemas/user.schema';
import UserForm from '@/pages/users/components/UserForm.vue';
import PageLayout from '@/pages/layouts/PageLayout.vue';
import axios from 'axios';

const user = ref<TUser>();
const isLoading = ref<boolean>(true);
onMounted(async () => {
  user.value = await fetchPosts();
  isLoading.value = false;
});

const fetchPosts = () => {
  return axios('https://jsonplaceholder.typicode.com/users/1')
    .then((response) => UserSchema.parse(response.data))
    .catch((error) => {
      return error;
    });
};
</script>
<template>
  <page-layout :is-loading="isLoading">
    <template v-if="user">
      <UserForm :user="user" />
    </template>
  </page-layout>
</template>
