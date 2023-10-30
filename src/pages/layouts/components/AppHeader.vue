<script lang="ts" setup>
import { useAuthStore, useAuthStoreHook } from '@/stores/auth.store';
import { CloseOutlined } from '@ant-design/icons-vue';
import { computed, ref } from 'vue';
import router from '@/router';

const hanldeRouteToUserPage = () => {
  router.push({
    path: '/user/namvn',
  })
}

const routeToHome = () => {
  router.push({
    path: '/home'
  })
}

</script>
<template>
  <div class="header-content flex align-center">
    <div>
      <h3 @click="routeToHome" class="pointer">
        HoanNT
      </h3>
    </div>
    <div class="img-wrapper">
      <img src="../../../components/default_avatar.png" class="img" @click="hanldeRouteToUserPage"/>
    </div>
  </div>
</template>
<style scoped>

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
</style>
