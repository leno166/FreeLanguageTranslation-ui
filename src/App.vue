<script setup lang="ts">
import UiMain from '@/views/ui-main.vue'
import { ref } from 'vue'
import {
  Setting,
  Histogram,
  Star
} from '@element-plus/icons-vue'
import { useHistoryStore } from '@/stores/counter.ts'

// 历史记录列表
const historyStore = useHistoryStore()
const historyDialogVisible = ref(false)

const handleRowClick = (row: { sourceText: string }) => {
  uiMainRef.value?.setInput(row.sourceText)
  historyDialogVisible.value = false
}

// 点击设置, 主要区域切换到另一个页面. 再点击切换回来

// 简洁模式状态
const simpleMode = ref(false)

// 主内容区域
const selectedOption = ref('en-cn')
const optionList = [
  { label: '自动检测', value: 'auto-detect' },
  { label: '英汉互译', value: 'en-cn' },
  { label: '法汉互译', value: 'fr-cn' }
]

const uiMainRef = ref<InstanceType<typeof UiMain> | null>(null)

</script>

<template>
  <el-container class="main-container">

    <!-- 顶部控制栏 - 只包含图标 -->
    <el-header height="40px" style="display: flex; justify-content: flex-end">
      <!-- 使用 el-space 自动处理间距和右对齐 -->
      <el-space size="small" :fill="false">
        <!-- 左侧图标区域 -->
        <!-- 历史和设置图标 -->
        <el-icon class="header-icon" :size="24"
                 @click="historyDialogVisible = !historyDialogVisible">
          <Histogram />
        </el-icon>

        <el-divider direction="vertical" />

        <el-icon class="header-icon" :size="24">
          <Setting />
        </el-icon>

        <!-- 关键：插入一个弹性占位块，撑开间距 -->
        <div style="width: 24px"></div>

        <!-- 简洁模式图标 -->
        <el-icon
          class="header-icon"
          :size="24"
          :color="simpleMode ? '#409EFF' : ''"
          @click="simpleMode = !simpleMode"
        >
          <Star />
        </el-icon>
      </el-space>


    </el-header>

    <!-- 主内容区域 -->
    <el-main height="70px" class="centered-content">
      <!-- 下拉菜单放在主内容区域 -->
      <el-row>
        <el-col :xs="5" :sm="3" :md="3" :lg="2" :xl="2">
          <el-select v-model="selectedOption" size="small" style="margin-bottom: 12px">
            <el-option
              v-for="option in optionList"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-col>
      </el-row>

      <UiMain ref="uiMainRef"></UiMain>
    </el-main>


  </el-container>

  <!-- ✅ 历史记录弹窗 -->
  <el-dialog
    v-model="historyDialogVisible"
    title="历史记录"
    width="400px"
    append-to-body
  >
    <el-empty
      v-if="historyStore.list.length === 0"
      description="暂无历史记录"
    />

    <el-table
      v-else
      :data="historyStore.list"
      style="width: 100%"
      max-height="300"
      stripe
      :show-header="false" @row-click="handleRowClick"
    >
      <!-- 只显示 from 字段 -->
      <el-table-column min-width="120" key="sourceText">
        <template #default="{row}">
          {{
            row.sourceText.length > 10 ? row.sourceText.substring(0, 7) + '...' : row.sourceText
          }}
        </template>
      </el-table-column>

      <!-- to 列不写，就不会显示 -->
    </el-table>

  </el-dialog>

</template>
