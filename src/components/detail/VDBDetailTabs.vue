<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMasterStore } from '../../stores/useMasterStore';

const masterStore = useMasterStore()
const { selectedRow } = storeToRefs(masterStore)

const props = defineProps()
const activeTab = ref('tab1')
</script>

<template>

<el-tabs v-model="activeTab">
  <el-tab-pane label="기본 정보" name="tab1">
    <div>ID: {{ selectedRow?.id }}</div>
    <div>이름: {{ selectedRow?.name }}</div>
  </el-tab-pane>
  <el-tab-pane label="상세 정보" name="tab2">
    <div>이메일: {{ selectedRow?.email }}</div>
    <div>상태: {{ selectedRow?.status }}</div>
  </el-tab-pane>
  <el-tab-pane label="추가 정보" name="tab3">
    <pre>{{ JSON.stringify(selectedRow, null, 2) }}</pre>
  </el-tab-pane>
</el-tabs>
</template>