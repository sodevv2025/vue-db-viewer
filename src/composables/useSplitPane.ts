import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'

/**
 * useSplitPane - 좌우 분할 패널 관리 Composable
 *
 * @param containerRef - 컨테이너 요소 ref
 * @param options - 분할 옵션
 * @returns 분할 패널 상태 및 메서드
 *
 * @example
 * const containerRef = ref<HTMLElement>()
 * const { splitRatio, handleMouseDown } = useSplitPane(containerRef, {
 *   initialRatio: 0.5,
 *   minLeftWidth: 400,
 *   minRightWidth: 400
 * })
 */
export function useSplitPane(
  containerRef: Ref<HTMLElement | undefined>,
  options: {
    /** 초기 분할 비율 (0~1) @default 0.5 */
    initialRatio?: number
    /** 왼쪽 패널 최소 너비(px) @default 400 */
    minLeftWidth?: number
    /** 오른쪽 패널 최소 너비(px) @default 400 */
    minRightWidth?: number
    /** 리사이저 활성화 여부 @default true */
    resizable?: boolean
  } = {}
) {
  const {
    initialRatio = 0.5,
    minLeftWidth = 400,
    minRightWidth = 400,
    resizable = true,
  } = options

  // State
  const splitRatio = ref(initialRatio)
  const isDragging = ref(false)

  // Computed
  const leftWidth = computed(() => `${splitRatio.value * 100}%`)
  const rightWidth = computed(() => `${(1 - splitRatio.value) * 100}%`)

  // 드래그 시작
  const handleMouseDown = (event: MouseEvent) => {
    if (!resizable || !containerRef.value) return

    event.preventDefault()
    isDragging.value = true

    // 마우스 커서 변경
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  // 드래그 중
  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging.value || !containerRef.value) return

    const container = containerRef.value
    const containerRect = container.getBoundingClientRect()
    const containerWidth = containerRect.width

    // 마우스 위치를 기준으로 새로운 분할 비율 계산
    const mouseX = event.clientX - containerRect.left
    let newRatio = mouseX / containerWidth

    // 최소/최대 너비 제한 적용
    const minLeftRatio = minLeftWidth / containerWidth
    const maxLeftRatio = 1 - minRightWidth / containerWidth

    newRatio = Math.max(minLeftRatio, Math.min(maxLeftRatio, newRatio))

    splitRatio.value = newRatio
  }

  // 드래그 종료
  const handleMouseUp = () => {
    if (!isDragging.value) return

    isDragging.value = false

    // 마우스 커서 복원
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  // 이벤트 리스너 등록
  onMounted(() => {
    if (resizable) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
  })

  // 이벤트 리스너 제거
  onUnmounted(() => {
    if (resizable) {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  })

  return {
    /** 현재 분할 비율 (0~1) */
    splitRatio,
    /** 드래그 중 여부 */
    isDragging,
    /** 왼쪽 패널 너비 (%) */
    leftWidth,
    /** 오른쪽 패널 너비 (%) */
    rightWidth,
    /** 리사이저 마우스다운 핸들러 */
    handleMouseDown,
  }
}
