<script setup lang="ts">
import { computed, ref, watch } from 'vue'
// import type { Ref } from 'vue'
import { debounce } from 'lodash-es'
import { useHistoryStore } from '@/stores/counter.ts' // 或用其他 debounce 实现
// import type { AppConfig } from '@/utils/config.ts'

// const appConfig = inject<Ref<AppConfig>>('app-config')
// const url = appConfig?.value.base_url

const historyStore = useHistoryStore()

const input = ref('')
const translationResponse = ref('')
const activeTab = ref('translation')

// 用于取消请求的 AbortController
let abortController: AbortController | null = null

const setInput = (text: string) => {
  input.value = text
}

// 解析结果数据, 实时响应.
const parsedResult = computed(() => {
  if (!translationResponse.value) return null

  // 尝试解析 json. 后端已处理
  return JSON.parse(translationResponse.value)
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

// 发送请求
const sendToBackend = async (text: string) => {

  if (text.trim() === '') {
    translationResponse.value = ''
    return
  }

  if (historyStore.getSourceTexts().includes(text)) {
    console.log(`历史记录命中: ${text}`)
    translationResponse.value = historyStore.getTranslatedTextBySourceText(text)!
    return
  }

  if (abortController) {
    abortController.abort()
  }

  // 创建新的 AbortController
  abortController = new AbortController()

  try {
    const response = await fetch('/api/translation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ translation: text }),
      signal: abortController.signal  // 添加取消信号
    })

    if (response.ok) {
      const data = await response.json()
      translationResponse.value = data.result || JSON.stringify(data)
      historyStore.add(text, translationResponse.value)
      return
    }

    console.error('请求失败:', response.status, response.statusText)
    translationResponse.value = ''
    return

  } catch (error) {
    // 如果是取消请求导致的错误，不进行错误处理
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('请求被取消')
      return
    }

    console.error('网络错误:', error)
    translationResponse.value = ''
    return
  } finally {
    // 请求完成后清理 AbortController
    abortController = null
  }
}

// 创建防抖函数：500ms 内无新输入才触发
const debouncedSend = debounce(sendToBackend, 800)

// 监听 input 变化
watch(input, (newVal) => {
  debouncedSend(newVal)
})

// 设置默认激活的标签页
watch(tabs, (newTabs) => {
  if (newTabs.length > 0 && !newTabs.find(tab => tab.key === activeTab.value)) {
    activeTab.value = newTabs[0]!.key
  }
}, { immediate: true })

defineExpose({
  setInput
})

// historyStore.add('nihao', '{ "label": "自动检测", "value": "auto-detect" }')
// historyStore.add('你好', '{ "label": "自动检测", "value": "auto-detect" }')
// historyStore.add('不对', '{ "label": "自动检测", "value": "auto-detect" }')
</script>

<template>
  <el-input v-model="input" placeholder="输入单词或文本" clearable size="large"
            type="textarea" :autosize="{minRows: 2, maxRows: 4}"
            maxlength="9999" :style="{ fontSize: '18px' }">

  </el-input>

  <el-divider />

  <el-tabs v-model="activeTab" type="border-card" v-if="parsedResult && tabs.length > 0">

    <el-tab-pane v-for="tab in tabs" :key="tab.key" :label="tab.label" :name="tab.key">
      {{ parsedResult[tab.key] }}
    </el-tab-pane>

  </el-tabs>
</template>
