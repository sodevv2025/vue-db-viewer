// ============================================
// Vue DB Viewer 타입 정의
// ============================================

/**
 * Vue DB Viewer 전체 설정
 * @example
 * const config: VueDBViewerConfig = {
 *   master: {
 *     dataSource: '/api/users',
 *     rowKey: 'id',
 *     columns: [{ key: 'id', label: 'ID' }]
 *   }
 * }
 */
export interface VueDBViewerConfig {
  /** 레이아웃 설정 (좌우 분할 비율 등) */
  layout?: LayoutConfig
  /** 왼쪽 패널 설정 (검색/필터) */
  leftPanel?: LeftPanelConfig
  /** 마스터 테이블 설정 (필수) */
  master: MasterConfig
  /** 디테일 패널 설정 */
  detail?: DetailConfig
}

// ============================================
// 메인 섹션 설정
// ============================================

/**
 * 레이아웃 설정
 * @example { splitRatio: 0.6, resizable: true }
 */
export interface LayoutConfig {
  /** 좌우 분할 비율 (0~1) @default 0.5 @example 0.6 */
  splitRatio?: number
  /** 마스터 테이블 최소 너비(px) @default 400 */
  minMasterWidth?: number
  /** 디테일 패널 최소 너비(px) @default 400 */
  minDetailWidth?: number
  /** 리사이저 활성화 여부 @default true */
  resizable?: boolean
}

/**
 * 왼쪽 패널 설정
 * @example { collapsible: true, width: 280, sections: [...] }
 */
export interface LeftPanelConfig {
  /** 접기/펼치기 가능 여부 @default true */
  collapsible?: boolean
  /** 패널 너비(px) @default 280 */
  width?: number
  /** 섹션 목록 (검색, 필터 등) */
  sections?: PanelSection[]
}

/**
 * 마스터 테이블 설정
 * @example
 * {
 *   dataSource: '/api/users',
 *   rowKey: 'id',
 *   columns: [
 *     { key: 'id', label: 'ID' },
 *     { key: 'name', label: '이름', sortable: true }
 *   ]
 * }
 */
export interface MasterConfig {
  /** 데이터 소스 (API URL 또는 배열) @example '/api/users' */
  dataSource: string | any[]
  /** 행 고유 키 필드명 @example 'id' */
  rowKey: string
  /** 행 선택 모드 @default 'single' */
  selectionMode?: 'single' | 'multiple' | 'none'
  /** 컬럼 정의 배열 */
  columns: Column[]
  /** 페이지네이션 설정 */
  pagination?: PaginationConfig
  /** 정렬 기능 활성화 @default false */
  sortable?: boolean
}

/**
 * 디테일 패널 설정
 * @example
 * {
 *   editable: true,
 *   tabs: [{ id: 'info', label: '기본 정보', fields: [...] }],
 *   actions: [{ label: '수정', action: 'edit', type: 'primary' }]
 * }
 */
export interface DetailConfig {
  /** 편집 모드 활성화 @default false */
  editable?: boolean
  /** 탭 목록 */
  tabs?: DetailTab[]
  /** 액션 버튼 목록 */
  actions?: DetailAction[]
}

// ============================================
// 하위 설정
// ============================================

/**
 * 패널 섹션 (필터 그룹)
 * @example { id: 'search', title: '검색', filters: [...] }
 */
export interface PanelSection {
  /** 섹션 ID @example 'search' */
  id: string
  /** 섹션 제목 @example '검색' */
  title: string
  /** 필터 목록 */
  filters?: Filter[]
}

/**
 * 테이블 컬럼
 * @example { key: 'name', label: '이름', sortable: true, width: 150 }
 */
export interface Column {
  /** 데이터 필드명 @example 'name' */
  key: string
  /** 컬럼 헤더 레이블 @example '이름' */
  label: string
  /** 정렬 가능 여부 @default false */
  sortable?: boolean
  /** 컬럼 너비 @example 100 또는 '150px' */
  width?: number | string
  /** 컬럼 최소 너비 @example 100 */
  minWidth?: number | string
  /** 정렬 방향 @default 'left' */
  align?: 'left' | 'center' | 'right'
  /** 값 포맷팅 함수 @example (val) => new Date(val).toLocaleDateString() */
  formatter?: (value: any, row: any) => string
}

/**
 * 페이지네이션 설정
 * @example { pageSize: 20, pageSizes: [10, 20, 50], total: 1000 }
 */
