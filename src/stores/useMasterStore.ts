import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sampleUsers } from '../data/sampleData'
import type { SelectedRow } from '../types'

/**
 * useMasterStore - 마스터 테이블 상태 관리 Store
 *
 * 마스터 테이블의 데이터, 선택된 행, 로딩 상태 등을 관리합니다.
 *
 * @example
 * import { useMasterStore } from '@/stores/useMasterStore'
 *
 * const masterStore = useMasterStore()
 * masterStore.selectRow(row, index)
 */
export const useMasterStore = defineStore('master', () => {
  // State

  /** 마스터 테이블 데이터
   *
   * 마스터 테이블에 표시할 전체 데이터를 저장합니다.
   *
   * @default sampleUsers
   * @example
   * data.value = [{ id: 1, name: '김철수', ... }, ...]
   */
  const data = ref<any[]>(sampleUsers)

  /**
   * 선택된 행
   *
   * 현재 사용자가 선택한 행의 데이터를 저장합니다.
   *
   * @default null
   * @example
   * selectedRow.value = { id: 2, name: '이영희', email: 'lee@example.com', status: '비활성' }
   */
  const selectedRow = ref<SelectedRow>(null)

  /**
   * 선택된 행의 인덱스
   *
   * 선택된 행이 데이터 배열에서 몇 번째 위치인지를 저장합니다. (0부터 시작)
   *
   * @default -1 (선택 없음)
   * @example
   * selectedIndex.value = 3 // 4번째 행이 선택됨
   */
  const selectedIndex = ref<number>(-1)

  /**
   * 로딩 상태
   *
   * 데이터 로딩 중인지 여부를 나타내며, 로딩 스피너 표시 여부를 결정합니다.
   *
   * @default false
   * @example
   * isLoading.value = true // 로딩 시작
   */
  const isLoading = ref(false)

  /**
   * 정렬 컬럼
   *
   * 현재 어떤 컬럼으로 정렬되어 있는지를 저장합니다.
   *
   * @default null (정렬 안 함)
   * @example
   * sortColumn.value = 'name' // 이름 컬럼으로 정렬 중
   */
  const sortColumn = ref<string | null>(null)

  /**
   * 정렬 방향
   *
   * 데이터를 오름차순 또는 내림차순으로 정렬할지 결정합니다.
   * - 'asc': 오름차순 (1, 2, 3... / A, B, C...)
   * - 'desc': 내림차순 (3, 2, 1... / Z, Y, X...)
   * - null: 정렬 없음
   *
   * @default null
   * @example
   * sortDirection.value = 'asc' // 오름차순 정렬
   */
  const sortDirection = ref<'asc' | 'desc' | null>(null)

  // Getters (계산된 값)

  /**
   * 정렬된 데이터
   *
   * 정렬 설정(컬럼, 방향)에 따라 자동으로 정렬된 데이터를 반환합니다.
   *
   * @example
   * // sortColumn='name', sortDirection='asc'일 때
   * sortedData.value // [{ name: '강동원' }, { name: '김철수' }, ...]
   */
  const sortedData = computed(() => {
    if (!sortColumn.value || !sortDirection.value) {
      return data.value
    }

    const sorted = [...data.value].sort((a, b) => {
      const aVal = a[sortColumn.value!]
      const bVal = b[sortColumn.value!]

      if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  })

  /**
   * 선택된 행이 있는지 여부
   *
   * 현재 선택된 행이 있는지 확인합니다.
   *
   * @example
   * hasSelection.value // true (행이 선택됨) 또는 false (선택 없음)
   */
  const hasSelection = computed(() => selectedRow.value !== null)

  // Actions

  /**
   * 행 선택
   *
   * 사용자가 클릭한 행을 선택 상태로 설정합니다.
   *
   * @param row - 선택된 행 데이터
   * @param index - 선택된 행의 인덱스
   * @example
   * selectRow({ id: 1, name: '홍길동', email: 'hong@example.com', status: '활성' }, 0)
   */
  function selectRow(row: any, index: number) {
    selectedRow.value = row
    selectedIndex.value = index
  }

  /**
   * 선택 해제
   *
   * 현재 선택된 행을 해제하고 초기 상태로 되돌립니다.
   *
   * @example
   * clearSelection() // selectedRow: null, selectedIndex: -1
   */
  function clearSelection() {
    selectedRow.value = null
    selectedIndex.value = -1
  }

  /**
   * 데이터 설정
   *
   * 새로운 데이터로 교체하고 선택 상태를 초기화합니다.
   *
   * @param newData - 새로운 데이터 배열
   * @example
   * setData([{ id: 1, name: '새 데이터' }])
   */
  function setData(newData: any[]) {
    data.value = newData
    clearSelection()
  }

  /**
   * 정렬 설정
   *
   * 테이블의 정렬 컬럼과 방향을 설정합니다.
   *
   * @param column - 정렬할 컬럼명
   * @param direction - 정렬 방향 ('asc', 'desc', null)
   * @example
   * setSort('name', 'asc') // 이름 컬럼을 오름차순으로 정렬
   */
  function setSort(column: string | null, direction: 'asc' | 'desc' | null) {
    sortColumn.value = column
    sortDirection.value = direction
  }

  /**
   * 로딩 상태 설정
   *
   * 데이터 로딩 중 여부를 설정합니다.
   *
   * @param loading - 로딩 여부
   * @example
   * setLoading(true) // 로딩 시작
   */
  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  /**
   * API에서 데이터 로드
   *
   * 지정된 URL에서 데이터를 가져와 테이블에 설정합니다.
   *
   * @param url - API URL
   * @example
   * await fetchData('/api/users')
   */
  async function fetchData(url: string) {
    setLoading(true)
    try {
      // TODO: 실제 API 호출 구현
      const response = await fetch(url)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    // State
    data,
    selectedRow,
    selectedIndex,
    isLoading,
    sortColumn,
    sortDirection,

    // Getters
    sortedData,
    hasSelection,

    // Actions
    selectRow,
    clearSelection,
    setData,
    setSort,
    setLoading,
    fetchData,
  }
})
