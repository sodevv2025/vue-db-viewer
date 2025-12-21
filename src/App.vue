<script setup lang="ts">
/**
 * App.vue - Vue DB Viewer 데모 애플리케이션
 *
 * 이 파일은 Vue DB Viewer 라이브러리를 실제로 사용하는 예제입니다.
 * 설정 객체(config)를 통해 뷰어의 모든 동작을 정의합니다.
 */

// VueDBViewer: 메인 뷰어 컴포넌트
// - 마스터-디테일 패턴의 데이터베이스 뷰어
// - 왼쪽에 데이터 테이블, 오른쪽에 상세 정보 표시
import VueDBViewer from './components/VueDBViewer.vue'

// VueDBViewerConfig: 설정 객체의 타입 정의
// - type import: TypeScript 타입만 가져옴 (컴파일 시 제거됨)
// - 뷰어의 모든 설정 옵션에 대한 타입 안전성 제공
import type { VueDBViewerConfig } from './types'

/**
 * 뷰어 설정 객체
 *
 * 이 객체 하나로 전체 뷰어의 레이아웃, 동작, 데이터 소스 등을 정의합니다.
 * config를 수정하면 뷰어의 모든 측면을 커스터마이징할 수 있습니다.
 */
const config: VueDBViewerConfig = {
  /**
   * 레이아웃 설정
   *
   * 마스터 테이블과 디테일 패널의 화면 분할 방식을 정의합니다.
   */
  layout: {
    // splitRatio: 초기 화면 분할 비율 (0~1 사이의 값)
    // - 0.5 = 50:50 (마스터 50%, 디테일 50%)
    // - 0.6 = 60:40 (마스터 60%, 디테일 40%)
    splitRatio: 0.5,

    // resizable: 사용자가 드래그로 분할 비율을 조절할 수 있는지 여부
    // - true: 중간에 리사이저 바가 표시되고 드래그 가능
    // - false: 고정 비율, 조절 불가
    resizable: true,
  },

  /**
   * 왼쪽 패널 설정
   *
   * 화면 왼쪽에 표시되는 검색/필터 패널을 정의합니다.
   * 사용자가 데이터를 검색하고 필터링하는 UI가 여기 표시됩니다.
   */
  leftPanel: {
    // collapsible: 접기/펼치기 기능 활성화 여부
    // - true: 토글 버튼이 표시되고 패널을 숨길 수 있음
    // - false: 항상 표시됨
    collapsible: true,

    // width: 패널의 너비 (픽셀 단위)
    // - 280 = 280px
    // - 패널이 접히면 이 너비만큼 공간이 확보됨
    width: 280,

    // sections: 패널 내부의 섹션 목록
    // - 패널은 여러 섹션으로 나뉠 수 있음 (검색, 필터, 설정 등)
    sections: [
      {
        // id: 섹션의 고유 식별자
        id: 'search',

        // title: 섹션 제목 (화면에 표시됨)
        title: '검색',
      },
    ],
  },

  /**
   * 마스터 테이블 설정 (필수)
   *
   * 왼쪽에 표시되는 메인 데이터 테이블을 정의합니다.
   * 사용자가 행을 선택하면 오른쪽 디테일 패널에 상세 정보가 표시됩니다.
   */
  master: {
    // dataSource: 데이터를 가져올 소스
    // - API URL (string): '/api/users' → 서버에서 데이터 가져옴
    // - 배열 (any[]): [{id:1, name:'홍길동'}, ...] → 직접 데이터 제공
    dataSource: '/api/users',

    // rowKey: 각 행의 고유 식별자로 사용할 필드명
    // - Vue가 각 행을 추적하고, 선택/업데이트를 처리하는 데 필수
    // - 이 필드의 값은 중복되면 안 됨!
    rowKey: 'id',

    // selectionMode: 행 선택 방식
    // - 'single': 한 번에 하나의 행만 선택 가능
    // - 'multiple': 여러 행을 동시에 선택 가능 (체크박스)
    // - 'none': 선택 불가
    selectionMode: 'single',

    // columns: 테이블에 표시할 컬럼 정의
    // - 배열의 순서대로 왼쪽부터 표시됨
    columns: [
      {
        // key: 데이터 객체에서 표시할 필드명 (row.id)
        key: 'id',

        // label: 테이블 헤더에 표시될 컬럼 이름
        label: 'ID',

        // width: 컬럼의 고정 너비 (픽셀 단위)
        width: 80,

        // align: 셀 내용의 정렬 방식
        // - 'center': 가운데 정렬
        // - 'left': 왼쪽 정렬 (기본값)
        // - 'right': 오른쪽 정렬
        align: 'center',
      },
      {
        key: 'name',
        label: '이름',

        // sortable: 정렬 가능 여부
        // - true: 헤더를 클릭하면 오름차순/내림차순 정렬
        sortable: true,
      },
      {
        key: 'email',
        label: '이메일',
      },
      {
        key: 'status',
        label: '상태',
      },
    ],

    // pagination: 페이지네이션 설정
    // - 많은 데이터를 여러 페이지로 나누어 표시
    pagination: {
      // pageSize: 한 페이지에 표시할 행(row)의 개수
      pageSize: 20,

      // pageSizes: 사용자가 선택할 수 있는 페이지 크기 옵션들
      pageSizes: [10, 20, 50, 100],
    },
  },

  /**
   * 디테일 패널 설정 (선택사항)
   *
   * 오른쪽에 표시되는 상세 정보 패널을 정의합니다.
   * 마스터 테이블에서 행을 선택하면 해당 행의 상세 정보가 여기 표시됩니다.
   */
  detail: {
    // editable: 디테일 패널에서 데이터 편집 가능 여부
    // - true: 필드들이 입력 가능한 폼 형태로 표시됨
    // - false: 읽기 전용 모드
    editable: true,

    // tabs: 디테일 패널의 탭 목록
    // - 상세 정보를 여러 탭으로 나누어 표시 가능
    tabs: [
      {
        // id: 탭의 고유 식별자
        id: 'info',

        // label: 탭에 표시될 이름
        label: '기본 정보',

        // fields: 이 탭에 표시할 필드들
        fields: [
          {
            // key: 데이터 객체의 필드명 (selectedRow.name)
            key: 'name',

            // label: 필드 앞에 표시될 레이블
            label: '이름',

            // editable: 이 필드를 수정할 수 있는지
            // - true: 텍스트 입력창으로 표시
            // - false: 읽기 전용 텍스트로 표시
            editable: true,
          },
          {
            key: 'email',
            label: '이메일',
            editable: true,
          },
        ],
      },
    ],

    // actions: 디테일 패널 하단에 표시될 액션 버튼들
    actions: [
      {
        // label: 버튼에 표시될 텍스트
        label: '수정',

        // action: 버튼 클릭 시 발생할 이벤트 이름
        action: 'edit',

        // type: 버튼의 스타일 타입
        // - 'primary': 주요 버튼 (파란색)
        // - 'danger': 위험한 작업 (빨간색)
        // - 'default': 기본 버튼 (회색)
        type: 'primary',
      },
      {
        label: '삭제',
        action: 'delete',
        type: 'danger',
      },
    ],
  },
}
</script>

