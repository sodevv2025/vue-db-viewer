<script setup lang="ts">
/**
 * VDBMasterTable.vue - 마스터 테이블 컴포넌트
 *
 * Element Plus의 el-table을 사용하여 데이터베이스 데이터를 테이블 형태로 표시합니다.
 *
 * 주요 기능:
 * - 데이터 목록 표시
 * - 행 선택 (단일/다중)
 * - 정렬
 * - 페이지네이션
 * - 로딩 상태
 * - 빈 상태 처리
 *
 * Pinia Store 연동:
 * - useMasterStore를 통해 전역 상태 관리
 * - 다른 컴포넌트들과 선택 상태 공유
 */

// ref: DOM 요소 참조용
// - tableRef로 el-table 인스턴스 접근
// computed: 계산된 속성
// - props 기반으로 자동 재계산되는 값
import { ref, computed } from 'vue'

// useMasterStore: 마스터 테이블의 전역 상태 관리 store
// - 데이터, 선택된 행, 정렬 상태 등 중앙 관리
import { useMasterStore } from '../../stores/useMasterStore'

// MasterConfig: 마스터 테이블 설정의 타입 정의
// - TypeScript 타입 체크용
import type { MasterConfig } from '../../types'

/**
 * Props 인터페이스
 *
 * 부모 컴포넌트로부터 받는 설정 객체입니다.
 */
interface Props {
  /**
   * config - 마스터 테이블 설정
   *
   * 타입: MasterConfig
   * 필수: 반드시 전달해야 함
   *
   * 포함 내용:
   * - dataSource: 데이터 소스 (URL 또는 배열)
   * - rowKey: 행 고유 키
   * - columns: 컬럼 정의
   * - selectionMode: 선택 모드
   * - pagination: 페이지네이션 설정
   *
   * 예:
   * <VDBMasterTable :config="{ dataSource: '/api/users', ... }" />
   */
  config: MasterConfig
}

/**
 * Props 정의
 *
 * defineProps<Props>():
 * - TypeScript 제네릭으로 타입 지정
 * - props.config로 접근 가능
 */
const props = defineProps<Props>()

/**
 * Pinia Store 초기화
 *
 * useMasterStore():
 * - 마스터 테이블의 store 인스턴스 가져오기
 * - 이 store는 앱 전체에서 싱글톤으로 공유됨
 *
 * 사용 가능한 것들:
 * - masterStore.sortedData: 정렬된 데이터
 * - masterStore.selectedRow: 선택된 행
 * - masterStore.isLoading: 로딩 상태
 * - masterStore.selectRow(row, index): 행 선택 함수
 * - masterStore.setSort(column, direction): 정렬 함수
 */
const masterStore = useMasterStore()

/**
 * tableRef - el-table 인스턴스 참조
 *
 * ref():
 * - 초기값 없음 (undefined)
 * - 마운트 후 el-table 인스턴스가 할당됨
 *
 * 용도:
 * - Element Plus el-table의 메서드 호출
 * - 예: tableRef.value.clearSelection()
 *
 * 연결:
 * - 템플릿의 ref="tableRef"와 자동 연결
 */
const tableRef = ref()

/**
 * isSingleSelection - 단일 선택 모드 여부
 *
 * computed():
 * - props.config.selectionMode가 'single'인지 확인
 * - selectionMode가 변경되면 자동 재계산
 *
 * 반환값:
 * - true: 단일 선택 모드 ('single')
 * - false: 다중 선택 모드 ('multiple') 또는 선택 없음 ('none')
 *
 * 사용처:
 * - 행 클릭 이벤트 처리 방식 결정
 * - 체크박스 컬럼 표시 여부 결정
 * - 선택 행 하이라이트 방식 결정
 */
const isSingleSelection = computed(() => props.config.selectionMode === 'single')

