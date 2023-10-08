<script lang="ts" setup>
import Logo from '@/components/icon/header/Logo.vue';
import { useAuthStore, useAuthStoreHook } from '@/stores/auth.store';
import IconSetting from '@/components/icon/header/Icon-Setting.vue';
import IconHome from '@/components/icon/header/Icon-Home.vue';
import IconUser from '@/components/icon/header/Icon-User.vue';
import IconMenu from '@/components/icon/header/Icon-Menu.vue';
import IconSearch from '@/components/icon/header/Icon-Search.vue';
import IconSearchMobile from '@/components/icon/header/Icon-Search-Mobile.vue';
import IconMail from '@/components/icon/header/Icon-Mail.vue';
import IconEllipse from '@/components/icon/header/Icon-Ellipse.vue';
import IconAttention from '@/components/icon/header/Icon-Attention.vue';
import { CloseOutlined } from '@ant-design/icons-vue';
import { computed, ref } from 'vue';
import { USER_TYPE } from '@/stores/constants/constant';

const user = useAuthStore();
const isOpenMenu = ref<boolean>(false);

const openMenuDropDown = (value: any) => {
  isOpenMenu.value = !value.isTrusted;
};

const isUserDiffFaq = computed(() => {
  return user.authUser && user.authUser?.UserType !== USER_TYPE.FAQ;
});

const isUserEmployee = computed(() => {
  return user.authUser && user.authUser?.UserType === USER_TYPE.EMPLOYEE;
});

const isUserFaq = computed(() => {
  return user.authUser && user.authUser?.UserType === USER_TYPE.FAQ;
});

</script>
<template>
  <div class="header-content">
    <logo class="logo"></logo>

    <div v-if="isUserDiffFaq" class="header-menu">
      <div class="user-info">
        <p>{{ (user.authUser?.LastNameKanji ?? '') + ' ' + (user.authUser?.NameKanji ?? '') }}</p>
      </div>

      <div v-if="isUserEmployee" class="menu">
        <router-link to="/faq/search">
          <div class="logo-menu">
            <icon-search></icon-search>
          </div>
          <p class="text-icon">{{ $t('common.menu.search') }}</p>
        </router-link>
      </div>

      <div v-if="isUserEmployee" class="menu">
        <!--        <router-link to="/contact">-->
        <div class="logo-menu">
          <icon-mail></icon-mail>
          <icon-ellipse class="position-absolute icon-ellipse"></icon-ellipse>
        </div>
        <p class="text-icon">{{ $t('common.menu.notice') }}</p>
        <!--        </router-link>-->
      </div>

      <!--Temporarily route to contact -->

      <div class="menu">
        <!--        <router-link to="">-->
        <div class="logo-menu">
          <icon-setting></icon-setting>
        </div>
        <p class="text-icon">{{ $t('common.menu.setting') }}</p>
        <!--        </router-link>-->
      </div>

      <div class="menu">
        <router-link to="/top">
          <div class="logo-menu">
            <icon-home></icon-home>
          </div>
          <p class="text-icon">{{ $t('common.menu.top') }}</p>
        </router-link>
      </div>

      <div class="menu">
        <a
          href="/login-menu"
          @click="
            () => {
              useAuthStoreHook().clearAuthInfo();
            }
          "
        >
          <div class="logo-menu">
            <icon-user></icon-user>
          </div>
          <p class="text-icon" style="width: 60px">{{ $t('common.menu.logout') }}</p>
        </a>
      </div>
    </div>

    <div v-else-if="isUserFaq" class="header-menu">
      <div class="menu">
        <a href="/faq/search?isFaqCode=1">
          <div class="logo-menu">
            <icon-search></icon-search>
          </div>
          <p class="text-icon">{{ $t('common.menu.search') }}</p>
        </a>
      </div>
    </div>

    <div v-if="isUserDiffFaq" class="header-menu-mobile">
      <div v-if="isUserEmployee" class="menu">
        <div class="logo-menu">
          <icon-mail class="icon"></icon-mail>
          <icon-attention class="position-absolute icon-attention-header"></icon-attention>
        </div>
      </div>

      <div class="menu">
        <div class="logo-menu drop-menu">
          <a-dropdown
            class="drop-menu"
            :trigger="['click']"
            @visibleChange="(value:boolean) => { isOpenMenu = value}"
          >
            <div v-if="isOpenMenu">
              <close-outlined class="icon-menu icon-close" @click.prevent></close-outlined>
            </div>
            <div v-else>
              <icon-menu class="icon-menu" @click.prevent></icon-menu>
            </div>
            <template #overlay>
              <a-menu>
                <div class="mt-20 text-center fs-24-w">
                  <p class="m-b-5">
                    {{
                      (user.authUser?.LastNameKanji ?? '') + ' ' + (user.authUser?.NameKanji ?? '')
                    }}
                  </p>
                </div>

                <a-menu-item v-if="isUserEmployee" @click="openMenuDropDown">
                  <div class="sub-menu">
                    <router-link to="/faq/search" class="d-flex">
                      <div class="sub-menu-mobile">
                        <div class="logo-menu-mobile">
                          <icon-search></icon-search>
                        </div>
                      </div>
                      <div class="content-sub-menu fs-20-w">
                        {{ $t('common.menu.searchMobile') }}
                      </div>
                    </router-link>
                  </div>
                </a-menu-item>

                <a-menu-item v-if="isUserEmployee" @click="openMenuDropDown">
                  <div class="sub-menu">
                    <div class="sub-menu-mobile">
                      <div class="logo-menu-mobile">
                        <icon-mail></icon-mail>
                        <icon-attention class="position-absolute icon-attention"></icon-attention>
                      </div>
                    </div>
                    <div class="content-sub-menu fs-20-w">{{ $t('common.menu.notice') }}</div>
                  </div>
                </a-menu-item>

                <a-menu-item @click="openMenuDropDown">
                  <div class="sub-menu">
                    <div class="sub-menu-mobile">
                      <div class="logo-menu-mobile">
                        <icon-setting></icon-setting>
                      </div>
                    </div>
                    <div class="content-sub-menu fs-20-w">{{ $t('common.menu.setting') }}</div>
                  </div>
                </a-menu-item>

                <a-menu-item @click="openMenuDropDown">
                  <div class="sub-menu">
                    <router-link to="/top" class="d-flex">
                      <div class="sub-menu-mobile">
                        <div class="logo-menu-mobile">
                          <icon-home></icon-home>
                        </div>
                      </div>
                      <div class="content-sub-menu fs-20-w">{{ $t('common.menu.top') }}</div>
                    </router-link>
                  </div>
                </a-menu-item>

                <a-menu-item @click="openMenuDropDown">
                  <a
                    href="/login-menu"
                    @click="
                      () => {
                        useAuthStoreHook().clearAuthInfo();
                      }
                    "
                  >
                    <div class="sub-menu m-b-50">
                      <div class="sub-menu-mobile">
                        <div class="logo-menu-mobile">
                          <icon-user></icon-user>
                        </div>
                      </div>
                      <div class="content-sub-menu fs-20-w">{{ $t('common.menu.logout') }}</div>
                    </div>
                  </a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>

    <div v-else-if="isUserFaq" class="header-menu-mobile">
      <div class="menu">
        <router-link to="/faq/search?isFaqCode=1">
          <div class="logo-menu">
            <icon-search-mobile></icon-search-mobile>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import '../../../assets/styles/common.css';
