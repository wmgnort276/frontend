<script setup lang="ts">
const props = defineProps({
  status: {
    type: Boolean,
  },
  input: {
    type: String,
  },
  expected: {
    type: String,
  },
  output: {
    type: String,
  },
  isSubmitted: {
    type: Boolean
  }
});
</script>

<template>
  <div>
    <div class="Input flex">
      <a-col :md="3" :lg="3" :sm="3">Input</a-col>
      <a-col :md="15" :lg="15" :sm="15">
        <span> {{ input }}</span>
      </a-col>
    </div>

    <div class="Expected flex">
      <a-col :md="3" :lg="3" :sm="3">Expected</a-col>
      <a-col :md="15" :lg="15" :sm="15">
        <span>{{ expected }}</span>
      </a-col>
    </div>

    <div class="Output flex">
      <a-col :md="3" :lg="3" :sm="3">Output</a-col>
      <a-col :md="15" :lg="15" :sm="15">
        <span class="output-result" :class="{ 'output-result-error': !status && isSubmitted }"> {{ output }}</span>
      </a-col>
    </div>
  </div>
</template>

<style scoped>
.output-result {
  display: block;
  height: 50px;
  overflow: hidden !important;
  overflow-y: scroll !important;
  word-break: break-all;
}

.output-result-error {
  color: #ef4743;
}
</style>