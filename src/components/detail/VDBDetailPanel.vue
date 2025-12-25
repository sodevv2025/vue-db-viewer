<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMasterStore } from '../../stores/useMasterStore';
import VDBDetailTabs from './VDBDetailTabs.vue';

const masterStore = useMasterStore()
const { selectedRow } = storeToRefs(masterStore)
</script>

<template>
  <div class="vdb-detail-panel">
    <div v-if="!selectedRow" class="empty-state">
      <div class="text-lg mb-2">행을 선택하세요.</div>
      <div class="text-sm">마스터 테이블에서 행을 클릭하면 상세 정보가 표시됩니다</div>
    </div>
    <div v-else class="p-4">
      <VDBDetailTabs />
    </div>
  </div>
</template>

<style scoped>
.vdb-detail-panel {
  height: 100%;
}
.empty-state {
  text-align: center;
  padding: 48px;
  color: #9ca3af;
}
</style>