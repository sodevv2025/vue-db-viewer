<script setup lang="ts">
/**
 * VDBSplitPane.vue - 좌우 분할 패널 컨테이너 컴포넌트
 *
 * 이 컴포넌트는 화면을 좌우 두 영역으로 나누고,
 * 중간에 드래그 가능한 리사이저를 제공합니다.
 *
 * 역할:
 * - 마스터 테이블(왼쪽)과 디테일 패널(오른쪽) 배치
 * - 사용자가 리사이저를 드래그하여 비율 조절
 * - 최소 너비 제한으로 사용성 보장
 *
 * 구조:
 * ┌──────────────┬─┬──────────────┐
 * │   Left       │R│   Right      │
 * │   Panel      │E│   Panel      │
 * │              │S│              │
 * │              │I│              │
 * │              │Z│              │
 * │              │E│              │
 * │              │R│              │
 * └──────────────┴─┴──────────────┘
 */

// ref: DOM 요소 참조를 위한 Vue 함수
// - 템플릿의 ref="containerRef"와 연결
// - 실제 DOM 엘리먼트에 접근 가능
import { ref } from 'vue'

// VDBResizer: 드래그 가능한 리사이저 바 컴포넌트
// - 좌우 패널 사이에 표시
// - 마우스다운 이벤트를 emit
import VDBResizer from './VDBResizer.vue'

// useSplitPane: 분할 패널의 로직을 담은 composable
// - 리사이징 계산
// - 너비 관리
// - 이벤트 처리
import { useSplitPane } from '../../composables/useSplitPane'

/**
 * Props 인터페이스 정의
 *
 * 이 컴포넌트가 부모로부터 받을 수 있는 props를 정의합니다.
 * 모든 props는 선택사항(?)이며 기본값이 있습니다.
 */
interface Props {
  /**
   * initialRatio - 초기 분할 비율
   *
   * 타입: number (0~1 사이의 소수)
   * 기본값: 0.5
   *
   * 의미:
   * - 컴포넌트가 처음 렌더링될 때의 좌우 비율
   * - 0.5 = 50:50 (반반)
   * - 0.6 = 왼쪽 60%, 오른쪽 40%
   *
   * 주의:
   * - 0보다 작거나 1보다 크면 안 됨
   * - 실제로는 minLeftWidth, minRightWidth에 의해 제한될 수 있음
   *
   * @default 0.5
   */
  initialRatio?: number

  /**
   * minLeftWidth - 왼쪽 패널의 최소 너비
   *
   * 타입: number (픽셀 단위)
   * 기본값: 400
   *
   * 의미:
   * - 왼쪽 패널이 이보다 좁아질 수 없음
   * - 리사이저를 왼쪽으로 드래그해도 이 너비에서 멈춤
   *
   * 왜 필요?
   * - 마스터 테이블이 너무 좁으면 사용 불가
   * - 최소한의 가독성 보장
   *
   * @default 400
   */
  minLeftWidth?: number

  /**
   * minRightWidth - 오른쪽 패널의 최소 너비
   *
   * 타입: number (픽셀 단위)
   * 기본값: 400
   *
   * 의미:
   * - 오른쪽 패널이 이보다 좁아질 수 없음
   * - 리사이저를 오른쪽으로 드래그해도 이 너비에서 멈춤
   *
   * 왜 필요?
   * - 디테일 패널의 내용을 읽기 위한 최소 공간
   * - 폼 필드들이 제대로 표시되도록 보장
   *
   * @default 400
   */
  minRightWidth?: number

  /**
   * resizable - 리사이저 활성화 여부
   *
   * 타입: boolean
   * 기본값: true
   *
   * 의미:
   * - true: 리사이저 바가 표시되고 드래그 가능
   * - false: 리사이저 없음, 고정 비율
   *
   * 용도:
   * - 사용자에게 조절 권한을 줄지 말지 결정
   * - 고정 레이아웃이 필요한 경우 false
   *
   * @default true
   */
  resizable?: boolean
}

/**
 * Props 정의 및 기본값 설정
 *
 * withDefaults():
 * - defineProps()와 함께 사용
 * - TypeScript에서 기본값을 설정하는 방법
 *
 * 작동 방식:
 * - 부모가 값을 전달하지 않으면 기본값 사용
 * - 부모가 값을 전달하면 전달된 값 사용
 *
 * 예:
 * <VDBSplitPane :initial-ratio="0.6" />
 * → props.initialRatio = 0.6
 * → props.minLeftWidth = 400 (기본값)
 * → props.minRightWidth = 400 (기본값)
 * → props.resizable = true (기본값)
 */
const props = withDefaults(defineProps<Props>(), {
  initialRatio: 0.5,
  minLeftWidth: 400,
  minRightWidth: 400,
  resizable: true,
})

