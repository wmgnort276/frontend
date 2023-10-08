<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { t } from '@/plugins/i18n';

const postcode = ref<number>();
const prefecture = ref<string>();
const city = ref<string>();
const suburb = ref<string>();
const errorPostCode = ref<string>();
const UrlPostCode = 'https://postcode.teraren.com/postcodes/';

const getPostCode = async (postCode: any) => {
  if (postCode.length != 7) {
    errorPostCode.value = t('common.zip_code.error_7_digit');
    suburb.value = undefined;
    city.value = undefined;
    prefecture.value = undefined;
    return;
  }
  const url = UrlPostCode + postCode + '.json';
  await axios
    .get(url)
    .then((response) => {
      suburb.value = response.data.suburb;
      city.value = response.data.city;
      prefecture.value = response.data.prefecture;
      errorPostCode.value = undefined;
    })
    .catch(() => {
      errorPostCode.value = t('common.zip_code.post_code_undefined');
    });
};
</script>

<template>
  <div class="form-post-code">
    <a-row class="row-post-code">
      <a-col :span="5" class="title">
        <label class="">
          {{ $t('common.zip_code.post_code') }}
        </label>
      </a-col>
      <a-col :span="10">
        <a-input-number
          v-model:value="postcode"
          :placeholder="$t('common.zip_code.post_code')"
          maxlength="7"
          :min="1"
          class="input-code p-t-5"
          :class="errorPostCode ? 'error-input' : ''"
          @input="getPostCode"
        />

        <div v-if="errorPostCode" class="ant-form-item-explain-error">
          <span>{{ errorPostCode }}</span>
        </div>
      </a-col>
    </a-row>

    <a-row class="row-post-code">
      <a-col :span="5" class="title">
        <label class="">
          {{ $t('common.zip_code.prefecture') }}
        </label>
      </a-col>
      <a-col :span="10">
        <a-input
          :disabled="!prefecture"
          v-model:value="prefecture"
          :placeholder="$t('common.zip_code.prefecture')"
          class="input-code"
        />
      </a-col>
    </a-row>

    <a-row class="row-post-code">
      <a-col :span="5" class="title">
        <label class="">
          {{ $t('common.zip_code.district') }}
        </label>
      </a-col>
      <a-col :span="10">
        <a-input
          :disabled="!city"
          v-model:value="city"
          :placeholder="$t('common.zip_code.district')"
          class="input-code"
        />
      </a-col>
    </a-row>

    <a-row class="row-post-code">
      <a-col :span="5" class="title">
        <label class="">
          {{ $t('common.zip_code.town_name') }}
        </label>
      </a-col>
      <a-col :span="10">
        <a-input
          :disabled="!suburb"
          v-model:value="suburb"
          :placeholder="$t('common.zip_code.town_name')"
          class="input-code"
        />
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.row-post-code {
  height: 70px;
  padding: 10px 0;
  gap: 20px;
  flex-wrap: wrap;
}

.title {
  font-size: 20px;
  color: rgba(55, 71, 79, 0.87);
  font-weight: 400;
}

.form-post-code {
  padding: 20px;
}

.input-code {
  width: 250px;
  height: 40px;
  border-radius: 4px;
  font-size: 16px;
  color: rgba(55, 71, 79, 0.87);
}

.p-t-5 {
  padding-top: 5px;
}

.error-input {
  border-color: #ff4d4f !important;
}
</style>