/**
 * handleRowClick - 행 클릭 이벤트 핸들러
 *
 * 호출 시점:
 * - 사용자가 테이블의 행을 클릭했을 때
 * - Element Plus의 @row-click 이벤트
 *
 * 매개변수:
 * @param row - 클릭한 행의 데이터 객체
 *               예: { id: 1, name: '홍길동', email: '...' }
 * @param column - 클릭한 컬럼 객체 (사용 안 함)
 * @param event - 원본 마우스 이벤트 (사용 안 함)
 *
 * 동작:
 * 1. 단일 선택 모드가 아니면 종료
 *    - 다중 선택 모드에서는 체크박스로만 선택
 *
 * 2. 클릭한 행의 인덱스 찾기
 *    - sortedData에서 rowKey로 검색
 *    - 예: sortedData에서 id가 2인 행 찾기
 *
 * 3. store의 selectRow 호출
 *    - 전역 상태 업데이트
 *    - 다른 컴포넌트들도 변경 감지
 */
const handleRowClick = (row: any, column: any, event: Event) => {
  /**
   * 단일 선택 모드 체크
   *
   * !isSingleSelection.value:
   * - false면 (다중 선택이면) 함수 종료
   * - 다중 선택은 체크박스로만 선택해야 함
   *
   * return:
   * - early return 패턴
   * - 조건 맞지 않으면 더 이상 진행 안 함
   */
  if (!isSingleSelection.value) return

  /**
   * 클릭한 행의 인덱스 찾기
   *
   * masterStore.sortedData.findIndex():
   * - 배열에서 조건에 맞는 첫 번째 요소의 인덱스 반환
   * - 못 찾으면 -1 반환
   *
   * 비교 조건:
   * - item[props.config.rowKey]: 데이터의 rowKey 필드 값
   * - row[props.config.rowKey]: 클릭한 행의 rowKey 필드 값
   *
   * 예:
   * rowKey = 'id'
   * row = { id: 2, name: '이영희' }
   * → sortedData에서 id가 2인 항목의 인덱스 찾기
   * → 만약 1번 인덱스라면 index = 1
   */
  const index = masterStore.sortedData.findIndex((item: any) => item[props.config.rowKey] === row[props.config.rowKey])

  /**
   * store의 selectRow 호출
   *
   * masterStore.selectRow(row, index):
   * - 전역 상태 업데이트
   * - selectedRow = row
   * - selectedIndex = index
   *
   * 효과:
   * - 디테일 패널에 상세 정보 표시
   * - 선택된 행 하이라이트
   * - hasSelection이 true로 변경
   */
  masterStore.selectRow(row, index)
}

/**
 * handleSelectionChange - 다중 선택 변경 핸들러
 *
 * 호출 시점:
 * - 사용자가 체크박스를 클릭했을 때
 * - Element Plus의 @selection-change 이벤트
 *
 * 매개변수:
 * @param selection - 현재 선택된 행들의 배열
 *                    예: [{ id: 1, ... }, { id: 3, ... }]
 *
 * 동작:
 * 1. 단일 선택 모드면 종료
 *    - 다중 선택 모드에서만 동작
 *
 * 2. 선택된 행이 있으면
 *    - 가장 마지막에 선택한 행을 찾음
 *    - 그 행을 selectedRow로 설정
 *
 * 참고:
 * - 다중 선택이지만 selectedRow는 하나만
 * - 마지막 선택한 행을 "대표"로 디테일 표시
 */
const handleSelectionChange = (selection: any[]) => {
  /**
   * 단일 선택 모드 체크
   *
   * 단일 선택 모드에서는 이 함수가 동작하지 않아야 함
   * - 단일 선택은 handleRowClick에서 처리
   */
  if (isSingleSelection.value) return

  /**
   * 다중 선택 처리
   *
   * selection.length > 0:
   * - 선택된 항목이 하나 이상 있는지 확인
   * - 0이면 모두 해제된 상태
   */
  if (selection.length > 0) {
    /**
     * 마지막 선택 항목 가져오기
     *
     * selection[selection.length - 1]:
     * - 배열의 마지막 요소
     * - 가장 최근에 선택한 행
     *
     * 예:
     * selection = [row1, row2, row3]
     * → lastSelected = row3
     */
    const lastSelected = selection[selection.length - 1]

    /**
     * 마지막 선택 항목의 인덱스 찾기
     *
     * handleRowClick과 동일한 방식
     */
    const index = masterStore.sortedData.findIndex(
      (item: any) => item[props.config.rowKey] === lastSelected[props.config.rowKey]
    )

    /**
     * store 업데이트
     *
     * 다중 선택이지만 selectedRow는 하나:
     * - 디테일 패널은 하나의 행만 표시 가능
     * - 가장 최근 선택을 대표로 표시
     */
    masterStore.selectRow(lastSelected, index)
  }
}

