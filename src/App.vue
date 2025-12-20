<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
</script>

<template>
  <div id="app" class="p-8 text-center">
    <h1 class="text-4xl font-bold mb-4">Vue DB Viewer</h1>
    <p class="text-gray-600 mb-6">Database viewer library for Vue 3</p>

    <div class="flex gap-4 justify-center">
      <el-button type="primary">Element Plus Button</el-button>
      <el-button :icon="Check">With Icon</el-button>
    </div>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
