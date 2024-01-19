<script lang="ts" setup>
import { ref } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';

</script>

<template>
  <page-layout :is-loading="false">
    <div class="main-page">
      <div class="container">
        <h1>Term of use </h1>
        <p>Your program is restricted from accessing any files. It should read input from the standard input and write
          output to the standard output..<br><br> It is not allowed to create new processes using commands such as
          system(), fork(), or threads. Additionally, network connections are prohibited.<br><br> Your program must not
          connect to the network.<br><br>Operations that do not utilize CPU resources, such as sleep(), pause(), or
          waiting for events, are not permitted..<br><br> Prohibit
          submissions for purposes other than problem solving.<br><br> Please refrain from submitting programs for any
          purposes other than problem-solving. Any intentional use of the restricted operations mentioned above or any
          malicious program will be considered an attack on the judge systems.</p>
      </div>
    </div>
  </page-layout>
</template>


<style scoped>
@import '../../assets/styles/common.css';
@import '../../assets/styles/color.css';


.main-page {
  min-height: 100%;
  height: fit-content !important;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 50px 300px;
}
</style>