<template>
  <!--
    VueDBViewer 컴포넌트

    :config prop으로 위에서 정의한 설정 객체를 전달합니다.
    이 설정 하나로 전체 뷰어가 구성됩니다.
  -->
  <VueDBViewer :config="config">
    <!--
      헤더 슬롯 (선택사항)

      <template #header>로 헤더 영역을 커스터마이징할 수 있습니다.
      이 슬롯을 제공하지 않으면 기본 헤더가 표시됩니다.
    -->
    <template #header>
      <div class="px-6 py-4">
        <h1 class="text-2xl font-bold text-gray-800">Vue DB Viewer Demo</h1>
        <p class="text-sm text-gray-500 mt-1">마스터-디테일 패턴 데이터베이스 뷰어</p>
      </div>
    </template>

    <!--
      푸터 슬롯 (선택사항)

      <template #footer>로 푸터 영역을 커스터마이징할 수 있습니다.
      이 슬롯을 제공하지 않으면 기본 푸터가 표시됩니다.
    -->
    <template #footer>
      <div class="px-6 py-3 text-sm text-gray-500 text-center">
        Vue DB Viewer v0.0.1 - Made with Vue 3 + Element Plus + Tailwind CSS
      </div>
    </template>
  </VueDBViewer>
</template>

<style>
/**
 * 전역 스타일
 *
 * <style scoped>가 아니므로 전체 애플리케이션에 적용됩니다.
 * 뷰어가 화면 전체를 차지하도록 기본 스타일을 재설정합니다.
 */

/**
 * body 스타일 초기화
 *
 * 브라우저 기본 margin/padding을 제거하여
 * 뷰어가 화면 끝까지 꽉 차도록 만듭니다.
 */
body {
  margin: 0;
  padding: 0;
}

/**
 * #app 전체 화면 높이 설정
 *
 * height: 100vh (viewport height의 100%)
 * - 브라우저 화면 높이의 100%를 차지
 * - 브라우저 크기를 조절하면 자동으로 조정됨
 */
#app {
  height: 100vh;
}
</style>
