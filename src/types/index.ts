/**
 * types/index.ts - Vue DB Viewer 타입 정의 파일
 *
 * 이 파일은 전체 라이브러리에서 사용되는 모든 TypeScript 타입을 정의합니다.
 *
 * 목적:
 * - 타입 안전성: 컴파일 타임에 오류 발견
 * - 자동완성: IDE에서 속성 제안
 * - 문서화: 각 속성의 의미와 사용법 설명
 * - 일관성: 전체 프로젝트에서 동일한 구조 사용
 */

// ============================================
// Vue DB Viewer 전체 설정
// ============================================

/**
 * VueDBViewerConfig - 뷰어의 최상위 설정 타입
 *
 * 이 인터페이스는 전체 뷰어를 구성하는 모든 설정을 담습니다.
 *
 * 구조:
 * - layout: 화면 배치 (선택사항)
 * - leftPanel: 검색/필터 패널 (선택사항)
 * - master: 마스터 테이블 (필수)
 * - detail: 디테일 패널 (선택사항)
 *
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
  /**
   * layout - 레이아웃 설정 (선택사항)
   *
   * 마스터와 디테일의 화면 분할 방식을 정의합니다.
   *
   * ?: 물음표의 의미
   * - 선택적 속성 (Optional Property)
   * - 이 속성을 제공하지 않아도 됨
   * - 제공하지 않으면 기본값 사용
   *
   * 타입: LayoutConfig 인터페이스
   * 기본값: { splitRatio: 0.5, resizable: true, ... }
   */
  layout?: LayoutConfig

  /**
   * leftPanel - 왼쪽 패널 설정 (선택사항)
   *
   * 검색과 필터 UI를 표시할 왼쪽 패널을 정의합니다.
   *
   * 타입: LeftPanelConfig 인터페이스
   * 생략 시: 왼쪽 패널이 표시되지 않음
   */
  leftPanel?: LeftPanelConfig

  /**
   * master - 마스터 테이블 설정 (필수)
   *
   * 데이터 목록을 표시하는 메인 테이블을 정의합니다.
   *
   * ?: 없음 = 필수 속성
   * - 반드시 제공해야 함
   * - 없으면 TypeScript 컴파일 에러
   *
   * 타입: MasterConfig 인터페이스
   *
   * 왜 필수?
   * - 뷰어의 핵심 기능
   * - 이것 없이는 뷰어가 의미 없음
   */
  master: MasterConfig

  /**
   * detail - 디테일 패널 설정 (선택사항)
   *
   * 선택된 행의 상세 정보를 표시할 패널을 정의합니다.
   *
   * 타입: DetailConfig 인터페이스
   * 생략 시: 디테일 패널 없이 마스터만 전체 화면 사용
   */
  detail?: DetailConfig
}

// ============================================
// 메인 섹션 설정
// ============================================

/**
 * LayoutConfig - 레이아웃 설정
 *
 * 화면의 공간 배분과 리사이징 동작을 정의합니다.
 *
 * @example
 * {
 *   splitRatio: 0.6,      // 마스터 60%, 디테일 40%
 *   resizable: true       // 드래그로 조절 가능
 * }
 */
export interface LayoutConfig {
  /**
   * splitRatio - 좌우 분할 비율
   *
   * 타입: number (0~1 사이의 소수)
   * 기본값: 0.5 (50:50)
   *
   * 의미:
   * - 0.5 = 마스터 50%, 디테일 50%
   * - 0.6 = 마스터 60%, 디테일 40%
   * - 0.3 = 마스터 30%, 디테일 70%
   *
   * 주의:
   * - 0보다 작거나 1보다 크면 안 됨
   * - minMasterWidth, minDetailWidth와 함께 작동
   *
   * @default 0.5
   * @example 0.6
   */
  splitRatio?: number

  /**
   * minMasterWidth - 마스터 테이블 최소 너비
   *
   * 타입: number (픽셀 단위)
   * 기본값: 400
   *
   * 의미:
   * - 마스터 테이블이 이보다 작아지지 않음
   * - 리사이저를 드래그해도 이 너비 이하로 줄어들지 않음
   *
   * 왜 필요?
   * - 너무 좁으면 테이블을 읽을 수 없음
   * - 최소한의 사용성 보장
   *
   * @default 400
   */
  minMasterWidth?: number

  /**
   * minDetailWidth - 디테일 패널 최소 너비
   *
   * 타입: number (픽셀 단위)
   * 기본값: 400
   *
   * 의미:
   * - 디테일 패널이 이보다 작아지지 않음
   * - 상세 정보를 읽기 위한 최소 공간 확보
   *
   * @default 400
   */
  minDetailWidth?: number

