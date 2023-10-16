<script setup lang="ts">
  import { defineComponent } from 'vue'
  import { ref } from 'vue';
  import { Codemirror } from 'vue-codemirror'
  import { javascript } from '@codemirror/lang-javascript'
  import { oneDark } from '@codemirror/theme-one-dark'

let code = ref<any>('');
const extensions = [javascript(), oneDark]

const handleReady = () => {

}

const handleChange = () => {
    console.log(code.value);
}

const handleFocus = () => {

}

const handleBlur = () => {

}



</script>

<template>
    <div>
        My home page
    </div>
    <div>
        <codemirror
            v-model="code"
            placeholder="Code goes here..."
            :style="{ height: '400px' }"
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
            @ready="handleReady"
            @change="handleChange"
            @focus="handleFocus"
            @blur="handleBlur"
        />
    </div>
</template>

<style scoped>

</style>