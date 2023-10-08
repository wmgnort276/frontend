<script setup lang="ts">
import { useForm } from 'vee-validate';
import BaseInput from '@/components/common/BaseInput.vue';
import UserSchema from '@/types/schemas/user.schema';
import type { TUser } from '@/types/schemas/user.schema';
import { toFormValidator } from '@vee-validate/zod';

interface IProps {
  user: TUser | undefined;
}
const props = defineProps<IProps>();
const validationSchema = toFormValidator(UserSchema);

const { handleSubmit } = useForm<TUser>({
  validationSchema,
  initialValues: props.user
});
const onSubmit = handleSubmit((value) => {
  console.log('values', value);
});
</script>
<template>
  <base-input name="name" label="Name" required />
  <base-input name="email" label="Email" required />
  <a-button type="primary" @click="onSubmit">Submit</a-button>
</template>