  /**
   * resizable - 리사이저 활성화 여부
   *
   * 타입: boolean
   * 기본값: true
   *
   * 의미:
   * - true: 중간에 드래그 가능한 리사이저 바 표시
   * - false: 고정 비율, 사용자가 조절 불가
   *
   * 용도:
   * - 사용자에게 화면 조절 권한 부여
   * - 또는 고정 레이아웃 강제
   *
   * @default true
   */
  resizable?: boolean
}

/**
 * LeftPanelConfig - 왼쪽 패널 설정
 *
 * 검색과 필터를 표시할 사이드 패널을 정의합니다.
 *
 * @example
 * {
 *   collapsible: true,    // 접기 가능
 *   width: 280,           // 280px 너비
 *   sections: [...]       // 섹션 목록
 * }
 */
export interface LeftPanelConfig {
  /**
   * collapsible - 접기/펼치기 가능 여부
   *
   * 타입: boolean
   * 기본값: true
   *
   * 의미:
   * - true: 토글 버튼이 표시되고 패널을 숨길 수 있음
   * - false: 항상 표시됨
   *
   * 동작:
   * - 접으면: 패널이 숨겨지고 마스터/디테일이 넓어짐
   * - 펼치면: 패널이 나타나고 공간 차지
   *
   * @default true
   */
  collapsible?: boolean

  /**
   * width - 패널 너비
   *
   * 타입: number (픽셀 단위)
   * 기본값: 280
   *
   * 의미:
   * - 패널이 차지할 고정 너비
   * - 이 너비만큼 마스터/디테일 공간이 줄어듦
   *
   * 권장값:
   * - 너무 좁으면 (< 200px): 필터 UI가 답답함
   * - 너무 넓으면 (> 400px): 메인 컨텐츠 공간 부족
   *
   * @default 280
   */
  width?: number

  /**
   * sections - 섹션 목록
   *
   * 타입: PanelSection[] (배열)
   *
   * 의미:
   * - 패널을 여러 섹션으로 나눔
   * - 각 섹션은 제목과 필터들을 가짐
   *
   * 예:
   * - 섹션 1: 검색 (텍스트 검색)
   * - 섹션 2: 필터 (상태, 날짜 범위 등)
   * - 섹션 3: 설정 (컬럼 표시/숨김 등)
   */
  sections?: PanelSection[]
}

/**
 * MasterConfig - 마스터 테이블 설정
 *
 * 데이터 목록을 표시하는 메인 테이블의 모든 동작을 정의합니다.
 *
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
  /**
   * dataSource - 데이터 소스
   *
   * 타입: string | any[]
   * - string: API URL ('/api/users')
   * - any[]: 직접 제공하는 배열 데이터
   *
   * string인 경우:
   * - 이 URL로 fetch 요청
   * - JSON 응답을 테이블 데이터로 사용
   *
   * any[]인 경우:
   * - 직접 제공한 배열을 바로 사용
   * - API 호출 없음
   *
   * @example '/api/users'
   * @example [{ id: 1, name: '홍길동' }, ...]
   */
  dataSource: string | any[]

  /**
   * rowKey - 행 고유 키 필드명
   *
   * 타입: string
   * 필수: 반드시 제공해야 함
   *
   * 의미:
   * - 각 행을 구분하는 고유한 필드 이름
   * - 이 필드의 값은 중복되면 안 됨
   *
   * 사용처:
   * - Vue의 :key 속성
   * - 행 선택/업데이트 추적
   * - 성능 최적화
   *
   * 예:
   * - rowKey: 'id' → row.id를 고유 키로 사용
   * - rowKey: 'userId' → row.userId를 고유 키로 사용
   *
   * @example 'id'
   */
  rowKey: string

  /**
   * selectionMode - 행 선택 모드
   *
   * 타입: 'single' | 'multiple' | 'none'
   * 기본값: 'single'
   *
   * 값 설명:
   * - 'single': 한 번에 하나만 선택 (라디오 버튼)
   *   - 새 행 클릭 시 이전 선택 해제
   *   - 가장 일반적인 마스터-디테일 패턴
   *
   * - 'multiple': 여러 개 선택 가능 (체크박스)
   *   - Ctrl/Cmd + 클릭으로 다중 선택
   *   - 일괄 작업에 유용
   *
   * - 'none': 선택 불가
   *   - 단순 조회용 테이블
   *   - 디테일 패널 없이 사용
   *
   * @default 'single'
   */
  selectionMode?: 'single' | 'multiple' | 'none'

  /**
   * columns - 컬럼 정의 배열
   *
   * 타입: Column[] (배열)
   * 필수: 반드시 제공해야 함
   *
   * 의미:
   * - 테이블에 표시할 컬럼들의 목록
   * - 배열 순서대로 왼쪽부터 표시
   *
   * 각 컬럼은 다음을 정의:
   * - key: 데이터 필드명
   * - label: 헤더 제목
   * - sortable: 정렬 가능 여부
   * - width: 너비
   * - formatter: 값 변환 함수
   */
  columns: Column[]

  /**
   * pagination - 페이지네이션 설정
   *
   * 타입: PaginationConfig (인터페이스)
   * 선택사항
   *
   * 생략 시: 모든 데이터를 한 페이지에 표시
   * 제공 시: 데이터를 페이지로 나누어 표시
   *
   * 사용 예:
   * - 데이터가 수백 개 이상일 때
   * - 성능 최적화 필요할 때
   * - 사용자 경험 향상
   */
  pagination?: PaginationConfig

  /**
   * sortable - 정렬 기능 전역 활성화
   *
   * 타입: boolean
   * 기본값: false
   *
   * 의미:
   * - true: 모든 컬럼에서 정렬 가능 (개별 설정 무시)
   * - false: 각 컬럼의 sortable 속성 따름
   *
   * 참고:
   * - 개별 컬럼의 sortable: true가 더 세밀한 제어
   * - 이 속성은 전체를 한 번에 켜는 스위치
   *
   * @default false
   */
  sortable?: boolean
}

