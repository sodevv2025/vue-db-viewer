<script setup lang="ts">
import VueDBViewer from './components/VueDBViewer.vue'
import type { VueDBViewerConfig } from './types'

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
</script>

<template>
  <VueDBViewer :config="config">
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
