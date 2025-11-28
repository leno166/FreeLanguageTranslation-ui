<script setup lang="ts">
import { useSettingStore } from '@/stores/counter.ts'
import { useDark, usePreferredDark } from '@vueuse/core'
import { watch } from 'vue'


const settingStore = useSettingStore()

const preferredDark = usePreferredDark()  // 获取系统偏好

// 使用 useDark 但手动控制
const setTheme = useDark({
  storageKey: 'useDarkKey',
  valueLight: 'light',
  valueDark: 'dark'
})
// 监听主题变化，应用对应的主题
watch(() => settingStore.theme, (newVal: string) => {
  if (newVal === '跟随系统') {
    // 跟随系统偏好
    setTheme.value = preferredDark.value
  } else if (newVal === '浅色') {
    setTheme.value = false
  } else if (newVal === '深色') {
    setTheme.value = true
  }
}, { immediate: true })

// 监听系统主题变化，如果当前是"跟随系统"模式，则更新
watch(preferredDark, (newVal: boolean) => {
  if (settingStore.theme === '跟随系统') {
    setTheme.value = newVal
  }
})
</script>

<template>
  <div id="app">
    <!-- 路由出口，根据路由渲染不同的页面 -->
    <router-view />
  </div>
</template>

<style scoped>

</style>
