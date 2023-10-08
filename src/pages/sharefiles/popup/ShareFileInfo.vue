<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { ref } from 'vue';
import PageLayout from '@/pages/layouts/PageLayout.vue';

const props = defineProps({
  status: {
    type: Boolean,
    required: true
  }
});

const emits = defineEmits(['cancel']);

let loading = ref<boolean>(false);

const fileDownloadList = ref<string[]>([
  '母子手帳サンプル手帳サンプル手帳サン ンプル手帳サンサン ンプル手帳手帳サン ン.pdf（100 KB）',
  '出産証明書サンプル.pdf（50 KB）',
  '産休申請サンプル.pdf（100 KB）'
]);

const period = ref<string>(' 2023/01/01 ~ 2023/12/31');
const fileDescription = ref<string>(
  '今回は産休・育休の手続きやそれに関連した給付金や社会保険料免除の申請手続きを産休～復職まで一覧にして解説します。れに関連した給付金'
);

const title = ref<string>('産休制度に関する資料');


const handleClose = () => {
  emits('cancel');
};
</script>

<template>
  <a-modal :visible="props.status" centered :footer="null" :closable="false">
    <div class="main-page">
       <!-- Content block -->
    <div class="title-section">
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
            <li class="file-wrap">
              <a-checkbox></a-checkbox>
              <a class="file">{{ file }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Button-->
    <div class="close-btn">
        <a-button type="primary" class="btn-common btn-rounned" @click="handleClose">
            {{ $t('sharefile.history.closeButton') }}
        </a-button>
    </div>
    </div>
  </a-modal>
</template>

<style scoped>
@import './../../../assets/styles/common.css';
@import './../../../assets/styles/page.css';
@import './../../../assets/styles/button.css';

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
  line-height: 40px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.87);
  margin-bottom: 20px;
}

.history-table {
  margin-left: 20px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.5px;
  text-align: left;
  margin-bottom: 20px;
}

.hr-style {
  opacity: 0.25;
  margin-bottom: 15px;
}

.description {
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.5px;
  margin: 20px 0;
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

.list-file-wrap {
  flex: 20;
}

.list-file-download {
  list-style-type: none;
  margin-left: 30px;
}

.file-wrap {
    display: flex;
    gap: 10px;
}

.close-btn {
  align-items: center;
  justify-content: center;
  display: flex;
  margin-top: 30px;
}

</style>

<style>
.ant-modal {
  min-width: 700px !important;
}
</style>