/**
 * containerRef - 컨테이너 DOM 요소 참조
 *
 * ref<HTMLElement>():
 * - 타입: HTMLElement | undefined
 * - 초기값: undefined (마운트 전)
 * - 마운트 후: 실제 DOM 엘리먼트
 *
 * 사용 목적:
 * - useSplitPane에 전달하여 컨테이너 크기 계산
 * - getBoundingClientRect()로 너비 측정
 *
 * 연결:
 * - 템플릿의 ref="containerRef"와 자동 연결
 * - Vue가 마운트 시 DOM 요소를 할당
 */
const containerRef = ref<HTMLElement>()

/**
 * useSplitPane composable 사용
 *
 * 전달 인자:
 * 1. containerRef: 컨테이너 DOM 참조
 * 2. options: 설정 객체
 *
 * 반환값:
 * - leftWidth: 왼쪽 패널 너비 (computed, "%"로 반환)
 * - rightWidth: 오른쪽 패널 너비 (computed, "%"로 반환)
 * - handleMouseDown: 리사이저 mousedown 핸들러
 *
 * 동작:
 * 1. props의 값들을 composable에 전달
 * 2. composable이 내부적으로 계산 및 이벤트 처리
 * 3. 반응형 너비 값들을 반환
 * 4. 템플릿에서 이 값들을 스타일로 사용
 */
const { leftWidth, rightWidth, handleMouseDown } = useSplitPane(containerRef, {
  // initialRatio: 초기 분할 비율
  // props.initialRatio → composable로 전달
  initialRatio: props.initialRatio,

  // minLeftWidth: 왼쪽 최소 너비
  // props.minLeftWidth → composable로 전달
  minLeftWidth: props.minLeftWidth,

  // minRightWidth: 오른쪽 최소 너비
  // props.minRightWidth → composable로 전달
  minRightWidth: props.minRightWidth,

  // resizable: 리사이저 활성화 여부
  // props.resizable → composable로 전달
  resizable: props.resizable,
})

/**
 * 데이터 흐름 요약:
 *
 * 1. 부모 컴포넌트
 *    ↓ props 전달
 * 2. VDBSplitPane (이 컴포넌트)
 *    ↓ props → useSplitPane에 전달
 * 3. useSplitPane composable
 *    - 내부 계산 (ref, computed)
 *    - 이벤트 처리 (mousedown, mousemove, mouseup)
 *    ↓ 반환 (leftWidth, rightWidth, handleMouseDown)
 * 4. 템플릿
 *    - :style="{ width: leftWidth }"로 너비 적용
 *    - @mousedown="handleMouseDown"로 이벤트 연결
 */
</script>

<template>
  <!--
    컨테이너 div

    ref="containerRef":
    - script의 containerRef 변수와 연결
    - 마운트 후 이 DOM 요소가 containerRef.value에 할당
    - useSplitPane이 이 요소의 크기를 측정

    class="vdb-split-pane":
    - CSS 스타일 적용
    - display: flex (자식들을 가로로 배치)
    - width: 100% (부모의 전체 너비 사용)
    - height: 100% (부모의 전체 높이 사용)
  -->
  <div ref="containerRef" class="vdb-split-pane">
    <!--
      왼쪽 패널

      class="vdb-split-pane-left":
      - 왼쪽 패널 스타일 적용
      - overflow: auto (내용이 넘치면 스크롤)
      - flex-shrink: 0 (축소 안 됨, 고정 너비 유지)

      :style="{ width: leftWidth }":
      - 동적 스타일 바인딩
      - leftWidth는 computed 값 (예: "60%")
      - useSplitPane이 계산한 너비를 적용
      - 리사이저 드래그 시 자동으로 업데이트됨

      동작:
      - 초기: width: "50%" (initialRatio 0.5)
      - 드래그 후: width: "65%" (사용자가 조절)
    -->
    <div class="vdb-split-pane-left" :style="{ width: leftWidth }">
      <!--
        left 슬롯

        부모 컴포넌트에서 제공한 왼쪽 패널 내용이 여기 렌더링됩니다.

        부모에서:
        <VDBSplitPane>
          <template #left>
            <VDBMasterTable />
          </template>
        </VDBSplitPane>

        결과:
        <div class="vdb-split-pane-left">
          <VDBMasterTable />
        </div>
      -->
      <slot name="left" />
    </div>

    <!--
      리사이저 (조건부 렌더링)

      v-if="resizable":
      - resizable props가 true일 때만 렌더링
      - false면 리사이저가 아예 표시되지 않음
      - 고정 레이아웃인 경우 불필요

      VDBResizer:
      - 드래그 가능한 리사이저 바 컴포넌트
      - 보통 4-8px 너비의 세로 막대
      - 마우스 호버 시 색상 변경
      - 드래그 중 커서 변경

      @mousedown="handleMouseDown":
      - 이벤트 바인딩
      - 사용자가 리사이저를 클릭했을 때
      - handleMouseDown 함수 실행
      - useSplitPane의 함수가 호출됨

      동작 순서:
      1. 사용자가 리사이저 클릭 (mousedown)
      2. handleMouseDown 실행
        - isDragging = true
        - 커서 변경
      3. 마우스 이동 (mousemove)
        - 마우스 위치 추적
        - splitRatio 계산
        - leftWidth, rightWidth 자동 업데이트
      4. 마우스 버튼 뗌 (mouseup)
        - isDragging = false
        - 커서 복원
    -->
    <VDBResizer v-if="resizable" @mousedown="handleMouseDown" />

    <!--
      오른쪽 패널

      class="vdb-split-pane-right":
      - 오른쪽 패널 스타일 적용
      - 왼쪽 패널과 동일한 스타일
      - overflow: auto
      - flex-shrink: 0

      :style="{ width: rightWidth }":
      - 동적 스타일 바인딩
      - rightWidth는 computed 값 (예: "40%")
      - useSplitPane이 1 - splitRatio로 계산
      - leftWidth와 항상 합이 100%

      관계:
      - leftWidth: 60% → rightWidth: 40%
      - leftWidth: 50% → rightWidth: 50%
      - leftWidth: 70% → rightWidth: 30%
    -->
    <div class="vdb-split-pane-right" :style="{ width: rightWidth }">
      <!--
        right 슬롯

        부모 컴포넌트에서 제공한 오른쪽 패널 내용이 여기 렌더링됩니다.

        부모에서:
        <VDBSplitPane>
          <template #right>
            <VDBDetailPanel />
          </template>
        </VDBSplitPane>

        결과:
        <div class="vdb-split-pane-right">
          <VDBDetailPanel />
        </div>
      -->
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
/**
 * 스타일 정의
 *
 * scoped: 이 스타일은 이 컴포넌트에만 적용
 * 다른 컴포넌트에 영향 없음
 */

