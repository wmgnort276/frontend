<script setup lang="ts">
import { ref, watch } from 'vue';
import { CaretRightOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  data: Array,
  styleProps: Object,
  placeHolder: String,
  size: String,
  type: String
});

const emit = defineEmits(['select']);
const answerData = ref<string>('');
const hanldeSelect = (value: any) => {
  emit('select', value);
};

watch(answerData, async (newQuestion, oldQuestion) => {});
const urlName = ref<string>('');
const urlLink = ref<string>('');
</script>

<template>
  <div style="width: 100%">
    <a-select
      v-if="props.type == 'select'"
      class="input-option"
      :style="props.styleProps"
      @change="hanldeSelect"
      :placeholder="props.placeHolder"
      :size="props.size"
    >
      <a-select-option v-for="(item, index) in props.data" :key="index" :value="item">
        {{ item }}
      </a-select-option>
    </a-select>
    <a-input-number
      v-else-if="props.type == 'input-number'"
      @change="hanldeSelect"
      class="input-option"
      :style="props.styleProps"
      :size="props.size"
      :placeholder="props.placeHolder"
    ></a-input-number>
    <div
      class="input-option date-picker"
      v-else-if="props.type == 'date-picker'"
      :style="props.styleProps"
    >
      <a-date-picker
        class="date"
        @change="hanldeSelect"
        :size="props.size"
        format="YYYY/MM/DD"
        :placeholder="$t('faq-create.dateStartPlaceholder')"
      />
      <span class="devider">～</span>
      <a-date-picker
        @change="hanldeSelect"
        class="date"
        :size="props.size"
        format="YYYY/MM/DD"
        :placeholder="$t('faq-create.dateEndPlaceholder')"
      />
    </div>
    <div class="input-option textarea" v-else-if="props.type == 'textarea'">
      <a-textarea @change="hanldeSelect" :rows="3" :placeholder="props.placeHolder"></a-textarea>
    </div>
    <div class="input-option" v-else-if="props.type == 'url'" :style="props.styleProps">
      <a-input
        class="url-name"
        v-model:value="urlName"
        placeholder="URL TITLE"
        :size="props.size"
      />
      <a-input class="url-link" v-model:value="urlLink" placeholder="https://" :size="props.size" />
    </div>
    <div class="input-option" v-else>
      <a-input :size="props.size" :placeholder="props.placeHolder" />
    </div>
  </div>
</template>

<style scoped>
.input-option {
  margin: 5px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-option > ::v-deep(.ant-select-selector) {
  border-radius: 5px;
}

.input-option > ::v-deep(.ant-input) {
  border-radius: 5px;
}

.input-option > ::v-deep(.ant-picker) {
  border-radius: 5px;
}

.devider {
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
}

.input-option > .url-name {
  flex: 3;
}

.input-option > .url-link {
  flex: 7;
}

.input-option > ::v-deep(.ck-reset) {
  width: 100%;
}

.input-option ::v-deep(.ck-editor__main > .ck-editor__editable) {
  min-height: 150px;
}

::v-deep(.ant-input-number-input-wrap) {
  border-radius: 5px !important;
  overflow: hidden;
}

.date {
  width: 283px;
}

.textarea {
  width: 585px;
}

.date > ::v-deep(.ant-picker-input) {
  width: 100%;
}
</style>