/**
 * DetailConfig - 디테일 패널 설정
 *
 * 선택된 행의 상세 정보를 표시하는 패널을 정의합니다.
 *
 * @example
 * {
 *   editable: true,
 *   tabs: [{ id: 'info', label: '기본 정보', fields: [...] }],
 *   actions: [{ label: '수정', action: 'edit', type: 'primary' }]
 * }
 */
export interface DetailConfig {
  /**
   * editable - 편집 모드 활성화
   *
   * 타입: boolean
   * 기본값: false
   *
   * 의미:
   * - true: 필드를 입력 가능한 폼으로 표시
   *   - 텍스트 필드 → input
   *   - select 필드 → dropdown
   *   - 수정/저장 버튼 활성화
   *
   * - false: 읽기 전용 모드
   *   - 모든 필드가 정적 텍스트
   *   - 조회만 가능
   *
   * 용도:
   * - CRUD 작업이 필요한 경우 true
   * - 단순 조회만 필요하면 false
   *
   * @default false
   */
  editable?: boolean

  /**
   * tabs - 탭 목록
   *
   * 타입: DetailTab[] (배열)
   * 선택사항
   *
   * 의미:
   * - 상세 정보를 여러 탭으로 나눔
   * - 각 탭은 다른 종류의 정보 표시
   *
   * 일반적인 구성:
   * - 탭 1: 기본 정보 (fields)
   * - 탭 2: 관련 데이터 (dataSource + columns)
   * - 탭 3: 활동 로그 (custom component)
   *
   * 생략 시: 단일 뷰로 표시
   */
  tabs?: DetailTab[]

  /**
   * actions - 액션 버튼 목록
   *
   * 타입: DetailAction[] (배열)
   * 선택사항
   *
   * 의미:
   * - 디테일 패널 하단에 표시될 버튼들
   * - 각 버튼은 특정 작업 수행
   *
   * 일반적인 액션:
   * - 수정: 편집 모드 전환
   * - 삭제: 데이터 삭제
   * - 저장: 변경사항 저장
   * - 취소: 변경사항 취소
   *
   * 생략 시: 액션 버튼 없음
   */
  actions?: DetailAction[]
}

// ============================================
// 하위 설정
// ============================================

/**
 * PanelSection - 패널 섹션 (필터 그룹)
 *
 * 왼쪽 패널 내의 하나의 섹션을 정의합니다.
 *
 * @example
 * {
 *   id: 'search',
 *   title: '검색',
 *   filters: [...]
 * }
 */
export interface PanelSection {
  /**
   * id - 섹션 고유 식별자
   *
   * 타입: string
   * 필수
   *
   * 의미:
   * - 섹션을 구분하는 고유한 ID
   * - 내부적으로 섹션 추적에 사용
   *
   * 규칙:
   * - 같은 패널 내에서 중복 불가
   * - 영문 소문자 권장
   *
   * @example 'search'
   * @example 'filters'
   * @example 'advanced-options'
   */
  id: string