export interface PaginationConfig {
  /** 페이지당 항목 수 @default 20 */
  pageSize?: number
  /** 선택 가능한 페이지 크기 @default [10, 20, 50, 100] */
  pageSizes?: number[]
  /** 전체 항목 수 */
  total?: number
  /** 현재 페이지 번호 (1부터 시작) @default 1 */
  currentPage?: number
}

/**
 * 디테일 탭
 * @example
 * {
 *   id: 'info',
 *   label: '기본 정보',
 *   fields: [{ key: 'name', label: '이름', editable: true }]
 * }
 * @example
 * {
 *   id: 'orders',
 *   label: '주문 내역',
 *   dataSource: (row) => `/api/users/${row.id}/orders`,
 *   columns: [...]
 * }
 */
export interface DetailTab {
  /** 탭 ID @example 'info' */
  id: string
  /** 탭 레이블 @example '기본 정보' */
  label: string
  /** 폼 필드 목록 (정보 탭용) */
  fields?: DetailField[]
  /** 관련 데이터 API URL @example (row) => `/api/users/${row.id}/orders` */
  dataSource?: string | ((row: any) => string)
  /** 관련 데이터 테이블 컬럼 */
  columns?: Column[]
  /** 커스텀 컴포넌트 */
  component?: any
}

/**
 * 디테일 액션 버튼
 * @example { label: '수정', action: 'edit', type: 'primary' }
 */
export interface DetailAction {
  /** 버튼 텍스트 @example '수정' */
  label: string
  /** 액션 이름 (이벤트명) @example 'edit' */
  action: string
  /** 버튼 타입 @default 'default' */
  type?: 'primary' | 'danger' | 'default'
  /** 아이콘 이름 @example 'Edit' */
  icon?: string
}

// ============================================
// 세부 타입
// ============================================

/**
 * 필터 정의
 * @example { key: 'keyword', type: 'text', label: '검색어', placeholder: '이름 또는 이메일' }
 * @example { key: 'status', type: 'select', label: '상태', options: [{label: '활성', value: 'active'}] }
 */
export interface Filter {
  /** 필터 키 @example 'status' */
  key: string
  /** 필터 타입 */
  type: 'select' | 'daterange' | 'multiselect' | 'text'
  /** 필터 레이블 @example '상태' */
  label: string
  /** select 옵션 목록 @example [{label: '활성', value: 'active'}] */
  options?: Array<{ label: string; value: any }>
  /** 플레이스홀더 @example '검색어를 입력하세요' */
  placeholder?: string
}

/**
 * 디테일 필드
 * @example { key: 'name', label: '이름', editable: true, type: 'text' }
 * @example { key: 'status', label: '상태', editable: true, type: 'select', options: [...] }
 */
export interface DetailField {
  /** 데이터 필드명 @example 'name' */
  key: string
  /** 필드 레이블 @example '이름' */
  label: string
  /** 편집 가능 여부 @default false */
  editable?: boolean
  /** 입력 타입 @default 'text' */
  type?: 'text' | 'number' | 'date' | 'select' | 'textarea'
  /** select 옵션 @example [{label: '남성', value: 'M'}] */
  options?: Array<{ label: string; value: any }>
  /** 값 포맷팅 함수 @example (val) => val ? '예' : '아니오' */
  formatter?: (value: any) => string
}

// ============================================
// 유틸리티 타입
// ============================================

/** 선택된 행 (null이면 선택 없음) */
export type SelectedRow = Record<string, any> | null

// ============================================
// 이벤트 타입
// ============================================

/** 행 선택 이벤트 @event row-select */
export interface RowSelectEvent {
  /** 선택된 행 데이터 */
  row: any
  /** 행 인덱스 (0부터) */
  index: number
}

/** 필터 변경 이벤트 @event filter-change */
export interface FilterChangeEvent {
  /** 현재 필터 값들 @example { status: 'active', keyword: '홍길동' } */
  filters: Record<string, any>
}

/** 정렬 변경 이벤트 @event sort-change */
export interface SortChangeEvent {
  /** 정렬 컬럼 키 */
  column: string
  /** 정렬 방향 (null은 정렬 해제) */
  direction: 'asc' | 'desc' | null
}

/** 페이지 변경 이벤트 @event page-change */
export interface PageChangeEvent {
  /** 이동할 페이지 번호 */
  page: number
  /** 페이지당 항목 수 */
  pageSize: number
}
