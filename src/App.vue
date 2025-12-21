<script setup lang="ts">
import { ref } from 'vue'
import VueDBViewer from './components/VueDBViewer.vue'
import type { VueDBViewerConfig, SelectedRow } from './types'

// 선택된 행
const selectedRow = ref<SelectedRow>(null)

// 샘플 데이터
const sampleData = [
  { id: 1, name: '홍길동', email: 'hong@example.com', status: '활성' },
  { id: 2, name: '김철수', email: 'kim@example.com', status: '활성' },
  { id: 3, name: '이영희', email: 'lee@example.com', status: '비활성' },
  { id: 4, name: '박민수', email: 'park@example.com', status: '활성' },
  { id: 5, name: '최지우', email: 'choi@example.com', status: '활성' },
  { id: 6, name: '정수진', email: 'jung@example.com', status: '비활성' },
  { id: 7, name: '강동원', email: 'kang@example.com', status: '활성' },
  { id: 8, name: '송중기', email: 'song@example.com', status: '활성' },
]

// 뷰어 설정
const config: VueDBViewerConfig = {
  // 레이아웃 설정
  layout: {
    splitRatio: 0.5,
    resizable: true,
  },

  // 왼쪽 패널 설정
  leftPanel: {
    collapsible: true,
    width: 280,
    sections: [
      {
        id: 'search',
        title: '검색',
      },
    ],
  },

  // 마스터 테이블 설정
  master: {
    dataSource: '/api/users',
    rowKey: 'id',
    selectionMode: 'single',
    columns: [
      { key: 'id', label: 'ID', width: 80, align: 'center' },
      { key: 'name', label: '이름', sortable: true },
      { key: 'email', label: '이메일' },
      { key: 'status', label: '상태' },
    ],
    pagination: {
      pageSize: 20,
      pageSizes: [10, 20, 50, 100],
    },
  },

  // 디테일 패널 설정
  detail: {
    editable: true,
    tabs: [
      {
        id: 'info',
        label: '기본 정보',
        fields: [
          { key: 'name', label: '이름', editable: true },
          { key: 'email', label: '이메일', editable: true },
        ],
      },
    ],
    actions: [
      { label: '수정', action: 'edit', type: 'primary' },
      { label: '삭제', action: 'delete', type: 'danger' },
    ],
  },
}

// 이벤트 핸들러
const handleRowSelect = (payload: { row: any; index: number }) => {
  console.log('행 선택:', payload)
}
</script>

<template>
  <VueDBViewer
    :config="config"
    :data="sampleData"
    v-model:selected-row="selectedRow"
    @row-select="handleRowSelect"
  >
    <template #header>
      <div class="px-6 py-4">
        <h1 class="text-2xl font-bold text-gray-800">Vue DB Viewer Demo</h1>
        <p class="text-sm text-gray-500 mt-1">마스터-디테일 패턴 데이터베이스 뷰어</p>
      </div>
    </template>

    <template #footer>
      <div class="px-6 py-3 text-sm text-gray-500 text-center">
        Vue DB Viewer v0.0.1 - Made with Vue 3 + Element Plus + Tailwind CSS
      </div>
    </template>
  </VueDBViewer>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
}
</style>
