<script setup lang="ts">
import { ref } from 'vue';
import LeftOutlined from '@/components/icon/LeftOutlined.vue';
import TitleTag from '@/components/common/TitleTag.vue';
import router from '@/router';

const fileDownloadList = ref<string[]>([
  '母子手帳サンプル.pdf（100 KB）',
  '出産証明書サンプル.pdf（50 KB）',
  '産休申請サンプル.pdf（100 KB）'
]);

const period = ref<string>(' 2023/01/01 ~ 2023/12/31');
const fileDescription = ref<string>(
  '今回は産休・育休の手続きやそれに関連した給付金や社会保険料免除の申請手続きを産休～復職まで一覧にして解説します。れに関連した給付金'
);

const title = ref<string>('産休制度に関する資料');

const navigatorTop = () => {
  router.push('/top');
};
</script>

<template>
  <div class="main-page">
    <!-- Navigation section -->
    <div class="navigation">
      <a-button class="return-button" type="text" @click="navigatorTop">
        <left-outlined />
        <div class="ml-21 d-inline-block">
          {{ $t('sharefile.backtoTop') }}
        </div>
      </a-button>

      <div class="navigation-btn-group">
        <a-button type="primary" class="btn-common btn-rounned">
          {{ $t('sharefile.download.copyLink') }}
        </a-button>
        <router-link to="/sharefiles/edit">
          <a-button type="primary" class="btn-common btn-rounned">
            {{ $t('sharefile.button.edit') }}
          </a-button>
        </router-link>
      </div>
    </div>

    <div class="main-title page-title">{{ $t('sharefile.download.pageTitle') }}</div>

    <!-- Content block -->
    <div class="card title-section">
      <div class="title">{{ title }}</div>

      <hr class="hr-style" />

      <div class="description">
        <span>{{ fileDescription }}</span>
      </div>
      <hr class="hr-style" />

      <!-- file attachment -->
      <div class="list-files">
        <div class="lbl-list-file">
          <TitleTag class="tag-default">{{ $t('sharefile.fileTag') }}</TitleTag>
        </div>

        <!-- list file -->
        <div class="list-file-wrap">
          <ul class="list-file-download" v-for="(file, index) in fileDownloadList" :key="index">
            <li>
              <a-checkbox class="file-download"></a-checkbox><a class="file">{{ file }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="container position-relative">
      <div class="page-top">
        <div class="page-nav">
          <router-link to="">
            <a-button type="primary" class="btn-common btn-rounned">
              {{ $t('sharefile.button.download') }}
            </a-button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './../../assets/styles/common.css';
@import './../../assets/styles/page.css';
@import './../../assets/styles/button.css';
.main-page {
  max-width: 1120px;
  margin: auto;
}

.btn-return-top {
  color: #37474f;
  font-size: 24px;
}

.page-top {
  padding-right: 0;
}

.period-span {
  color: #eb3535;
}

.main-title {
  margin: 35px 0px !important;
}

.hr-style {
  opacity: 0.25;
  margin-bottom: 15px;
}

.list-files {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.page-title {
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 40px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.87);
  margin: 10px 0px;
}

.file {
  text-decoration: underline;
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.5px;
  text-align: left;
}

.card > ::v-deep(.ant-row) {
  margin-bottom: 10px;
}
.card {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px 50px;
  margin-bottom: 20px;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14),
    0px 1px 5px rgba(0, 0, 0, 0.12);
}
.section-header {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.87);
  margin-bottom: 30px;
}
.title {
  font-size: 24px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.5px;
  text-align: left;
  margin-bottom: 20px;
}

.description {
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.5px;
  margin: 20px 0;
}

.card ::v-deep(.ant-form-item) {
  width: 100%;
  margin: 0;
}

.card ::v-deep(.ant-input-number-lg) {
  border-radius: 5px;
  overflow: hidden;
}

.list-file-download {
  list-style-type: none;
  margin-left: 30px;
}

.lbl-list-file {
  font-weight: 700;
  flex: 3;
}

.list-file-wrap {
  flex: 20;
}

.file-download {
  margin: 0 10px;
}
</style>
