<script setup lang="ts">
import { computed, provide } from 'vue'
import { useMasterStore } from '../stores/useMasterStore'
import VDBSplitPane from './layout/VDBSplitPane.vue'
import VDBMasterTable from './table/VDBMasterTable.vue'
import type { VueDBViewerConfig } from '../types'

/**
 * VueDBViewer - 마스터-디테일 패턴의 데이터베이스 뷰어 컴포넌트
 *
 * Pinia store를 사용하여 상태를 중앙 관리합니다.
 *
 * @example
 * <VueDBViewer :config="config" />
 */

// Props
interface Props {
  /** 뷰어 설정 */
  config: VueDBViewerConfig
}

const props = defineProps<Props>()

// Store
const masterStore = useMasterStore()

// Computed

const layoutConfig = computed(() => ({
  splitRatio: props.config.layout?.splitRatio ?? 0.5,
  minMasterWidth: props.config.layout?.minMasterWidth ?? 400,
  minDetailWidth: props.config.layout?.minDetailWidth ?? 400,
  resizable: props.config.layout?.resizable ?? true,
}))

const hasLeftPanel = computed(() => !!props.config.leftPanel)
const hasDetailPanel = computed(() => !!props.config.detail)

// Provide config and store to child components
provide('vdb-config', props.config)
provide('vdb-selected-row', masterStore.selectedRow)
</script>

<template>
  <div class="vdb-viewer flex flex-col h-screen bg-gray-50">
    <!-- Header Slot -->
    <header v-if="$slots.header" class="vdb-header bg-white border-b border-gray-200">
      <slot name="header" />
    </header>

    <!-- Main Content Area -->
    <main class="vdb-main flex-1 flex overflow-hidden">
      <!-- Left Panel (Filters/Search) -->
      <aside
        v-if="hasLeftPanel"
        class="vdb-left-panel bg-white border-r border-gray-200 flex-shrink-0"
        :style="{ width: `${config.leftPanel?.width ?? 280}px` }"
      >
        <div class="p-4">
          <div class="text-lg font-semibold mb-4">왼쪽 패널</div>
          <div class="text-sm text-gray-500">검색 및 필터 영역</div>
        </div>
      </aside>

      <!-- Main Content (Master + Detail) with SplitPane -->
      <div class="vdb-content flex-1 overflow-hidden">
        <!-- Master only (no detail panel) -->
        <section
          v-if="!hasDetailPanel"
          class="vdb-master h-full"
        >
          <VDBMasterTable :config="config.master" />
        </section>

        <!-- Master + Detail with SplitPane -->
        <VDBSplitPane
          v-else
          :initial-ratio="layoutConfig.splitRatio"
          :min-left-width="layoutConfig.minMasterWidth"
          :min-right-width="layoutConfig.minDetailWidth"
          :resizable="layoutConfig.resizable"
        >
          <!-- Master Table -->
          <template #left>
            <section class="vdb-master h-full">
              <VDBMasterTable :config="config.master" />
            </section>
          </template>

          <!-- Detail Panel -->
          <template #right>
            <section class="vdb-detail bg-white h-full">
              <div class="p-4">
                <div class="text-xl font-bold mb-4">디테일 패널</div>
                <div v-if="!masterStore.selectedRow" class="text-center py-12 text-gray-400">
                  <div class="text-lg mb-2">행을 선택하세요</div>
                  <div class="text-sm">마스터 테이블에서 행을 클릭하면 상세 정보가 표시됩니다</div>
                </div>
                <div v-else class="text-sm text-gray-600">
                  선택된 행 정보가 여기에 표시됩니다
                </div>
              </div>
            </section>
          </template>
        </VDBSplitPane>
      </div>
    </main>

    <!-- Footer Slot -->
    <footer v-if="$slots.footer" class="vdb-footer bg-white border-t border-gray-200">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.vdb-viewer {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.vdb-resizer {
  user-select: none;
  touch-action: none;
}

.vdb-resizer:active {
  background-color: #3b82f6;
}
</style>