  /**
   * title - 섹션 제목
   *
   * 타입: string
   * 필수
   *
   * 의미:
   * - 사용자에게 보이는 섹션 이름
   * - 섹션 상단에 표시
   *
   * @example '검색'
   * @example '필터'
   * @example '고급 옵션'
   */
  title: string

  /**
   * filters - 필터 목록
   *
   * 타입: Filter[] (배열)
   * 선택사항
   *
   * 의미:
   * - 이 섹션에 포함될 필터들
   * - 각 필터는 하나의 입력 UI
   *
   * 예:
   * - 텍스트 검색 필터
   * - 드롭다운 필터
   * - 날짜 범위 필터
   *
   * 생략 시: 필터 없는 빈 섹션
   */
  filters?: Filter[]
}

/**
 * Column - 테이블 컬럼 정의
 *
 * 테이블의 한 컬럼이 어떻게 표시되고 동작할지 정의합니다.
 *
 * @example
 * {
 *   key: 'name',
 *   label: '이름',
 *   sortable: true,
 *   width: 150
 * }
 */
export interface Column {
  /**
   * key - 데이터 필드명
   *
   * 타입: string
   * 필수
   *
   * 의미:
   * - 데이터 객체의 어떤 필드를 표시할지
   * - row[key] 값을 셀에 표시
   *
   * 예:
   * - key: 'name' → row.name 표시
   * - key: 'user.email' → row.user.email 표시 (중첩 가능)
   *
   * @example 'name'
   * @example 'email'
   * @example 'createdAt'
   */
  key: string

  /**
   * label - 컬럼 헤더 레이블
   *
   * 타입: string
   * 필수
   *
   * 의미:
   * - 테이블 헤더에 표시될 컬럼 이름
   * - 사용자가 보는 제목
   *
   * @example '이름'
   * @example 'Email Address'
   * @example '등록일'
   */
  label: string

  /**
   * sortable - 정렬 가능 여부
   *
   * 타입: boolean
   * 기본값: false
   *
   * 의미:
   * - true: 헤더 클릭으로 정렬 가능
   *   - 헤더에 정렬 아이콘 표시
   *   - 오름차순 → 내림차순 → 정렬 해제 순환
   *
   * - false: 정렬 불가
   *   - 헤더 클릭해도 아무 일 없음
   *
   * @default false
   */
  sortable?: boolean

  /**
   * width - 컬럼 너비
   *
   * 타입: number | string
   * 선택사항
   *
   * 값 형식:
   * - number: 픽셀 단위 (100 = 100px)
   * - string: CSS 값 ('150px', '20%', 'auto')
   *
   * 생략 시: 자동 조절
   * - 내용에 따라 적절히 분배
   *
   * @example 100
   * @example '150px'
   * @example '20%'
   */
  width?: number | string

  /**
   * minWidth - 컬럼 최소 너비
   *
   * 타입: number | string
   * 선택사항
   *
   * 의미:
   * - 컬럼이 이보다 작아지지 않음
   * - 브라우저 크기 조절 시에도 유지
   *
   * 용도:
   * - 내용이 잘리지 않도록 보장
   * - 중요한 컬럼의 가독성 확보
   *
   * @example 100
   * @example '80px'
   */
  minWidth?: number | string

  /**
   * align - 정렬 방향
   *
   * 타입: 'left' | 'center' | 'right'
   * 기본값: 'left'
   *
   * 의미:
   * - 셀 내용의 가로 정렬
   *
   * 권장 사용:
   * - 'left': 텍스트 (이름, 설명 등)
   * - 'center': 짧은 값 (상태, 아이콘 등)
   * - 'right': 숫자 (금액, 수량 등)
   *
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right'

  /**
   * formatter - 값 포맷팅 함수
   *
   * 타입: (value: any, row: any) => string
   * 선택사항
   *
   * 의미:
   * - 원본 값을 화면에 표시하기 전에 변환
   * - 함수가 반환한 문자열을 셀에 표시
   *
   * 매개변수:
   * - value: 셀의 값 (row[key])
   * - row: 전체 행 데이터
   *
   * 사용 예:
   * - 날짜 포맷팅: (val) => new Date(val).toLocaleDateString()
   * - 금액 포맷팅: (val) => val.toLocaleString() + '원'
   * - 조건부 표시: (val, row) => row.isAdmin ? '관리자' : '일반'
   *
   * @example (val) => new Date(val).toLocaleDateString()
   */
  formatter?: (value: any, row: any) => string
}