/**
 * handleSortChange - 정렬 변경 핸들러
 *
 * 호출 시점:
 * - 사용자가 컬럼 헤더를 클릭했을 때
 * - Element Plus의 @sort-change 이벤트
 *
 * 매개변수:
 * @param { prop, order } - 구조 분해 할당
 *   - prop: 정렬할 컬럼의 key (예: 'name')
 *   - order: Element Plus의 정렬 방향
 *     - 'ascending': 오름차순
 *     - 'descending': 내림차순
 *     - null: 정렬 해제
 *
 * 동작:
 * 1. Element Plus의 order 값을 우리 시스템의 direction으로 변환
 * 2. store의 setSort 호출
 * 3. sortedData가 자동으로 재계산됨
 */
const handleSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
  /**
   * 정렬 방향 변환
   *
   * Element Plus 형식 → 우리 시스템 형식
   *
   * let direction: 타입 명시
   * - 'asc' | 'desc' | null 중 하나
   *
   * 초기값: null
   * - 정렬 없음 상태로 시작
   */
  let direction: 'asc' | 'desc' | null = null

  /**
   * order 값에 따라 direction 설정
   *
   * 'ascending' → 'asc'
   * 'descending' → 'desc'
   * null 또는 다른 값 → null
   */
  if (order === 'ascending') direction = 'asc'
  else if (order === 'descending') direction = 'desc'

  /**
   * store의 정렬 설정 업데이트
   *
   * masterStore.setSort(prop, direction):
   * - sortColumn = prop
   * - sortDirection = direction
   *
   * 효과:
   * - sortedData computed가 재계산됨
   * - 테이블 자동 업데이트
   * - 화면에 정렬된 데이터 표시
   */
  masterStore.setSort(prop, direction)
}

/**
 * tableRowClassName - 행 CSS 클래스 함수
 *
 * 목적:
 * - 선택된 행에 특별한 스타일 적용
 * - 시각적으로 선택 상태를 명확히 표시
 *
 * 매개변수:
 * @param { row } - 구조 분해 할당
 *   - row: 현재 행의 데이터
 *
 * 반환값:
 * - 'selected-row': 선택된 행
 * - '': 선택되지 않은 행 (기본 스타일)
 *
 * Element Plus 연동:
 * - :row-class-name prop에 이 함수 전달
 * - el-table이 각 행마다 이 함수 호출
 * - 반환된 클래스명을 <tr>에 적용
 */
const tableRowClassName = ({ row }: { row: any }) => {
  /**
   * 단일 선택 모드이고 선택된 행이 있을 때만 체크
   *
   * isSingleSelection.value:
   * - 단일 선택 모드인지 확인
   *
   * masterStore.selectedRow:
   * - 선택된 행이 있는지 확인
   * - null이면 선택 없음
   */
  if (isSingleSelection.value && masterStore.selectedRow) {
    /**
     * 현재 행이 선택된 행인지 비교
     *
     * row[props.config.rowKey]:
     * - 현재 행의 고유 키 값
     *
     * masterStore.selectedRow[props.config.rowKey]:
     * - 선택된 행의 고유 키 값
     *
     * 비교:
     * - 같으면: 'selected-row' 클래스 반환
     * - 다르면: '' (빈 문자열) 반환
     *
     * 예:
     * rowKey = 'id'
     * row.id = 2
     * selectedRow.id = 2
     * → return 'selected-row'
     *
     * row.id = 3
     * selectedRow.id = 2
     * → return ''
     */
    return row[props.config.rowKey] === masterStore.selectedRow[props.config.rowKey]
      ? 'selected-row'
      : ''
  }

  /**
   * 기본값 반환
   *
   * 다음 경우들:
   * - 다중 선택 모드
   * - 선택 없음 모드
   * - 아무것도 선택되지 않은 상태
   *
   * → 모든 행에 기본 스타일 적용
   */
  return ''
}

