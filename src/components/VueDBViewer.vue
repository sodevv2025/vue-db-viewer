<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import type { VueDBViewerConfig, SelectedRow } from '../types'

/**
 * VueDBViewer - 마스터-디테일 패턴의 데이터베이스 뷰어 컴포넌트
 *
 * @example
 * <VueDBViewer
 *   :config="config"
 *   v-model:selected-row="selectedRow"
 *   @row-select="handleRowSelect"
 * />
 */

// Props
interface Props {
  /** 뷰어 설정 */
  config: VueDBViewerConfig
  /** 선택된 행 (v-model) */
  selectedRow?: SelectedRow
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  /** 선택된 행 변경 이벤트 */
  'update:selectedRow': [row: SelectedRow]
  /** 행 선택 이벤트 */
  'row-select': [payload: { row: any; index: number }]
  /** 필터 변경 이벤트 */
  'filter-change': [payload: { filters: Record<string, any> }]
  /** 정렬 변경 이벤트 */
  'sort-change': [payload: { column: string; direction: 'asc' | 'desc' | null }]
  /** 페이지 변경 이벤트 */
  'page-change': [payload: { page: number; pageSize: number }]
}>()

// State
const internalSelectedRow = ref<SelectedRow>(props.selectedRow || null)

// Computed
const layoutConfig = computed(() => ({
  splitRatio: props.config.layout?.splitRatio ?? 0.5,
  minMasterWidth: props.config.layout?.minMasterWidth ?? 400,
  minDetailWidth: props.config.layout?.minDetailWidth ?? 400,
  resizable: props.config.layout?.resizable ?? true,
}))

const hasLeftPanel = computed(() => !!props.config.leftPanel)
const hasDetailPanel = computed(() => !!props.config.detail)

// Methods
const handleRowSelect = (row: any, index: number) => {
  internalSelectedRow.value = row
  emit('update:selectedRow', row)
  emit('row-select', { row, index })
}

// Provide config to child components
provide('vdb-config', props.config)
provide('vdb-selected-row', internalSelectedRow)
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

      <!-- Main Content (Master + Detail) -->
      <div class="vdb-content flex-1 flex overflow-hidden">
        <!-- Master Table Section -->
        <section
          class="vdb-master bg-white border-r border-gray-200 overflow-auto"
          :style="{ width: hasDetailPanel ? `${layoutConfig.splitRatio * 100}%` : '100%' }"
        >
          <div class="p-4">
            <div class="text-xl font-bold mb-4">마스터 테이블</div>
            <div class="text-sm text-gray-500 mb-4">
              데이터소스: {{ typeof config.master.dataSource === 'string' ? config.master.dataSource : '배열' }}
            </div>
            <div class="text-sm text-gray-500">
              컬럼 수: {{ config.master.columns.length }}
            </div>
          </div>
        </section>

        <!-- Resizer (드래그 가능한 구분선) -->
        <div
          v-if="hasDetailPanel && layoutConfig.resizable"
          class="vdb-resizer w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors"
        />

        <!-- Detail Panel Section -->
        <section
          v-if="hasDetailPanel"
          class="vdb-detail bg-white overflow-auto"
          :style="{ width: `${(1 - layoutConfig.splitRatio) * 100}%` }"
        >
          <div class="p-4">
            <div class="text-xl font-bold mb-4">디테일 패널</div>
            <div v-if="!internalSelectedRow" class="text-center py-12 text-gray-400">
              <div class="text-lg mb-2">행을 선택하세요</div>
              <div class="text-sm">마스터 테이블에서 행을 클릭하면 상세 정보가 표시됩니다</div>
            </div>
            <div v-else class="text-sm text-gray-600">
              선택된 행 정보가 여기에 표시됩니다
            </div>
          </div>
        </section>
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