/**
 * PaginationConfig - 페이지네이션 설정
 *
 * 데이터를 페이지 단위로 나누어 표시하는 기능을 정의합니다.
 *
 * @example
 * {
 *   pageSize: 20,
 *   pageSizes: [10, 20, 50],
 *   total: 1000
 * }
 */
export interface PaginationConfig {
  /**
   * pageSize - 페이지당 항목 수
   *
   * 타입: number
   * 기본값: 20
   *
   * 의미:
   * - 한 페이지에 표시할 행의 개수
   * - 이 숫자만큼씩 데이터를 나누어 표시
   *
   * 예:
   * - pageSize: 20, 데이터 100개
   *   → 총 5페이지 (20 × 5 = 100)
   *
   * @default 20
   */
  pageSize?: number

  /**
   * pageSizes - 선택 가능한 페이지 크기 옵션
   *
   * 타입: number[] (배열)
   * 기본값: [10, 20, 50, 100]
   *
   * 의미:
   * - 사용자가 선택할 수 있는 페이지 크기 목록
   * - 드롭다운 형태로 제공
   *
   * 동작:
   * - 사용자가 50을 선택하면 pageSize가 50으로 변경
   * - 페이지 수가 자동으로 재계산됨
   *
   * @default [10, 20, 50, 100]
   */
  pageSizes?: number[]

  /**
   * total - 전체 항목 수
   *
   * 타입: number
   * 선택사항
   *
   * 의미:
   * - 모든 데이터의 총 개수
   * - 페이지 수 계산에 사용
   *
   * 계산:
   * - 총 페이지 수 = Math.ceil(total / pageSize)
   * - 예: total 95, pageSize 20 → 5페이지
   *
   * 서버사이드 페이징:
   * - API 응답에서 total 받아옴
   *
   * 클라이언트사이드 페이징:
   * - 자동 계산 (데이터 배열 길이)
   */
  total?: number

  /**
   * currentPage - 현재 페이지 번호
   *
   * 타입: number
   * 기본값: 1
   *
   * 의미:
   * - 현재 표시 중인 페이지
   * - 1부터 시작 (0이 아님!)
   *
   * 동작:
   * - 사용자가 페이지 2 클릭
   *   → currentPage = 2
   *   → (2-1) × pageSize ~ 2 × pageSize 범위 표시
   *
   * @default 1
   */
  currentPage?: number
}

/**
 * DetailTab - 디테일 탭 정의
 *
 * 디테일 패널 내의 한 탭을 정의합니다.
 * 두 가지 타입의 탭이 가능합니다:
 * 1. 폼 탭: fields로 정의 (기본 정보 표시/편집)
 * 2. 테이블 탭: dataSource + columns (관련 데이터 표시)
 *
 * @example
 * // 폼 탭
 * {
 *   id: 'info',
 *   label: '기본 정보',
 *   fields: [{ key: 'name', label: '이름', editable: true }]
 * }
 *
 * @example
 * // 테이블 탭
 * {
 *   id: 'orders',
 *   label: '주문 내역',
 *   dataSource: (row) => `/api/users/${row.id}/orders`,
 *   columns: [...]
 * }
 */
export interface DetailTab {
  /**
   * id - 탭 고유 식별자
   *
   * 타입: string
   * 필수
   *
   * 의미:
   * - 탭을 구분하는 고유 ID
   * - 활성 탭 추적에 사용
   *
   * @example 'info'
   * @example 'orders'
   * @example 'activity-log'
   */
  id: string

  /**
   * label - 탭 레이블
   *
   * 타입: string
   * 필수
   *
   * 의미:
   * - 탭 버튼에 표시될 텍스트
   * - 사용자가 보는 탭 이름
   *
   * @example '기본 정보'
   * @example '주문 내역'
   * @example '활동 로그'
   */
  label: string

  /**
   * fields - 폼 필드 목록 (정보 탭용)
   *
   * 타입: DetailField[] (배열)
   * 선택사항
   *
   * 용도:
   * - 기본 정보를 폼 형태로 표시
   * - 각 필드는 label + value 쌍
   *
   * 예:
   * - 이름: [입력창]
   * - 이메일: [입력창]
   * - 상태: [드롭다운]
   *
   * 참고:
   * - fields와 dataSource는 배타적
   * - 둘 중 하나만 사용
   */
  fields?: DetailField[]

