<script lang="ts">
import { defineComponent, ref } from 'vue';
import TagSquare from '@/components/icon/top/tags/TagSquare.vue';
import TagUserMail from '@/components/icon/top/tags/TagUserMail.vue';
import TagTextNote from '@/components/icon/top/tags/TagTextNote.vue';
import TagDoor from '@/components/icon/top/tags/TagDoor.vue';
import TagNote from '@/components/icon/top/tags/TagNote.vue';
import TagFolderUser from '@/components/icon/top/tags/TagFolderUser.vue';
import TagPhonePlus from '@/components/icon/top/tags/TagPhonePlus.vue';
import TagChats from '@/components/icon/top/tags/TagChats.vue';
import TagMailSent from '@/components/icon/top/tags/TagMailSent.vue';

export default defineComponent({
  components: {
    TagMailSent,
    TagChats,
    TagPhonePlus,
    TagFolderUser,
    TagTextNote,
    TagNote,
    TagDoor,
    TagSquare,
    TagUserMail
  },
  setup() {
    return {
      activeKey: ref('1')
    };
  }
});
</script>

<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1">
      <template #tab>
        <div class="tab-title">
          <TagUserMail></TagUserMail>
          <span class="tab-content">{{ $t('top.card.request_notification') }}</span>
        </div>
      </template>
      <a-row class="jus-center">
        <div class="card">
          <a-row class="h-270">
            <div class="card-left">
              <div class="icon-card">
                <TagDoor></TagDoor>
              </div>
            </div>
            <div class="card-right">
              <div class="card-content">
                <div class="title-card">
                  {{ $t('top.card.health_insurance_related.title') }}
                </div>
                <div class="content-card">
                  <ul>
                    <li>{{ $t('top.card.health_insurance_related.content_1') }}</li>
                    <li>{{ $t('top.card.health_insurance_related.content_2') }}</li>
                    <li>{{ $t('top.card.health_insurance_related.content_3') }}</li>
                    <li>{{ $t('top.card.health_insurance_related.content_4') }}</li>
                    <li>{{ $t('top.card.health_insurance_related.content_5') }}</li>
                    <li>{{ $t('top.card.health_insurance_related.content_6') }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </a-row>
        </div>
        <div class="card">
          <a-row class="h-270">
            <div class="card-left">
              <div class="icon-card">
                <TagNote></TagNote>
              </div>
            </div>
            <div class="card-right">
              <div class="card-content">
                <div class="title-card">
                  {{ $t('top.card.confirmation_of_issuance.title') }}
                </div>
                <div class="content-card">
                  <ul>
                    <li class="title-content">
                      {{ $t('top.card.confirmation_of_issuance.content_1') }}
                    </li>
                    <li>{{ $t('top.card.confirmation_of_issuance.content_2') }}</li>
                    <li>{{ $t('top.card.confirmation_of_issuance.content_3') }}</li>
                    <li class="title-content">
                      {{ $t('top.card.confirmation_of_issuance.content_4') }}
                    </li>
                    <li>{{ $t('top.card.confirmation_of_issuance.content_5') }}</li>
                    <li class="title-content">
                      {{ $t('top.card.confirmation_of_issuance.content_6') }}
                    </li>
                    <li>{{ $t('top.card.confirmation_of_issuance.content_7') }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </a-row>
        </div>
      </a-row>
      <a-row class="jus-center">
        <div class="card">
          <a-row class="h-160">
            <div class="card-left">
              <div class="icon-card">
                <TagTextNote></TagTextNote>
              </div>
            </div>
            <div class="card-right">
              <div class="card-content">
                <div class="title-card">
                  {{ $t('top.card.childcare_benefit_extension.title') }}
                </div>
                <div class="content-card">
                  <ul>
                    <li>{{ $t('top.card.childcare_benefit_extension.content_1') }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </a-row>
        </div>
      </a-row>
    </a-tab-pane>

    <a-tab-pane key="2">
      <template #tab>
        <div class="tab-title">
          <TagSquare></TagSquare>
          <span class="tab-content">{{ $t('top.card.guidance_notification') }}</span>
        </div>
      </template>

      <a-row class="jus-center">
        <div class="card">
          <a-row class="h-270">
            <div class="card-left">
              <div class="icon-card">
                <TagMailSent></TagMailSent>
              </div>
            </div>
            <div class="card-right">
              <div class="card-content">
                <div class="title-card">
                  {{ $t('top.card.health_insurance_related.title') }}
                </div>
                <div class="content-card">
                  <ul>
                    <li>{{ $t('top.card.health_insurance_related.content_1') }}</li>
                    <li>{{ $t('top.card.health_insurance_related.content_2') }}</li>
                    <li>{{ $t('top.card.health_insurance_related.content_3') }}</li>
                    <li>{{ $t('top.card.health_insurance_related.content_4') }}</li>
                    <li>{{ $t('top.card.health_insurance_related.content_5') }}</li>
                    <li>{{ $t('top.card.health_insurance_related.content_6') }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </a-row>
        </div>

        <div class="card">
          <a-row class="h-270">
            <div class="card-left">
              <div class="icon-card">
                <TagNote></TagNote>
              </div>
            </div>
            <div class="card-right">
              <div class="card-content">
                <div class="title-card">
                  {{ $t('top.card.confirmation_of_issuance.title') }}
                </div>
                <div class="content-card">
                  <ul>
                    <li class="title-content">
                      {{ $t('top.card.confirmation_of_issuance.content_1') }}
                    </li>
                    <li>{{ $t('top.card.confirmation_of_issuance.content_2') }}</li>
                    <li>{{ $t('top.card.confirmation_of_issuance.content_3') }}</li>
                    <li class="title-content">
                      {{ $t('top.card.confirmation_of_issuance.content_4') }}
                    </li>
                    <li>{{ $t('top.card.confirmation_of_issuance.content_5') }}</li>
                    <li class="title-content">
                      {{ $t('top.card.confirmation_of_issuance.content_6') }}
                    </li>
                    <li>{{ $t('top.card.confirmation_of_issuance.content_7') }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </a-row>
        </div>
      </a-row>

      <a-row class="jus-center">
        <div class="card">
          <a-row class="h-160">
            <div class="card-left">
              <div class="icon-card">
                <TagChats></TagChats>
              </div>
            </div>
            <div class="card-right">
              <div class="card-content">
                <div class="title-card">
                  {{ $t('top.card.request_submit_insufficient_employment_insurance.title') }}
                </div>
                <div class="content-card"></div>
              </div>
            </div>
          </a-row>
        </div>

        <div class="card">
          <a-row class="h-160">
            <div class="card-left">
              <div class="icon-card">
                <TagPhonePlus></TagPhonePlus>
              </div>
            </div>
            <div class="card-right">
              <div class="card-content">
                <div class="title-card">
                  {{ $t('top.card.request_submit_insufficient_social_insurance.title') }}
                </div>
                <div class="content-card"></div>
              </div>
            </div>
          </a-row>
        </div>
      </a-row>

      <a-row class="jus-center">
        <div class="card">
          <a-row class="h-270">
            <div class="card-left">
              <div class="icon-card">
                <TagFolderUser></TagFolderUser>
              </div>
            </div>
            <div class="card-right">
              <div class="card-content">
                <div class="title-card">
                  {{ $t('top.card.employment_insurance_issued.title') }}
                </div>
                <div class="content-card">
                  <ul>
                    <li class="title-content">
                      {{ $t('top.card.employment_insurance_issued.content_1') }}
                    </li>
                    <li>{{ $t('top.card.employment_insurance_issued.content_2') }}</li>
                    <li>{{ $t('top.card.employment_insurance_issued.content_3') }}</li>
                    <li>{{ $t('top.card.employment_insurance_issued.content_4') }}</li>
                    <li>{{ $t('top.card.employment_insurance_issued.content_5') }}</li>
                    <li>{{ $t('top.card.employment_insurance_issued.content_6') }}</li>
                    <li>{{ $t('top.card.employment_insurance_issued.content_7') }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </a-row>
        </div>
      </a-row>
    </a-tab-pane>
  </a-tabs>
</template>

<style scoped>
.tab-title {
  font-size: 20px;
  line-height: 25px;
  font-weight: 700;
}

.tab-content {
  margin-left: 10px;
  color: rgba(0, 0, 0, 0.3);
}

.h-270 {
  height: 270px;
}

.h-160 {
  height: 160px;
}

.card {
  margin: 20px 25px 20px 20px;
  border-radius: 4px;
  border: 4px solid rgba(21, 101, 192, 0.8);
}

.card-left {
  background-color: rgba(21, 101, 192, 0.8);
  padding: 15px;
}

.content-card {
  padding: 15px 15px 7px 20px;
  font-size: 17px;
  line-height: 25px;
  color: rgba(38, 50, 56, 0.9);
}

.card-content {
  padding: 15px 15px 0 15px;
  width: 325px;
}

.title-card {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  font-weight: 700;
  font-size: 22px;
  line-height: 30px;
  padding-bottom: 10px;
  color: rgba(38, 50, 56, 0.9);
}

.title-content {
  list-style-type: none;
  margin-left: -20px;
}

.icon-card {
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: rgba(255, 255, 255, 0.85);
  padding: 17px;
}

::v-deep(.ant-tabs-nav-wrap) {
  justify-content: center;
}

::v-deep(.ant-tabs-tab-active) path {
  fill: rgba(21, 101, 192, 1) !important;
}

::v-deep(.ant-tabs-tab-active) span {
  color: rgba(21, 101, 192, 1) !important;
}

@media only screen and (max-width: 1111px) {
  .jus-center {
    justify-content: center;
  }
}
</style>
