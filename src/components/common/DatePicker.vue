<script setup lang="ts">
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { watchEffect } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import locale from 'ant-design-vue/es/date-picker/locale/ja_JP';
import 'dayjs/locale/ja';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
delete customParseFormat.$i;
dayjs.extend(customParseFormat, {
  parseTwoDigitYear: (yearString: string) => {
    return +yearString + (+yearString >= 50 ? 1900 : 2000);
  }
});

const emit = defineEmits(['changeDate']);
const props = defineProps({
  index: Number || null,
  placeHolder: String,
  customeFormats: String,
  chosenDate: Dayjs || null || undefined
});

const disableDate = (current: Dayjs) => {
  const limitYear = new Date(2999, 12, 31);

  if (dayjs(current).year() < limitYear.getFullYear()) {
    return false;
  }

  return true;
};

const defaultFormats = ['YYYY/M/D', 'YYYY/M/DD', 'YYYY/MM/DD', 'YY/MM/DD', 'MM/DD', 'M/DD'];

let dateFormats = ref<String[]>(defaultFormats);

if (props.customeFormats !== '' && props.customeFormats) {
  dateFormats.value.push(props.customeFormats);
}

const selectedDate = ref<any>(props.chosenDate);

const handleChange = (value: any, text: any, index: any) => {
  // When clear data
  if (value == null) {
    selectedDate.value = undefined;
    emit('changeDate', null, index);
  }

  emit('changeDate', dayjs(value), index);
};

watchEffect(() => {
  selectedDate.value = props.chosenDate;
});
</script>

<template>
  <div>
    <a-date-picker
      class="date input-height"
      :value-format="'YYYY/MM/DD'"
      size="large"
      :placeholder="props.placeHolder"
      @change="(value: any, text: any) => handleChange(value, text, index)"
      v-model:value="selectedDate"
      :disabled-date="disableDate"
      :format="dateFormats"
      :allowClear="false"
      :locale="locale"
    />
  </div>
</template>