  /**
   * dataSource - 관련 데이터 API URL
   *
   * 타입: string | ((row: any) => string)
   * 선택사항
   *
   * 용도:
   * - 선택된 행과 관련된 추가 데이터 로드
   * - 1:N 관계의 데이터 표시
   *
   * 타입 1 - 고정 URL (string):
   * - 예: '/api/all-orders'
   *
   * 타입 2 - 함수 (row를 받아 URL 생성):
   * - 예: (row) => `/api/users/${row.id}/orders`
   * - 선택된 행의 ID로 동적 URL 생성
   *
   * @example (row) => `/api/users/${row.id}/orders`
   */
  dataSource?: string | ((row: any) => string)

  /**
   * columns - 관련 데이터 테이블 컬럼
   *
   * 타입: Column[] (배열)
   * 선택사항
   *
   * 용도:
   * - dataSource로 가져온 데이터를 테이블로 표시
   * - 마스터 테이블과 같은 방식
   *
   * 예:
   * - 주문 내역 탭
   *   - 컬럼: 주문번호, 날짜, 금액, 상태
   *
   * 참고:
   * - dataSource와 함께 사용
   * - dataSource 없이 columns만 있으면 무의미
   */
  columns?: Column[]

  /**
   * component - 커스텀 컴포넌트
   *
   * 타입: any (Vue 컴포넌트)
   * 선택사항
   *
   * 용도:
   * - 표준 폼/테이블이 아닌 완전 커스텀 UI
   * - fields, dataSource로 표현 불가능한 경우
   *
   * 예:
   * - 타임라인 컴포넌트
   * - 차트/그래프
   * - 이미지 갤러리
   *
   * 사용:
   * - import한 컴포넌트를 직접 전달
   * - 예: component: ActivityTimeline
   */
  component?: any
}

/**
 * DetailAction - 디테일 액션 버튼 정의
 *
 * 디테일 패널 하단에 표시될 액션 버튼을 정의합니다.
 *
 * @example
 * {
 *   label: '수정',
 *   action: 'edit',
 *   type: 'primary'
 * }
 */
export interface DetailAction {
  /**
   * label - 버튼 텍스트
   *
   * 타입: string
   * 필수
   *
   * 의미:
   * - 버튼에 표시될 텍스트
   * - 사용자가 보는 액션 이름
   *
   * @example '수정'
   * @example '삭제'
   * @example '저장'
   */
  label: string

  /**
   * action - 액션 이름 (이벤트명)
   *
   * 타입: string
   * 필수
   *
   * 의미:
   * - 버튼 클릭 시 emit할 이벤트 이름
   * - 부모 컴포넌트가 @action명="핸들러"로 받음
   *
   * 예:
   * - action: 'edit'
   *   → 버튼 클릭 시 'edit' 이벤트 발생
   *   → 부모: @edit="handleEdit"
   *
   * @example 'edit'
   * @example 'delete'
   * @example 'save'
   */
  action: string

  /**
   * type - 버튼 타입 (스타일)
   *
   * 타입: 'primary' | 'danger' | 'default'
   * 기본값: 'default'
   *
   * 의미:
   * - 버튼의 시각적 스타일
   *
   * 값 설명:
   * - 'primary': 주요 액션 (파란색)
   *   - 예: 저장, 확인, 수정
   *
   * - 'danger': 위험한 액션 (빨간색)
   *   - 예: 삭제, 제거
   *   - 사용자에게 경고 제공
   *
   * - 'default': 일반 액션 (회색)
   *   - 예: 취소, 닫기
   *
   * @default 'default'
   */
  type?: 'primary' | 'danger' | 'default'

  /**
   * icon - 아이콘 이름
   *
   * 타입: string
   * 선택사항
   *
   * 의미:
   * - 버튼에 표시할 아이콘
   * - 텍스트 왼쪽에 표시
   *
   * 값:
   * - Element Plus 아이콘 이름
   * - 예: 'Edit', 'Delete', 'Check'
   *
   * 생략 시: 아이콘 없이 텍스트만
   *
   * @example 'Edit'
   * @example 'Delete'
   */
  icon?: string
}

// ============================================
// 세부 타입
// ============================================

/**
 * Filter - 필터 정의
 *
 * 왼쪽 패널의 하나의 필터 입력을 정의합니다.
 *
 * @example
 * // 텍스트 검색
 * {
 *   key: 'keyword',
 *   type: 'text',
 *   label: '검색어',
 *   placeholder: '이름 또는 이메일'
 * }
 *
 * @example
 * // 드롭다운 선택
 * {
 *   key: 'status',
 *   type: 'select',
 *   label: '상태',
 *   options: [{label: '활성', value: 'active'}]
 * }
 */
export interface Filter {
  /**
   * key - 필터 키
   *
   * 타입: string
   * 필수
   *
   * 의미:
   * - 필터 값을 저장할 때 사용하는 키
   * - filters 객체의 속성명
   *
   * 예:
   * - key: 'status'
   *   → { status: 'active' }
   *
   * @example 'status'
   * @example 'keyword'
   * @example 'dateRange'
   */
  key: string

