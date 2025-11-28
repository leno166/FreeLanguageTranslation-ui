<script setup lang="ts">
import HeaderIcons from '@/components/HeaderIcons.vue'
</script>

<template>
  <el-container style=" overflow: hidden">
    <!-- 顶部控制栏 - 只包含图标 -->
    <el-header  style="display: flex; justify-content: flex-end; ">
      <HeaderIcons></HeaderIcons>
    </el-header>

    <!-- 主内容区域 -->
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>


