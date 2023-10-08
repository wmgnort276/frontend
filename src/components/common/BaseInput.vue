<script lang="ts">
import { Input, InputPassword } from 'ant-design-vue';

export default {
  components: {
    AInput: Input,
    AInputPassword: InputPassword
  }
};
</script>
<script setup lang="ts">
import { computed, toRef } from 'vue';
import { useField } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { renderMsgValidate } from '@/utils/message-validate';
interface Props {
  name: string;
  label?: string;
  type?: string;
  required?: boolean;
  size?: 'large' | 'default' | 'small';
  disabled?: boolean;
  allowClear?: boolean;
  componentType?: 'AInput' | 'AInputPassword';
}

const { t } = useI18n();
const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: true,
  label: '',
  size: 'default',
  disabled: false,
  allowClear: false,
  componentType: 'AInput'
});

const isError = computed(() => (errorMessage.value ? 'error' : undefined));

const errorMsg = computed(() => {
  const msg = renderMsgValidate(errorMessage.value);
  return msg.key ? t(msg.key, msg.param) : '';
});

const { errorMessage, value } = useField<string | number | undefined>(toRef(props, 'name'));
</script>
<template>
  <a-form-item :label="label" :required="required" :help="errorMsg" :validate-status="isError">
    <component
      :is="componentType as string"
      v-model:value.lazy="value"
      v-bind="$attrs"
      :type="type"
      :size="size"
      :disabled="disabled"
      :allow-clear="allowClear"
    >
      <template>
        <slot
          name="prefix"
          :class-name="isError ? 'site-form-item-icon' : 'text-primary'"
          :is-error="isError"
        ></slot>
      </template>
      <template>
        <slot name="suffix"></slot>
      </template>
    </component>
  </a-form-item>
</template>
