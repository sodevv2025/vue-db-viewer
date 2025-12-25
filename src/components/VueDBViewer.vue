<script setup lang="ts">
/**
 * VueDBViewer.vue - 메인 뷰어 컴포넌트
 *
 * 이 컴포넌트는 전체 DB 뷰어의 최상위 레이아웃을 구성합니다.
 * - 헤더, 메인 컨텐츠, 푸터의 3단 구조
 * - 메인 컨텐츠는 왼쪽 패널(선택사항) + 마스터/디테일 영역으로 구성
 * - Pinia store를 통해 전역 상태 관리
 * - provide/inject를 통해 자식 컴포넌트들과 데이터 공유
 */

// computed: 계산된 속성을 만드는 Vue 함수
// - 의존하는 값이 변경되면 자동으로 재계산됨
// - 예: props.config가 바뀌면 layoutConfig도 자동 업데이트
//
// provide: 자식 컴포넌트들에게 데이터를 제공하는 Vue 함수
// - props drilling 없이 깊은 단계의 컴포넌트에 데이터 전달 가능
import { computed, provide } from 'vue'

// useMasterStore: 마스터 테이블의 상태를 관리하는 Pinia store
// - 데이터, 선택된 행, 로딩 상태 등을 중앙에서 관리
// - 여러 컴포넌트가 같은 상태를 공유할 수 있음
import { useMasterStore } from '../stores/useMasterStore'

// VDBSplitPane: 좌우 분할 패널 컴포넌트
// - 마스터와 디테일을 좌우로 배치하고 리사이저 제공
// - 드래그로 비율 조절 가능
import VDBSplitPane from './layout/VDBSplitPane.vue'

// VDBMasterTable: 마스터 테이블 컴포넌트
// - 데이터 목록을 테이블로 표시
// - 정렬, 페이징, 행 선택 등의 기능 제공
import VDBMasterTable from './table/VDBMasterTable.vue'

import VDBDetailPanel from './detail/VDBDetailPanel.vue'

// VueDBViewerConfig: 뷰어 설정의 타입 정의
// - TypeScript로 설정 객체의 구조를 정의
// - IDE에서 자동완성과 타입 체크 제공
import type { VueDBViewerConfig } from '../types'

/**
 * Props 인터페이스 정의
 *
 * 이 컴포넌트가 부모로부터 받는 props의 타입을 정의합니다.
 */
interface Props {
  /**
   * config: 뷰어의 모든 설정을 담는 객체
   *
   * 이 객체 하나로 전체 뷰어의 동작을 제어합니다.
   */
  config: VueDBViewerConfig
}

const props = defineProps<Props>()

// Pinia Store 초기화
// useMasterStore()로 마스터 테이블의 store 인스턴스를 가져옵니다.
const masterStore = useMasterStore()

/**
 * 레이아웃 설정
 *
 * config에서 레이아웃 관련 설정을 추출하고 기본값을 적용합니다.
 */
const layoutConfig = computed(() => ({
  // 초기 화면 분할 비율 (기본값: 0.5 = 50:50)
  splitRatio: props.config.layout?.splitRatio ?? 0.5,

  // 마스터 패널의 최소 너비 (기본값: 400px)
  minMasterWidth: props.config.layout?.minMasterWidth ?? 400,

  // 디테일 패널의 최소 너비 (기본값: 400px)
  minDetailWidth: props.config.layout?.minDetailWidth ?? 400,

  // 리사이저 활성화 여부 (기본값: true)
  resizable: props.config.layout?.resizable ?? true,
}))

/**
 * 왼쪽 패널 표시 여부
 *
 * config.leftPanel이 정의되어 있으면 true
 */
const hasLeftPanel = computed(() => !!props.config.leftPanel)

/**
 * 디테일 패널 표시 여부
 *
 * config.detail이 정의되어 있으면 true
 * false면 마스터 테이블만 전체 화면에 표시됨
 */
const hasDetailPanel = computed(() => !!props.config.detail)

// Provide - 하위 컴포넌트에 데이터 전달
// - 'vdb-config': 전체 설정 객체
// - 'vdb-selected-row': 선택된 행 (reactive)
provide('vdb-config', props.config)
provide('vdb-selected-row', masterStore.selectedRow)
</script>