/**
 * 전체 흐름 요약:
 *
 * 1. 초기 렌더링
 *    - store에서 sortedData 가져옴
 *    - columns 설정대로 테이블 렌더링
 *    - selectedRow = null (선택 없음)
 *
 * 2. 사용자가 행 클릭
 *    - handleRowClick 실행
 *    - store.selectRow 호출
 *    - selectedRow 업데이트
 *
 * 3. 화면 업데이트
 *    - tableRowClassName이 재실행됨
 *    - 선택된 행에 'selected-row' 클래스 적용
 *    - 녹색 배경으로 하이라이트
 *
 * 4. 디테일 패널 연동
 *    - store.selectedRow가 변경됨
 *    - provide/inject로 공유된 값
 *    - 디테일 패널이 자동으로 업데이트
 */
</script>

<template>
  <!--
    테이블 컨테이너

    클래스:
    - vdb-master-table: 커스텀 클래스
    - h-full: 높이 100% (부모 높이 전체)
    - flex flex-col: Flexbox 세로 방향
      - 자식: 테이블 (flex-1) + 페이지네이션 (고정)
  -->
  <div class="vdb-master-table h-full flex flex-col">
    <!--
      테이블 컨테이너

      flex-1: 남은 공간 모두 차지
      - 페이지네이션을 제외한 모든 공간

      overflow-auto: 내용이 넘치면 스크롤
      - 테이블이 길면 세로 스크롤
      - 컬럼이 많으면 가로 스크롤
    -->
    <div class="flex-1 overflow-auto">
      <!--
        Element Plus Table

        ref="tableRef":
        - script의 tableRef와 연결
        - el-table 인스턴스 접근 가능

        :data="masterStore.sortedData":
        - 표시할 데이터 배열
        - store의 computed 값 (정렬 적용됨)
        - 데이터가 변경되면 자동 업데이트

        :row-key="config.rowKey":
        - 각 행의 고유 키 필드
        - Vue의 :key와 유사
        - 예: 'id' → row.id를 고유 키로 사용

        :row-class-name="tableRowClassName":
        - 각 행의 CSS 클래스를 결정하는 함수
        - 선택된 행에 'selected-row' 클래스 적용

        :height="'100%'":
        - 테이블 높이 100%
        - 부모 컨테이너를 꽉 채움
        - 스크롤 가능하게 만듦

        :stripe="true":
        - 줄무늬 효과 (홀수/짝수 행 색상 다름)
        - 가독성 향상

        :highlight-current-row="isSingleSelection":
        - 단일 선택 모드일 때만 현재 행 하이라이트
        - Element Plus 기본 하이라이트 기능

        @row-click="handleRowClick":
        - 행 클릭 이벤트
        - 단일 선택 모드에서 행 선택

        @selection-change="handleSelectionChange":
        - 선택 변경 이벤트 (체크박스)
        - 다중 선택 모드에서 사용

        @sort-change="handleSortChange":
        - 정렬 변경 이벤트
        - 컬럼 헤더 클릭 시

        v-loading="masterStore.isLoading":
        - Element Plus 로딩 디렉티브
        - true일 때 스피너 표시
        - 데이터 로드 중 상태 표시
      -->
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
        <!--
          선택 컬럼 (다중 선택용 체크박스)

          v-if="!isSingleSelection":
          - 단일 선택이 아닐 때만 표시
          - 다중 선택 모드에서는 체크박스 필요
          - 단일 선택 모드에서는 행 클릭으로 선택

          type="selection":
          - Element Plus의 특수 컬럼 타입
          - 자동으로 체크박스 렌더링
          - 선택 상태 관리

          width="55":
          - 고정 너비 55px
          - 체크박스에 적합한 크기

          align="center":
          - 체크박스 가운데 정렬
        -->
        <el-table-column
          v-if="!isSingleSelection"
          type="selection"
          width="55"
          align="center"
        />

        <!--
          데이터 컬럼들

          v-for="column in config.columns":
          - config.columns 배열을 순회
          - 각 컬럼 정의마다 el-table-column 생성

          :key="column.key":
          - Vue의 리스트 렌더링 키
          - 컬럼 고유 식별자

          :prop="column.key":
          - 데이터의 어떤 필드를 표시할지
          - 예: prop="name" → row.name 표시

          :label="column.label":
          - 헤더에 표시될 텍스트
          - 예: label="이름"

          :width="column.width":
          - 컬럼 고정 너비
          - 예: width="150" → 150px
          - 생략 시 자동 조절

          :min-width="column.minWidth":
          - 컬럼 최소 너비
          - 이보다 작아지지 않음

          :align="column.align || 'left'":
          - 셀 내용 정렬
          - column.align이 없으면 기본값 'left'
          - || (OR 연산자) 사용

          :sortable="column.sortable ? 'custom' : false":
          - 정렬 가능 여부
          - column.sortable이 true면 'custom'
            - 'custom': 우리가 정렬 로직 제공 (handleSortChange)
            - true: Element Plus가 자동 정렬
          - false면 정렬 불가
        -->
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
          <!--
            셀 내용 슬롯

            #default="{ row }":
            - Element Plus가 제공하는 스코프 슬롯
            - row: 현재 행의 데이터 객체

            {{ row[column.key] }}:
            - 데이터의 해당 필드 값 표시
            - 예: column.key='name', row={id:1, name:'홍길동'}
            -   → '홍길동' 표시

            TODO: 나중에 formatter 적용
            - column.formatter가 있으면 변환
            - 예: 날짜 포맷, 금액 포맷 등
          -->
          <template #default="{ row }">
            {{ row[column.key] }}
          </template>
        </el-table-column>

        <!--
          빈 상태 슬롯

          #empty:
          - Element Plus가 제공하는 특수 슬롯
          - 데이터가 없을 때 표시되는 내용

          표시 조건:
          - sortedData.length === 0
          - 또는 필터링 결과가 없을 때

          스타일:
          - text-center: 가운데 정렬
          - py-12: 상하 패딩 48px (넉넉한 공간)
          - text-gray-400: 연한 회색 (덜 중요함을 표시)
        -->
        <template #empty>
          <div class="text-center py-12 text-gray-400">
            <!--
              메인 메시지

              text-lg: 폰트 크기 18px
              mb-2: 아래 마진 8px
            -->
            <div class="text-lg mb-2">데이터가 없습니다</div>

            <!--
              설명 메시지

              text-sm: 작은 폰트 14px
            -->
            <div class="text-sm">표시할 데이터가 없습니다</div>
          </div>
        </template>
      </el-table>
    </div>

    <!--
      페이지네이션 (조건부 렌더링)

      v-if="config.pagination":
      - pagination 설정이 있을 때만 표시
      - 없으면 이 영역 전체가 렌더링 안 됨

      클래스:
      - border-t: 상단 테두리 (테이블과 구분)
      - border-gray-200: 연한 회색 테두리
      - px-4 py-3: 패딩
      - bg-white: 흰색 배경
    -->
    <div v-if="config.pagination" class="border-t border-gray-200 px-4 py-3 bg-white">
      <!--
        Element Plus Pagination

        :current-page="1":
        - 현재 페이지 번호
        - TODO: store에서 관리해야 함
        - 지금은 임시로 1로 고정

        :page-size="config.pagination.pageSize":
        - 한 페이지당 항목 수
        - config에서 설정한 값 사용
        - 예: 20

        :page-sizes="config.pagination.pageSizes":
        - 사용자가 선택 가능한 페이지 크기 옵션
        - 예: [10, 20, 50, 100]
        - 드롭다운으로 표시

        :total="masterStore.sortedData.length":
        - 전체 항목 수
        - 현재는 정렬된 데이터 전체 길이
        - TODO: 서버사이드 페이징 시 API에서 받아야 함

        layout="...":
        - 페이지네이션 UI 구성 요소
        - total: 전체 개수 표시
        - sizes: 페이지 크기 선택
        - prev, pager, next: 이전/페이지번호/다음
        - jumper: 페이지 직접 입력

        class="justify-end":
        - Tailwind 클래스
        - 오른쪽 정렬
        - 일반적인 페이지네이션 위치

        TODO: 이벤트 핸들러 추가
        - @current-change: 페이지 변경
        - @size-change: 페이지 크기 변경
      -->
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
/**
 * 스타일 정의
 *
 * scoped: 이 컴포넌트에만 적용
 */

