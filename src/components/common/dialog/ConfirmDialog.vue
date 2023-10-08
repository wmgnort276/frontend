<script setup lang="ts">
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  showOk: {
    type: Boolean,
    default: true
  },
  showCancel: {
    type: Boolean,
    default: false
  },
  message: {
    type: String
  },
  cancelTitle: {
    type: String,
    default: 'Cancel'
  },
  type: {
    type: String
  },
  okTitle: {
    type: String,
    default: 'OK'
  }
});
const emits = defineEmits(['update:visible', 'ok', 'cancel']);
const handleOK = () => {
  emits('update:visible', false);
  emits('ok');
};
const handleCancel = () => {
  emits('update:visible', false);
  emits('cancel');
};
</script>

<template>
  <a-modal
    class="dialog"
    centered
    :visible="props.visible"
    @update:visible="emits('update:visible', $event)"
    :closable="true"
    :footer="null"
    :maskClosable="true"
    v-if="type === 'center'"
  >
    <div class="message">
      <span>{{ message }}</span>
    </div>
    <div class="action-btn">
      <a-button class="btn-ok text" v-if="showOk" @click="handleOK" type="primary">{{
        okTitle
      }}</a-button>
      <a-button class="btn-cancel text" v-if="showCancel" @click="handleCancel">{{
        cancelTitle
      }}</a-button>
    </div>
  </a-modal>
  <a-modal
    class="dialog br-8"
    style="width: -webkit-fill-available !important; max-width: 960px !important"
    centered
    :visible="props.visible"
    @update:visible="emits('update:visible', $event)"
    :closable="false"
    :footer="null"
    v-if="type === 'right'"
  >
    <div class="message left">
      <span>{{ message }}</span>
    </div>
    <div class="action-btn right">
      <a-button class="btn-white m-0 text" v-if="showCancel" @click="handleCancel">{{
        cancelTitle
      }}</a-button>
      <a-button class="btn-ok text" v-if="showOk" @click="handleOK" type="primary">{{
        okTitle
      }}</a-button>
    </div>
  </a-modal>
</template>

<style scoped>
.dialog .ant-modal-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  max-width: 960px !important;
  background: #ffffff;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14),
    0px 1px 5px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
}
.dialog ::v-deep(.ant-modal-content) {
  max-width: 960px !important;
}
.action-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 10px;
}
.action-btn.center {
  justify-content: center;
}
.action-btn.right {
  justify-content: flex-end;
}
.btn-ok {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 20px;
  gap: 16px;
  width: 68px;
  height: 44px;
  background: #1976d2;
  border-radius: 4px;
}
.btn-cancel {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 20px;
  gap: 16px;
  height: 44px;
  background: #b8b8b8;
  border-radius: 4px;
}
.text {
  font-weight: 500;
  font-size: 20px;
  line-height: 36px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 1.25px;
  text-transform: uppercase;
}
.message {
  display: flex;
  flex-direction: column;
  padding: 20px 0px;
  margin-bottom: 20px;
}
.message.center {
  align-items: center;
  justify-content: center;
}
.message > span {
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  color: rgba(55, 71, 79, 0.95);
}

.br-8 ::v-deep(.ant-modal-content) {
  border-radius: 8px !important;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 1px 1px 0px rgba(0, 0, 0, 0.2);
}
</style>
