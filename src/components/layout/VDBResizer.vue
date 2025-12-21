<script setup lang="ts">
/**
 * VDBResizer - 좌우 분할 리사이저 바
 *
 * 마우스 드래그로 좌우 패널의 크기를 조절할 수 있는 구분선 컴포넌트
 *
 * @example
 * <VDBResizer @mousedown="handleMouseDown" />
 */

// Emits
const emit = defineEmits<{
  /** 마우스 다운 이벤트 */
  mousedown: [event: MouseEvent]
}>()

// Methods
const handleMouseDown = (event: MouseEvent) => {
  emit('mousedown', event)
}
</script>

<template>
  <div
    class="vdb-resizer"
    @mousedown="handleMouseDown"
  >
    <div class="vdb-resizer-handle" />
  </div>
</template>

<style scoped>
.vdb-resizer {
  position: relative;
  width: 12px;
  background-color: #e5e7eb;
  cursor: col-resize;
  user-select: none;
  touch-action: none;
  transition: background-color 150ms ease;
  flex-shrink: 0;
}

.vdb-resizer:hover {
  background-color: #9ca3af;
}

.vdb-resizer:active,
.vdb-resizer.dragging {
  background-color: #6b7280;
}

/* 중앙 핸들 표시 (선택사항) */
.vdb-resizer-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  opacity: 0;
  transition: opacity 150ms ease;
}

.vdb-resizer:hover .vdb-resizer-handle {
  opacity: 1;
}
</style>
