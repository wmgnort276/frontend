<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/user.store';
import { useAuthStoreHook } from '@/stores/auth.store';

const authStore = useAuthStoreHook();
const userStore = useUserStore();

const rankingColumn = [
  { title: 'Rank', dataIndex: 'rank', key: 'rank' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Score', dataIndex: 'score', key: 'score' }
];

const rankList = computed(() => userStore.listRanking.slice(3));
</script>

<template>
  <h2 class="ranking-title">Superman</h2>
  <div class="top-3">
    <div class="rank-card">
      <img src="./../../../assets/rank_2.png" class="rank-img-2" />
      <span
        class="top-rank-user"
        :class="{ 'is-current-user': userStore.listRanking[1]?.userName == authStore.userName }"
        >{{ userStore.listRanking[1]?.userName }}</span
      >
      <span>score: {{ userStore.listRanking[1]?.score }}</span>
    </div>
    <div class="rank-card">
      <img src="./../../../assets/rank_1.png" class="rank-img-1" />
      <span
        class="top-rank-user"
        :class="{ 'is-current-user': userStore.listRanking[0]?.userName == authStore.userName }"
        >{{ userStore.listRanking[0]?.userName }}</span
      >
      <span>score: {{ userStore.listRanking[0]?.score }}</span>
    </div>
    <div class="rank-card">
      <img src="./../../../assets/rank_3.png" class="rank-img-3" />
      <span
        class="top-rank-user"
        :class="{ 'is-current-user': userStore.listRanking[2]?.userName == authStore.userName }"
        >{{ userStore.listRanking[2]?.userName }}</span
      >
      <span>score: {{ userStore.listRanking[2]?.score }}</span>
    </div>
  </div>
  <div>
    <a-table
      class="ant-table-striped ranking-table"
      size="middle"
      :columns="rankingColumn"
      :data-source="rankList"
      :class="(_record: any, index: any) => (index % 2 === 1 ? 'table-striped' : null)"
      :pagination="{ defaultPageSize: 7 }"
    >
      <template #bodyCell="{ record, column, index }">
        <template v-if="column.key === 'rank'">
          <span>{{ index + 4 }}</span>
        </template>

        <template v-if="column.key === 'name'">
          <span :class="{ 'is-current-user': record.userName == authStore.userName }">{{
            record.userName
          }}</span>
        </template>

        <template v-if="column.key === 'level'">
          <span>{{ record.score }}</span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
.ranking-title {
  color: #b48608;
  font-family: 'Droid serif', serif;
  font-size: 30px;
  font-weight: 400;
  font-style: italic;
  line-height: 44px;
  margin: 0 0 12px;
  text-align: center;
}

.top-3 {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.rank-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s;
}

.rank-card:hover {
  transform: scale(1.1);
}

.rank-img-1 {
  height: 60px;
  width: 60px;
}

.rank-img-2 {
  height: 60px;
  width: 60px;
}

.rank-img-3 {
  height: 60px;
  width: 60px;
}

.top-rank-user {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.is-current-user {
  color: #910f0f;
  font-weight: 500;
}

:deep(.ant-pagination) {
  display: none;
}
</style>
