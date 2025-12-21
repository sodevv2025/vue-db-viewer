<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMasterStore } from '../../stores/useMasterStore'
import type { MasterConfig } from '../../types'

/**
 * VDBMasterTable - 마스터 테이블 컴포넌트
 *
 * Element Plus el-table을 사용하여 데이터를 렌더링하고 행 선택 기능을 제공합니다.
 * Pinia store를 사용하여 상태를 관리합니다.
 *
 * @example
 * <VDBMasterTable :config="masterConfig" />
 */

interface Props {
  /** 마스터 테이블 설정 */
  config: MasterConfig
}

const props = defineProps<Props>()

// Store
const masterStore = useMasterStore()

// State
const tableRef = ref()

// Computed
const isSingleSelection = computed(() => props.config.selectionMode === 'single')

// Methods
const handleRowClick = (row: any, column: any, event: Event) => {
  if (!isSingleSelection.value) return

  const index = masterStore.sortedData.findIndex((item: any) => item[props.config.rowKey] === row[props.config.rowKey])
  masterStore.selectRow(row, index)
}

const handleSelectionChange = (selection: any[]) => {
  if (isSingleSelection.value) return

  // Multiple selection
  if (selection.length > 0) {
    const lastSelected = selection[selection.length - 1]
    const index = masterStore.sortedData.findIndex(
      (item: any) => item[props.config.rowKey] === lastSelected[props.config.rowKey]
    )
    masterStore.selectRow(lastSelected, index)
  }
}

const handleSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
  let direction: 'asc' | 'desc' | null = null
  if (order === 'ascending') direction = 'asc'
  else if (order === 'descending') direction = 'desc'

  masterStore.setSort(prop, direction)
}

// Row class for highlighting selected row
const tableRowClassName = ({ row }: { row: any }) => {
  if (isSingleSelection.value && masterStore.selectedRow) {
    return row[props.config.rowKey] === masterStore.selectedRow[props.config.rowKey]
      ? 'selected-row'
      : ''
  }
  return ''
}
</script>

<template>
  <div class="vdb-master-table h-full flex flex-col">
    <!-- Table Container -->
    <div class="flex-1 overflow-auto">
      <el-table
        ref="tableRef"
        :data="masterStore.sortedData"
        :row-key="config.rowKey"
        :row-class-name="tableRowClassName"
        :height="'100%'"
        :stripe="true"
        :highlight-current-row="isSingleSelection"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        v-loading="masterStore.isLoading"
      >
        <!-- Selection Column (Multiple) -->
        <el-table-column
          v-if="!isSingleSelection"
          type="selection"
          width="55"
          align="center"
        />

        <!-- Data Columns -->
        <el-table-column
          v-for="column in config.columns"
          :key="column.key"
          :prop="column.key"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align || 'left'"
          :sortable="column.sortable ? 'custom' : false"
        >
          <template #default="{ row }">
            {{ row[column.key] }}
          </template>
        </el-table-column>

        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-12 text-gray-400">
            <div class="text-lg mb-2">데이터가 없습니다</div>
            <div class="text-sm">표시할 데이터가 없습니다</div>
          </div>
        </template>
      </el-table>
    </div>

    <!-- Pagination (if enabled) -->
    <div v-if="config.pagination" class="border-t border-gray-200 px-4 py-3 bg-white">
      <el-pagination
        :current-page="1"
        :page-size="config.pagination.pageSize"
        :page-sizes="config.pagination.pageSizes"
        :total="masterStore.sortedData.length"
        layout="total, sizes, prev, pager, next, jumper"
        class="justify-end"
      />
    </div>
  </div>
</template>

<style scoped>
.vdb-master-table {
  background: white;
}

/* Selected row highlight */
:deep(.selected-row) {
  background-color: #ecfdf5 !important;
}

:deep(.selected-row:hover > td) {
  background-color: #d1fae5 !important;
}

/* Element Plus table customization */
:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table__header th) {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
}

:deep(.el-table__row:hover > td) {
  background-color: #f3f4f6;
}

:deep(.el-pagination) {
  display: flex;
  justify-content: flex-end;
}
</style>