  /**
   * type - 필터 타입
   *
   * 타입: 'select' | 'daterange' | 'multiselect' | 'text'
   * 필수
   *
   * 값 설명:
   * - 'select': 드롭다운 (단일 선택)
   *   - options 필요
   *
   * - 'multiselect': 다중 선택 드롭다운
   *   - options 필요
   *   - 여러 값 선택 가능
   *
   * - 'daterange': 날짜 범위 선택
   *   - 시작일 ~ 종료일
   *
   * - 'text': 텍스트 입력
   *   - 검색어 입력
   */
  type: 'select' | 'daterange' | 'multiselect' | 'text'

  /**
   * label - 필터 레이블
   *
   * 타입: string
   * 필수
   *
   * 의미:
   * - 필터 입력 위에 표시될 레이블
   * - 사용자가 보는 필터 이름
   *
   * @example '상태'
   * @example '검색어'
   * @example '등록일'
   */
  label: string

  /**
   * options - select 옵션 목록
   *
   * 타입: Array<{ label: string; value: any }>
   * 선택사항 (select/multiselect 타입에서는 필수)
   *
   * 의미:
   * - 드롭다운에 표시될 선택지 목록
   *
   * 구조:
   * - label: 사용자에게 보이는 텍스트
   * - value: 실제 저장되는 값
   *
   * @example
   * [
   *   { label: '활성', value: 'active' },
   *   { label: '비활성', value: 'inactive' }
   * ]
   */
  options?: Array<{ label: string; value: any }>

  /**
   * placeholder - 플레이스홀더
   *
   * 타입: string
   * 선택사항
   *
   * 의미:
   * - 입력창이 비어있을 때 표시되는 힌트 텍스트
   * - 사용자 가이드 역할
   *
   * @example '검색어를 입력하세요'
   * @example '선택하세요'
   */
  placeholder?: string
}

/**
 * DetailField - 디테일 필드 정의
 *
 * 디테일 패널의 폼에 표시될 하나의 필드를 정의합니다.
 *
 * @example
 * // 텍스트 입력 필드
 * {
 *   key: 'name',
 *   label: '이름',
 *   editable: true,
 *   type: 'text'
 * }
 *
 * @example
 * // 드롭다운 필드
 * {
 *   key: 'status',
 *   label: '상태',
 *   editable: true,
 *   type: 'select',
 *   options: [{label: '남성', value: 'M'}]
 * }
 */
export interface DetailField {
  /**
   * key - 데이터 필드명
   *
   * 타입: string
   * 필수
   *
   * 의미:
   * - 선택된 행의 어떤 필드를 표시할지
   * - selectedRow[key] 값을 사용
   *
   * @example 'name'
   * @example 'email'
   * @example 'createdAt'
   */
  key: string

  /**
   * label - 필드 레이블
   *
   * 타입: string
   * 필수
   *
   * 의미:
   * - 필드 왼쪽에 표시될 레이블
   * - "이름: [입력창]" 형태
   *
   * @example '이름'
   * @example '이메일'
   * @example '등록일'
   */
  label: string

  /**
   * editable - 편집 가능 여부
   *
   * 타입: boolean
   * 기본값: false
   *
   * 의미:
   * - true: 입력 가능한 폼 컨트롤 (input, select 등)
   * - false: 읽기 전용 텍스트
   *
   * 참고:
   * - DetailConfig.editable이 false면 무시됨
   *
   * @default false
   */
  editable?: boolean

  /**
   * type - 입력 타입
   *
   * 타입: 'text' | 'number' | 'date' | 'select' | 'textarea'
   * 기본값: 'text'
   *
   * 값 설명:
   * - 'text': 일반 텍스트 입력 (<input type="text">)
   * - 'number': 숫자 입력 (<input type="number">)
   * - 'date': 날짜 선택 (Date Picker)
   * - 'select': 드롭다운 (<select>)
   *   - options 필요
   * - 'textarea': 여러 줄 텍스트 (<textarea>)
   *
   * @default 'text'
   */
  type?: 'text' | 'number' | 'date' | 'select' | 'textarea'

  /**
   * options - select 옵션
   *
   * 타입: Array<{ label: string; value: any }>
   * 선택사항 (type이 'select'일 때 필수)
   *
   * @example
   * [
   *   { label: '남성', value: 'M' },
   *   { label: '여성', value: 'F' }
   * ]
   */
  options?: Array<{ label: string; value: any }>