.ant-layout-header .trigger {
  font-size: 18px;
  line-height: 64px;
  cursor: pointer;
  transition: color 0.3s;
}

.btn-dropdown {
  float: right;
  display: flex;
}
.user-info {
  font-size: 20px;
  font-weight: 500;
  margin-right: 15px;
}

.header-menu-mobile {
  display: none;
}

.text-icon {
  position: absolute;
  bottom: 0;
  height: 25px;
  text-align: center;
  width: 50px;
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
}

.sub-menu {
  display: flex;
  gap: 20px;
}

.menu {
  position: relative;
  width: 60px;
}

.logo-menu {
  background-color: #ffffff;
  border-radius: 40px;
  width: 48px;
  height: 48px;
  text-align: center;
  padding: 3px;
}

.header-menu {
  display: flex;
  float: right;
  color: #ffffff;
  padding: 18px 0 18px 18px;
  height: 100px;
  gap: 25px;
}

.header-content {
  height: 100px;
}

.logo {
  margin-top: 22px;
}

.icon-ellipse {
  margin: 5px 0 0 -8px;
}

@media screen and (max-width: 767px) {
  .logo {
    width: 120px !important;
    height: 30px !important;
    margin-top: 9px !important;
  }

  .header-content {
    height: 48px !important;
  }

  .header-menu {
    display: none;
  }

  .header-menu-mobile {
    display: flex !important;
    float: right;
    color: #ffffff !important;
    margin-top: 8px;
    margin-bottom: 8px;
    gap: 15px;
  }

  .logo-menu {
    width: 32px !important;
    height: 32px !important;
  }

  .sub-menu-mobile {
    background-color: #ffffff;
    border-radius: 40px;
    width: 48px;
    height: 48px;
    text-align: center;
    padding: 8px;
  }

  .content-sub-menu {
    padding: 8px;
    cursor: pointer;
  }

  .menu {
    margin-left: 0 !important;
    width: 32px !important;
  }

  .icon {
    width: 24px !important;
    height: 24px !important;
    position: absolute;
    left: 4px;
    bottom: 4px;
  }

  .icon-menu {
    width: 18px !important;
    height: 16px !important;
    position: absolute;
    left: 8px;
    bottom: 8px;
  }

  .icon-close {
    margin: 0 0 2px -2px;
    color: #007f99;
    font-size: 22px;
  }

  .icon-attention {
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -10px;
  }

  .icon-attention-header {
    margin: -5px 0 0 5px;
  }

  ::v-global(.ant-dropdown) {
    width: 100% !important;
    top: 50px !important;
  }

  ::v-global(.ant-dropdown-menu) {
    background-color: #007f99 !important;
  }

  ::v-deep(.ant-dropdown-menu-item) {
    margin-left: 30px;
    padding: 15px 12px !important;
  }

  ::v-deep(.ant-dropdown-menu-item:hover) {
    background-color: #007f99 !important;
  }
}

@media screen and (max-width: 820px) {
  .header-menu {
    gap: 15px;
  }

  .logo {
    width: 165px;
  }
}
</style>