/**
 * .vdb-master-table - 테이블 컨테이너 배경
 */
.vdb-master-table {
  background: white;
}

/**
 * 선택된 행 하이라이트 스타일
 *
 * :deep() - Vue 3의 깊은 선택자
 * - scoped 스타일에서 자식 컴포넌트 스타일링
 * - Element Plus 컴포넌트 내부 요소에 접근
 *
 * .selected-row:
 * - tableRowClassName이 반환한 클래스
 * - 선택된 행의 <tr>에 적용됨
 *
 * background-color: #ecfdf5:
 * - 연한 녹색 배경
 * - Tailwind의 emerald-50과 유사
 *
 * !important:
 * - Element Plus 기본 스타일 덮어쓰기
 * - el-table의 높은 우선순위 스타일 때문에 필요
 */
:deep(.selected-row) {
  background-color: #ecfdf5 !important;
}

/**
 * 선택된 행 호버 스타일
 *
 * .selected-row:hover > td:
 * - 선택된 행에 마우스 올렸을 때
 * - > td: 직접 자식 td 요소들
 *
 * background-color: #d1fae5:
 * - 더 진한 녹색
 * - Tailwind의 emerald-100과 유사
 * - 호버 상태를 명확히 표시
 */
:deep(.selected-row:hover > td) {
  background-color: #d1fae5 !important;
}