  /**
   * formatter - 값 포맷팅 함수
   *
   * 타입: (value: any) => string
   * 선택사항
   *
   * 의미:
   * - 읽기 전용 모드에서 값 변환
   * - editable이 false일 때만 사용
   *
   * 예:
   * - 날짜: (val) => new Date(val).toLocaleDateString()
   * - 불린: (val) => val ? '예' : '아니오'
   *
   * @example (val) => val ? '예' : '아니오'
   */
  formatter?: (value: any) => string
}

// ============================================
// 유틸리티 타입
// ============================================

/**
 * SelectedRow - 선택된 행 타입
 *
 * 타입: Record<string, any> | null
 *
 * 의미:
 * - Record<string, any>: 모든 속성을 가질 수 있는 객체
 *   - { id: 1, name: '홍길동', ... }
 *
 * - null: 선택된 행이 없음
 *   - 아직 아무것도 클릭하지 않은 상태
 *
 * 사용:
 * - const selectedRow = ref<SelectedRow>(null)
 * - if (selectedRow.value !== null) { ... }
 */
export type SelectedRow = Record<string, any> | null

// ============================================
// 이벤트 타입
// ============================================

/**
 * RowSelectEvent - 행 선택 이벤트
 *
 * 사용자가 테이블에서 행을 클릭했을 때 발생하는 이벤트의 데이터입니다.
 *
 * @event row-select
 */
export interface RowSelectEvent {
  /**
   * row - 선택된 행 데이터
   *
   * 타입: any (데이터 구조에 따라 다름)
   *
   * 내용:
   * - 클릭한 행의 전체 데이터
   * - { id: 2, name: '이영희', email: '...', ... }
   */
  row: any

  /**
   * index - 행 인덱스
   *
   * 타입: number
   *
   * 의미:
   * - 몇 번째 행인지 (0부터 시작)
   * - 0 = 첫 번째 행
   * - 1 = 두 번째 행
   */
  index: number
}

/**
 * FilterChangeEvent - 필터 변경 이벤트
 *
 * 사용자가 필터 값을 변경했을 때 발생하는 이벤트의 데이터입니다.
 *
 * @event filter-change
 */
export interface FilterChangeEvent {
  /**
   * filters - 현재 필터 값들
   *
   * 타입: Record<string, any>
   *
   * 구조:
   * - 키: 필터 key
   * - 값: 선택/입력된 값
   *
   * @example
   * {
   *   status: 'active',      // 상태 필터
   *   keyword: '홍길동',      // 검색어
   *   dateRange: [start, end] // 날짜 범위
   * }
   */
  filters: Record<string, any>
}

/**
 * SortChangeEvent - 정렬 변경 이벤트
 *
 * 사용자가 컬럼 헤더를 클릭하여 정렬을 변경했을 때 발생하는 이벤트의 데이터입니다.
 *
 * @event sort-change
 */
export interface SortChangeEvent {
  /**
   * column - 정렬 컬럼 키
   *
   * 타입: string
   *
   * 의미:
   * - 어떤 컬럼으로 정렬하는지
   *
   * @example 'name'
   * @example 'createdAt'
   */
  column: string

  /**
   * direction - 정렬 방향
   *
   * 타입: 'asc' | 'desc' | null
   *
   * 값 설명:
   * - 'asc': 오름차순 (1, 2, 3... / A, B, C...)
   * - 'desc': 내림차순 (3, 2, 1... / Z, Y, X...)
   * - null: 정렬 해제 (원본 순서)
   *
   * 순환:
   * - 클릭 1회: asc
   * - 클릭 2회: desc
   * - 클릭 3회: null (해제)
   */
  direction: 'asc' | 'desc' | null
}

/**
 * PageChangeEvent - 페이지 변경 이벤트
 *
 * 사용자가 페이지를 이동하거나 페이지 크기를 변경했을 때 발생하는 이벤트의 데이터입니다.
 *
 * @event page-change
 */
export interface PageChangeEvent {
  /**
   * page - 이동할 페이지 번호
   *
   * 타입: number
   *
   * 의미:
   * - 몇 번째 페이지인지 (1부터 시작)
   * - 1 = 첫 페이지
   * - 2 = 두 번째 페이지
   */
  page: number

  /**
   * pageSize - 페이지당 항목 수
   *
   * 타입: number
   *
   * 의미:
   * - 한 페이지에 몇 개를 표시할지
   * - 사용자가 드롭다운에서 선택한 값
   *
   * @example 20
   * @example 50
   */
  pageSize: number
}
