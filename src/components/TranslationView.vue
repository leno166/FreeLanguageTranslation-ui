<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useHistoryStore, useSettingStore, useTranslationStore } from '@/stores/counter.ts'

const historyStore = useHistoryStore()
const translationStore = useTranslationStore()
const settingStore = useSettingStore()

const input = computed({
  get: () => translationStore.inputText,
  set: (value: string) => translationStore.setInputText(value)
})

const activeTab = ref<string>('翻译')

// 监听 input 变化
watch(input, (newVal) => {
  translationStore.translate(newVal, historyStore)
})

// 解析结果数据, 实时响应.
const parsedResult = computed(() => {
  if (!translationStore.translationResult) return null

  // 尝试解析 json. 后端已处理
  return JSON.parse(translationStore.translationResult)
})


// 动态生成标签页配置
const tabs = computed(() => {
  if (!parsedResult.value) return []

  // 获取所有存在的字段作为标签页
  return Object.keys(parsedResult.value)
    .filter(key =>
      parsedResult.value[key] && parsedResult.value[key].toString().trim() !== ''
    )
    .map(key => ({
      key: key,
      label: key // 直接使用字段名作为标签
    }))
})

const getDataType = (data: string | [] | object): 'string' | 'array' | 'object' => {
  if (Array.isArray(data)) return 'array'
  if (typeof data === 'object' && data != null) return 'object'
  return 'string'
}

// 设置默认激活的标签页
watch(tabs, (newTabs) => {
  if (newTabs.length > 0 && !newTabs.find(tab => tab.key === activeTab.value)) {
    activeTab.value = newTabs[0]!.key
  }
}, { immediate: true })
</script>

<template>
  <!-- 输入框 -->
  <el-input v-model="input" placeholder="输入单词或文本" size="large"
            type="textarea" :autosize="{minRows: 2, maxRows: 4}"
            maxlength="9999" :style="{ fontSize: settingStore.fontSize + 'px' }">

  </el-input>

  <!-- 分隔线 -->
  <el-divider />

  <!-- 输出框 -->
  <el-tabs v-model="activeTab" type="border-card" v-if="tabs && tabs.length > 0" :style="{ fontSize: settingStore.fontSize + 'px' }">

    <el-tab-pane v-for="tab in tabs" :key="tab.key" :label="tab.label" :name="tab.key">
      <!-- 根据数据类型渲染不同的组件 -->
      <template v-if="getDataType(parsedResult[tab.key]) === 'string'">
        <!-- 字符串类型 - 直接显示 -->
        {{ parsedResult[tab.key] }}
      </template>

      <!-- 数组类型 - 使用 el-list 展示 -->
      <el-card v-else-if="getDataType(parsedResult[tab.key]) === 'array'">
        <div v-for="(item, index) in parsedResult[tab.key]" :key="index" class="array-item">
          {{ item }}
        </div>
      </el-card>

      <!-- 对象类型 - 使用 el-descriptions 展示 -->
      <el-descriptions v-else-if="getDataType(parsedResult[tab.key]) === 'object'"
                       :column="1" border>

        <el-descriptions-item v-for="(value, key) in parsedResult[tab.key]"
                              :key="key" :label="key">
          {{ value }}
        </el-descriptions-item>

      </el-descriptions>

    </el-tab-pane>

  </el-tabs>
</template>
