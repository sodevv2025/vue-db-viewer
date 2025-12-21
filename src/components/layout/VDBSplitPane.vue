<script setup lang="ts">
import { ref } from 'vue'
import VDBResizer from './VDBResizer.vue'
import { useSplitPane } from '../../composables/useSplitPane'

/**
 * VDBSplitPane - 좌우 분할 패널 컨테이너
 *
 * 두 개의 패널을 좌우로 배치하고, 리사이저로 크기를 조절할 수 있습니다.
 *
 * @example
 * <VDBSplitPane
 *   :initial-ratio="0.6"
 *   :min-left-width="400"
 *   :min-right-width="400"
 *   :resizable="true"
 * >
 *   <template #left>왼쪽 패널</template>
 *   <template #right>오른쪽 패널</template>
 * </VDBSplitPane>
 */

interface Props {
  /** 초기 분할 비율 (0~1) @default 0.5 */
  initialRatio?: number
  /** 왼쪽 패널 최소 너비(px) @default 400 */
  minLeftWidth?: number
  /** 오른쪽 패널 최소 너비(px) @default 400 */
  minRightWidth?: number
  /** 리사이저 활성화 여부 @default true */
  resizable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialRatio: 0.5,
  minLeftWidth: 400,
  minRightWidth: 400,
  resizable: true,
})

// Container ref
const containerRef = ref<HTMLElement>()

// useSplitPane composable
const { leftWidth, rightWidth, handleMouseDown } = useSplitPane(containerRef, {
  initialRatio: props.initialRatio,
  minLeftWidth: props.minLeftWidth,
  minRightWidth: props.minRightWidth,
  resizable: props.resizable,
})
</script>

<template>
  <div ref="containerRef" class="vdb-split-pane">
    <!-- Left Panel -->
    <div class="vdb-split-pane-left" :style="{ width: leftWidth }">
      <slot name="left" />
    </div>

    <!-- Resizer -->
    <VDBResizer v-if="resizable" @mousedown="handleMouseDown" />

    <!-- Right Panel -->
    <div class="vdb-split-pane-right" :style="{ width: rightWidth }">
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
.vdb-split-pane {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.vdb-split-pane-left,
.vdb-split-pane-right {
  overflow: auto;
  flex-shrink: 0;
}
</style>
