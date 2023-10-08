<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import FileUser from '@/components/icon/FileUser.vue';
import Setting from '@/components/icon/Setting.vue';
import Logout from '@/components/icon/Logout.vue';
import router from '@/router';
import { useAuthStoreHook } from '@/stores/auth.store';
</script>

<template>
  <a-dropdown>
    <a-avatar size="large" style="margin-top: 15px" @click.prevent>
      <template #icon><UserOutlined /></template>
    </a-avatar>
    <template #overlay>
      <a-menu>
        <a-menu-item>
          <a href="javascript:;">
            <div class="card">
              <div class="icon-card">
                <FileUser class="icon"></FileUser>
              </div>
              <div class="content">マイページ</div>
            </div>
          </a>
        </a-menu-item>
        <a-menu-item>
          <a href="javascript:;">
            <div class="card">
              <div class="icon-card">
                <Setting class="icon"></Setting>
              </div>
              <div class="content">設定</div>
            </div>
          </a>
        </a-menu-item>
        <a-menu-item>
          <a
            href="/login-menu"
            @click="
              () => {
                useAuthStoreHook().clearAuthInfo();
              }
            "
          >
            <div class="card">
              <div class="icon-card">
                <Logout class="icon"></Logout>
              </div>
              <div class="content">ログアウト</div>
            </div>
          </a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style scoped>
.card {
  display: flex;
  height: 40px;
  padding: 10px 16px;
}
.icon {
  font-size: 24px;
  margin-right: 30px;
}
.content {
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.87);
}
::v-deep(.ant-dropdown-menu-item:hover) {
  background-color: rgba(187, 222, 251, 0.3) !important;
}
::v-deep(li:hover path) {
  fill: rgba(21, 101, 192, 1) !important;
}
::v-deep(li:hover .content) {
  color: rgba(21, 101, 192, 1) !important;
}
</style>
