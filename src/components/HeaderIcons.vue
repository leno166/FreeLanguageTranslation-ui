<script setup lang="ts">
import { Histogram, Rank, Setting } from '@element-plus/icons-vue'
import { useHistoryStore, useTranslationStore } from '@/stores/counter.ts'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const historyStore = useHistoryStore()
const translationStore = useTranslationStore()

// 历史记录列表
const historyDialogVisible = ref(false)

const handleRowClick = (row: { sourceText: string }) => {
  translationStore.setInputText(row.sourceText)
  historyDialogVisible.value = false
}

// 主页面和设置页面跳转
const route = useRoute()
const router = useRouter()

// 判断当前是否在设置页面
const isSettingPage = computed(() => route.name === 'setting')
// 设置图标颜色
const settingIconColor = computed(() => isSettingPage.value ? 'var(--el-color-primary)' : '')

// 点击设置图标
const handleSettingCLick = () => {
  if (isSettingPage.value) {
    // 如果在设置页，跳转回首页
    router.push('/')
  } else {
    // 如果不在设置页，跳转到设置页
    router.push('/setting')
  }
}
</script>

<template>
  <!-- 使用 el-space 自动处理间距和右对齐 -->
  <el-space size="small" :fill="false">

    <!-- 左侧图标区域 -->
    <!-- 历史记录图标 -->
    <el-tooltip content="历史记录" placement="bottom" :show-after="100">
    <el-icon class="header-icon" :size="24"
             @click="historyDialogVisible = !historyDialogVisible">
      <Histogram />
    </el-icon>
      </el-tooltip>

    <el-divider direction="vertical" />

     <!-- 设置图标 -->
    <el-tooltip content="设置" placement="bottom" :show-after="100">
    <el-icon class="header-icon" :size="24" :style="{color: settingIconColor}"
             @click="handleSettingCLick">
      <Setting />
    </el-icon>
      </el-tooltip>

    <!-- 关键：插入一个弹性占位块，撑开间距 -->
    <div style="width: 12px"></div>

    <!-- mini 窗口图标 -->
    <el-tooltip content="mini 窗口" placement="bottom" :show-after="100">
    <el-icon class="header-icon" :size="24">
      <Rank />
    </el-icon>
      </el-tooltip>
  </el-space>

  <!-- 额外区域, ✅ 历史记录弹窗 -->
  <el-dialog
    v-model="historyDialogVisible"
    title="历史记录" width="400px" append-to-body>

    <el-empty description="暂无历史记录"
              v-if="historyStore.list.length === 0" />

    <el-table style="width: 100%" max-height="300" stripe
              v-else
              :data="historyStore.list" :show-header="false" @row-click="handleRowClick">
      <!-- 只显示 sourceText 字段 -->
      <el-table-column min-width="120" key="sourceText">
        <template #default="{row}">
          {{
            row.sourceText.length > 10 ? row.sourceText.substring(0, 8) + '...' : row.sourceText
          }}
        </template>
      </el-table-column>

      <!-- to 列不写，就不会显示 -->
    </el-table>

  </el-dialog>

</template>


