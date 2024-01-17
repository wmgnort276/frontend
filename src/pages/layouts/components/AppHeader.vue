<script lang="ts" setup>
import { useAuthStoreHook } from '@/stores/auth.store';
import { CloseOutlined } from '@ant-design/icons-vue';
import { computed, ref } from 'vue';
import router from '@/router';

const authStore = useAuthStoreHook();

const handleRouteToUserPage = () => {
  router.push({
    path: `/user/${authStore.userName}`
  });
};

const routeToHome = () => {
  router.push({
    path: '/home'
  });
};

const routeToCompiler = () => {
  router.push({
    path: '/compiler'
  });
};

const routeToDashboard = () => {
  router.push({
    path: '/exercise-create'
  });
};
console.log(authStore.authUser);
const isAdmin = computed(() => authStore.authUser?.role?.includes('Admin'));
</script>
<template>
  <div class="header-content flex align-center">
    <div class="left-side">
      <h3 @click="routeToHome" class="pointer page-title">CodeDeep</h3>
      <a-button class="button-classify-problem mr-10" @click="routeToDashboard" v-if="isAdmin">
        Dash Board
      </a-button>
      <a-button class="button-classify-problem mr-10" @click="routeToCompiler"> Compiler </a-button>
    </div>
    <div class="img-wrapper">
      <img
        src="../../../components/default_avatar.png"
        class="img"
        @click="handleRouteToUserPage"
      />
    </div>
  </div>
</template>
<style scoped>
@import '../../../assets/styles/common.css';
@import '../../../assets/styles/color.css';

.page-title {
  color: #b45b08;
  font-family: 'Droid serif', serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 44px;
  text-align: center;
  display: flex;
  align-items: center;
}

.img {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  cursor: pointer;
}

.header-content {
  height: 100%;
  justify-content: space-between;
}

.left-side {
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>
