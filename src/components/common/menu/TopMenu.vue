<script setup lang="ts">
import { reactive } from 'vue';
import Notice from '@/components/icon/Notice.vue';
import UserMail from '@/components/icon/UserMail.vue';
import GuidanceNotification from '@/components/icon/GuidanceNotification.vue';
import InquiriesFAQs from '@/components/icon/InquiriesFAQs.vue';
import Folder from '@/components/icon/Folder.vue';
import IconChildcareBenefit from '@/components/icon/IconChildcareBenefit.vue';
import IconInsurance from '@/components/icon/IconInsurance.vue';
import IconNote from '@/components/icon/IconNote.vue';
import Chats from '@/components/icon/Chats.vue';
import FolderUser from '@/components/icon/FolderUser.vue';
import MailSend from '@/components/icon/MailSend.vue';
import PhonePlus from '@/components/icon/PhonePlus.vue';
import Phone from '@/components/icon/Phone.vue';
import Comment from '@/components/icon/Comment.vue';
import FAQ from '@/components/icon/FAQ.vue';

const state = reactive({
  selectedKeys: [],
  openKeys: []
});
</script>

<template>
  <div>
    <a-menu
      v-model:openKeys="state.openKeys"
      v-model:selectedKeys="state.selectedKeys"
      mode="inline"
    >
      <a-menu-item key="1">
        <template #icon>
          <Notice />
        </template>
        {{ $t('common.menu.notice') }}
      </a-menu-item>

      <a-sub-menu key="request_notification">
        <template #icon>
          <UserMail />
        </template>
        <template #title>{{ $t('common.menu.request_notification') }}</template>

        <div class="sub-menu">
          <a-menu-item key="health_insurance" class="p-l-0">
            <template #icon>
              <IconInsurance />
            </template>
            {{ $t('common.menu.health_insurance') }}
          </a-menu-item>
        </div>

        <div class="sub-menu">
          <a-menu-item key="confirmation_issuance" class="p-l-0">
            <template #icon>
              <IconNote />
            </template>
            {{ $t('common.menu.confirmation_issuance') }}
          </a-menu-item>
        </div>

        <div class="sub-menu">
          <a-menu-item key="childcare_benefit" class="border-b-none p-l-0">
            <template #icon>
              <IconChildcareBenefit />
            </template>
            {{ $t('common.menu.childcare_benefit') }}
          </a-menu-item>
        </div>
      </a-sub-menu>

      <a-sub-menu key="guidance_notification">
        <template #icon>
          <GuidanceNotification />
        </template>

        <template #title>{{ $t('common.menu.guidance_notification') }}</template>
        <div class="sub-menu">
          <a-menu-item key="sub_gui_notification_1" class="p-l-0">
            <template #icon>
              <MailSend />
            </template>
            {{ $t('common.menu.childcare_benefit') }}
          </a-menu-item>
        </div>

        <div class="sub-menu">
          <a-menu-item key="sub_gui_notification_2" class="p-l-0">
            <template #icon>
              <IconNote />
            </template>
            {{ $t('common.menu.sub_gui_notification_2') }}
          </a-menu-item>
        </div>

        <div class="sub-menu">
          <a-menu-item key="sub_gui_notification_3" class="p-l-0">
            <template #icon>
              <Chats />
            </template>
            {{ $t('common.menu.sub_gui_notification_3') }}
          </a-menu-item>
        </div>

        <div class="sub-menu">
          <a-menu-item key="sub_gui_notification_4" class="p-l-0">
            <template #icon>
              <PhonePlus />
            </template>
            {{ $t('common.menu.sub_gui_notification_4') }}
          </a-menu-item>
        </div>

        <div class="sub-menu">
          <a-menu-item key="sub_gui_notification_5" class="border-b-none p-l-0">
            <template #icon>
              <FolderUser />
            </template>
            {{ $t('common.menu.sub_gui_notification_5') }}
          </a-menu-item>
        </div>
      </a-sub-menu>

      <a-sub-menu key="inquiries_FAQs">
        <template #icon>
          <InquiriesFAQs />
        </template>

        <template #title>{{ $t('common.menu.inquiries_FAQs') }}</template>
        <div class="sub-menu">
          <a-menu-item key="sub_faq_1" class="p-l-0">
            <template #icon>
              <Phone />
            </template>
            {{ $t('common.menu.sub_faq_1') }}
          </a-menu-item>
        </div>

        <div class="sub-menu">
          <a-menu-item key="sub_faq_2" class="p-l-0">
            <template #icon>
              <FAQ />
            </template>
            {{ $t('common.menu.sub_faq_2') }}
          </a-menu-item>
        </div>

        <div class="sub-menu">
          <a-menu-item key="sub_faq_3" class="border-b-none p-l-0">
            <template #icon>
              <Comment />
            </template>
            {{ $t('common.menu.sub_faq_3') }}
          </a-menu-item>
        </div>
      </a-sub-menu>

      <a-menu-item key="file_share" class="border-b-none">
        <template #icon>
          <Folder />
        </template>
        {{ $t('common.menu.file_share') }}
      </a-menu-item>
    </a-menu>
  </div>
</template>

<style scoped>
::v-deep(.ant-menu-title-content) {
  font-size: 18px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.87);
  margin-left: 20px !important;
}

::v-deep(.ant-menu) {
  border-radius: 8px;
}

::v-deep(.ant-menu-item) {
  min-height: 80px;
  white-space: normal;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}

::v-deep(.ant-menu-submenu) {
  min-height: 80px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}

::v-deep(.border-b-none) {
  border-bottom: none !important;
}

::v-deep(.ant-menu-submenu-title) {
  min-height: 65px !important;
}

::v-deep(.sub-menu) {
  margin-left: 24px;
  margin-right: 24px;
}

::v-deep(.p-l-0) {
  padding-left: 20px !important;
}
</style>
