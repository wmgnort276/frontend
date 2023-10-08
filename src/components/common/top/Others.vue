<script setup lang="ts">
import FAQ from '@/components/icon/top/others/FAQ.vue';
import Folder from '@/components/icon/top/others/Folder.vue';
import Phone from '@/components/icon/top/others/Phone.vue';
import Comment from '@/components/icon/top/others/Comment.vue';
</script>

<template>
  <div>
    <div class="card">
      <div class="icon-other">
        <Phone></Phone>
      </div>
      <div class="content-other">
        <div class="title-content">
          <span>{{ $t('top.other.inquiry.title') }}</span>
        </div>
        <span class="sub-content">{{ $t('top.other.inquiry.content') }}</span>
      </div>
    </div>

    <div class="card">
      <div class="icon-other faq">
        <FAQ></FAQ>
      </div>
      <div class="content-other">
        <div class="title-content">
          <span>{{ $t('top.other.faq.title') }}</span>
        </div>
        <span class="sub-content">{{ $t('top.other.faq.content') }}</span>
      </div>
    </div>

    <div class="card">
      <div class="icon-other">
        <Comment></Comment>
      </div>
      <div class="content-other">
        <div class="title-content">
          <span>{{ $t('top.other.result_confirmation.title') }}</span>
        </div>
        <span class="sub-content">{{ $t('top.other.result_confirmation.content') }}</span>
      </div>
    </div>

    <div class="card">
      <div class="icon-other">
        <Folder></Folder>
      </div>
      <div class="content-other">
        <div class="title-content">
          <span>{{ $t('top.other.share_file.title') }}</span>
        </div>
        <span class="sub-content">{{ $t('top.other.share_file.content') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  width: 50%;
  float: left;
  padding: 20px;
}

.icon-other {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  background-color: rgba(21, 101, 192, 0.8);
  padding: 25px;
}

.content-other {
  padding: 15px 20px 20px 15px;
}

.title-content {
  font-size: 20px;
  line-height: 30px;
  font-weight: 700;
  color: rgba(38, 50, 56, 0.9);
  margin-bottom: 10px;
}

.sub-content {
  font-weight: 400;
  font-size: 16px;
  line-height: 25px;
  color: rgba(38, 50, 56, 0.9);
}

.faq {
  background-color: rgba(0, 137, 123, 0.8) !important;
}

@media screen and (max-width: 768px) {
  .card {
    width: 100%;
  }
}

@media screen and (max-width: 540px) {
  .card {
    width: 100%;
    padding: 10px;
  }

  .content-other {
    padding: 0 10px;
  }

  .icon-other {
    width: 80px;
    height: 80px;
    padding: 20px;
  }

  svg {
    width: 35px !important;
    height: 35px !important;
  }
}
</style>