/**
 * Element Plus 테이블 커스터마이징
 *
 * :deep(.el-table):
 * - el-table의 기본 스타일 조정
 *
 * font-size: 14px:
 * - 테이블 전체 폰트 크기
 * - 적절한 밀도 제공
 */
:deep(.el-table) {
  font-size: 14px;
}

/**
 * 테이블 헤더 스타일
 *
 * .el-table__header th:
 * - 헤더 셀들
 *
 * background-color: #f9fafb:
 * - 연한 회색 배경
 * - Tailwind gray-50
 * - 바디와 구분
 *
 * color: #374151:
 * - 진한 회색 텍스트
 * - Tailwind gray-700
 *
 * font-weight: 600:
 * - 세미볼드
 * - 헤더임을 명확히 표시
 */
:deep(.el-table__header th) {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
}

/**
 * 행 호버 스타일
 *
 * .el-table__row:hover > td:
 * - 행에 마우스 올렸을 때
 *
 * background-color: #f3f4f6:
 * - 연한 회색
 * - Tailwind gray-100
 * - 어떤 행인지 명확히 표시
 */
:deep(.el-table__row:hover > td) {
  background-color: #f3f4f6;
}

/**
 * 페이지네이션 정렬
 *
 * .el-pagination:
 * - Element Plus 페이지네이션
 *
 * display: flex:
 * - Flexbox 활성화
 *
 * justify-content: flex-end:
 * - 오른쪽 정렬
 * - 일반적인 페이지네이션 위치
 */
:deep(.el-pagination) {
  display: flex;
  justify-content: flex-end;
}
</style>
