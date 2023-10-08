<script setup lang="ts"></script>

<template>
  <div class="featured-keywords">
    <div class="fs-24">
      {{ $t('faq.form.label.featuredKeyword') }}
    </div>
    <div class="keyword-contents">
      <div class="keyword">
        {{ $t('faq.form.featuredKeyword.identityVerification') }}
      </div>
      <div class="keyword">
        {{ $t('faq.form.featuredKeyword.transferAccount') }}
      </div>
      <div class="keyword">
        {{ $t('faq.form.featuredKeyword.consentForm') }}
      </div>
      <div class="keyword">
        {{ $t('faq.form.featuredKeyword.addressChange') }}
      </div>
      <div class="keyword">
        {{ $t('faq.form.featuredKeyword.longTerm') }}
      </div>
      <div class="keyword">
        {{ $t('faq.form.featuredKeyword.handbook') }}
      </div>

      <div class="keyword">
        {{ $t('faq.form.featuredKeyword.yearEndAdjustment') }}
      </div>
      <div class="keyword">
        {{ $t('faq.form.featuredKeyword.socialInsurance') }}
      </div>
      <div class="keyword">
        {{ $t('faq.form.featuredKeyword.healthInsurance') }}
      </div>
      <div class="keyword">
        {{ $t('faq.form.featuredKeyword.employmentInsurance') }}
      </div>
      <div class="keyword">
        {{ $t('faq.form.featuredKeyword.childcareBenefit') }}
      </div>
      <div class="keyword">
        {{ $t('faq.form.featuredKeyword.resignationLetter') }}
      </div>
      <div class="keyword">
        {{ $t('faq.form.featuredKeyword.dependentNotification') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.keyword {
  color: #1976d2;
  min-width: 100px;
  max-width: 200px;
  border-radius: 4px;
  text-align: center;
  padding: 6px;
  margin: 0 10px 15px;
  font-size: 18px;
  border: 1px solid #1976d2;
  float: left;
  height: 2.5rem;
  cursor: pointer;
}

.keyword-contents {
  padding-top: 25px;
  padding-bottom: 0 !important;
}
</style>