/**
 * .vdb-split-pane - 컨테이너 스타일
 *
 * 전체 분할 패널의 기본 레이아웃을 정의합니다.
 */
.vdb-split-pane {
  /**
   * display: flex
   *
   * Flexbox 활성화
   * - 자식 요소들을 가로로 배치
   * - 기본 방향: row (왼쪽 → 오른쪽)
   *
   * 자식 배치:
   * [Left Panel] [Resizer] [Right Panel]
   */
  display: flex;

  /**
   * width: 100%
   *
   * 부모 요소의 전체 너비를 사용
   * - 부모가 1000px면 이것도 1000px
   * - 반응형으로 자동 조절
   */
  width: 100%;

  /**
   * height: 100%
   *
   * 부모 요소의 전체 높이를 사용
   * - 보통 부모는 flex-1로 남은 공간 전체
   * - 화면 전체 높이를 채움
   */
  height: 100%;

  /**
   * overflow: hidden
   *
   * 넘치는 내용 숨김
   * - 자식 패널들이 각자 스크롤 처리
   * - 컨테이너 자체는 스크롤 없음
   *
   * 왜 필요?
   * - 왼쪽/오른쪽 패널이 독립적으로 스크롤
   * - 전체가 스크롤되면 리사이저도 같이 움직여서 이상함
   */
  overflow: hidden;
}

/**
 * .vdb-split-pane-left, .vdb-split-pane-right
 *
 * 왼쪽과 오른쪽 패널의 공통 스타일
 *
 * 쉼표로 구분하여 동시에 정의:
 * - 두 패널이 같은 스타일 사용
 * - 코드 중복 방지
 */
.vdb-split-pane-left,
.vdb-split-pane-right {
  /**
   * overflow: auto
   *
   * 내용이 넘치면 스크롤바 표시
   * - 내용이 패널보다 길면: 스크롤 가능
   * - 내용이 패널보다 짧으면: 스크롤 없음
   *
   * 각 패널이 독립적으로 스크롤:
   * - 왼쪽은 아래로 스크롤
   * - 오른쪽은 위쪽 그대로
   * - 또는 그 반대도 가능
   */
  overflow: auto;

  /**
   * flex-shrink: 0
   *
   * Flexbox 축소 방지
   * - 공간이 부족해도 이 요소는 축소 안 됨
   * - 설정한 width를 정확히 유지
   *
   * 왜 필요?
   * - :style="{ width: leftWidth }"로 명시적 너비 설정
   * - flex가 자동으로 조절하면 안 됨
   * - 정확한 비율 유지 필요
   *
   * 기본값 vs 설정값:
   * - 기본값 (flex-shrink: 1): 공간 부족 시 줄어듦
   * - 설정값 (flex-shrink: 0): 절대 줄어들지 않음
   */
  flex-shrink: 0;
}
</style>
