<script lang="ts" setup>
import { useAuthStore, useAuthStoreHook } from '@/stores/auth.store';
import { CloseOutlined } from '@ant-design/icons-vue';
import { computed, ref } from 'vue';
import router from '@/router';

const handleRouteToUserPage = () => {
  router.push({
    path: '/user/1'
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
</script>
<template>
  <div class="header-content flex align-center">
    <div class="left-side">
      <h3 @click="routeToHome" class="pointer">CodeDeep</h3>
      <a-button class="button-classify-problem mr-10" @click="routeToDashboard">
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

.img {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  cursor: pointer;
}

.img-wrapper {
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
