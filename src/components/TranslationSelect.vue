<script setup lang="ts">
import { ref, watch } from 'vue'

const selectedOption = ref('英汉互译')
const optionList = [
  '自动检测', '英汉互译', '日汉互译', '韩汉互译', '越汉互译', '葡汉互译', '西汉互译', '法汉互译'
]

watch(selectedOption, async (newVal) => {
  let response: Response

  try {
    response = await fetch('/api/selectLanguage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mode: newVal,
        timestamp: Date.now()
      })
    })
  } catch (error) {
    console.error('请求失败: ', error)
    return
  }

  if (response.ok) {
    return
  }

  console.error('请求失败: ', response.status)
  return
})
</script>

<template>
  <el-row>
    <el-col :xs="5" :sm="3" :md="3" :lg="2" :xl="2">
      <el-select v-model="selectedOption" size="small" style="margin-bottom: 12px">
        <el-option
          v-for="option in optionList"
          :key="option" :label="option" :value="option"
        />
      </el-select>
    </el-col>
  </el-row>
</template>