<template>
  <!--
    최상위 컨테이너

    클래스:
    - flex-col: 세로 방향 레이아웃 (헤더 → 메인 → 푸터)
    - h-screen: 화면 전체 높이 (100vh)
    - bg-gray-50: 연한 회색 배경
  -->
  <div class="vdb-viewer flex flex-col h-screen bg-gray-50">
    <!--
      헤더 슬롯 (선택사항)

      부모가 <template #header>를 제공하면 표시됩니다.
    -->
    <header v-if="$slots.header" class="vdb-header bg-white border-b border-gray-200">
      <slot name="header" />
    </header>

    <!--
      메인 컨텐츠 영역

      클래스:
      - flex-1: 남은 공간을 모두 차지
      - flex: 가로 방향 레이아웃 (왼쪽 패널 → 메인 컨텐츠)
      - overflow-hidden: 내부 스크롤을 위해 넘침 숨김
    -->
    <main class="vdb-main flex-1 flex overflow-hidden">
      <!--
        왼쪽 패널 (검색/필터 영역)

        hasLeftPanel이 true일 때만 표시됩니다.
        - flex-shrink-0: 크기 축소 방지 (고정 너비 유지)
        - width: config.leftPanel.width로 동적 설정 (기본값: 280px)
      -->
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

      <!--
        메인 컨텐츠 컨테이너 (마스터 + 디테일)

        두 가지 경우:
        1. 디테일 패널 없음 → 마스터만 전체 화면
        2. 디테일 패널 있음 → SplitPane으로 좌우 분할
      -->
      <div class="vdb-content flex-1 overflow-hidden">
        <!--
          마스터 전용 모드 (디테일 패널 없음)

          hasDetailPanel이 false면 마스터 테이블만 전체 화면에 표시
        -->
        <section
          v-if="!hasDetailPanel"
          class="vdb-master h-full"
        >
          <VDBMasterTable :config="config.master" />
        </section>

        <!--
          마스터 + 디테일 모드 (분할 패널)

          hasDetailPanel이 true면 VDBSplitPane으로 화면 분할
          - 왼쪽: 마스터 테이블
          - 가운데: 리사이저 바 (드래그 가능)
          - 오른쪽: 디테일 패널
        -->
        <VDBSplitPane
          v-else
          :initial-ratio="layoutConfig.splitRatio"
          :min-left-width="layoutConfig.minMasterWidth"
          :min-right-width="layoutConfig.minDetailWidth"
          :resizable="layoutConfig.resizable"
        >
          <!--
            마스터 테이블 (왼쪽 패널)

            데이터 목록을 표로 표시합니다.
            행을 클릭하면 디테일 패널에 상세 정보가 표시됩니다.
          -->
          <template #left>
            <section class="vdb-master h-full">
              <VDBMasterTable :config="config.master" />
            </section>
          </template>

          <!--
            디테일 패널 (오른쪽 패널)

            마스터 테이블에서 선택한 행의 상세 정보를 표시합니다.
            - selectedRow가 null이면 "행을 선택하세요" 메시지 표시
            - 선택된 행이 있으면 상세 정보 표시 (향후 구현)
          -->
          <template #right>
            <section class="vdb-detail bg-white h-full">
                <VDBDetailPanel />
            </section>
          </template>
        </VDBSplitPane>
      </div>
    </main>

    <!--
      푸터 슬롯 (선택사항)

      부모가 <template #footer>를 제공하면 표시됩니다.
    -->
    <footer v-if="$slots.footer" class="vdb-footer bg-white border-t border-gray-200">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
/**
 * 뷰어 기본 스타일
 *
 * 시스템 기본 폰트를 사용하여 OS별로 최적화된 폰트 렌더링
 */
.vdb-viewer {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/**
 * 리사이저 기본 스타일
 *
 * 드래그 중 텍스트 선택 방지
 */
.vdb-resizer {
  user-select: none;
  touch-action: none;
}

/**
 * 리사이저 활성 상태
 *
 * 드래그 중일 때 파란색으로 표시
 */
.vdb-resizer:active {
  background-color: #3b82f6;
}
</style>
