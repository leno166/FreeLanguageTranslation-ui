<script setup lang="ts">
import { watch } from 'vue'
import { useSettingStore } from '@/stores/counter.ts'
import { api, type Shortcut } from '@/types/interfaces.ts'

const settingStore = useSettingStore()

// 1. 字号

// 2. 主题颜色

// 3. 启动
watch(() => settingStore.autoStart, () => {
  settingStore.setAutoStart()
})

/* *** 这里不应该触发, 只要让他保存这个值就行.
watch(() => settingStore.startMinimized, () => {
  settingStore.setStartMinimized()
})  */

// 4. 快捷键
watch(() => settingStore.shortcuts, (newVal) => {
  console.log(newVal)
})

// 5. 主窗口
watch(() => settingStore.alwaysOnTop, async () => {
  await settingStore.setAlwaysOnTop()
})

watch(() => settingStore.hide2trayOnClose, async () => {
  await settingStore.setHide2trayOnClose()
})

// 6. 截屏模式
watch(() => settingStore.screen, async () => {
  await settingStore.capture()
})
</script>

<template>
  <!--
  1. 字号选择(默认 14)
    12 14 16 18 20

  2. 设置皮肤主题
    跟随系统 浅色 深色

  3. 启动
    开机自启动
    启动后最小化到系统托盘

  4. 快捷键
    增加字号      ctrl +   恢复默认
    减小字号      ctrl -   恢复默认

    截图翻译      alt p   恢复默认

    打开软件      alt d   恢复默认
    打开mini窗口  alt m   恢复默认

  5. 主窗口
    启用主窗口总在最前面
    窗口关闭时最小化到系统托盘

  6. 截屏翻译
    多屏截图
    单屏截图(仅截取鼠标指针所在的屏幕)

  -->

  <el-card>
    <!-- 使用 Element Plus 的 scrollbar 组件 -->
    <el-scrollbar height="70vh">
      <!-- 1. 字号选择（改为 radio） -->
      <span style="font-size: 16px; font-weight: bold; ">字号选择</span>
      <span style="font-size: 12px; color: #999; margin-left: 8px;">影响查词和翻译结果</span>
      <el-form>
        <el-form-item style="margin-bottom: 24px">
          <el-radio-group v-model="settingStore.fontSize">
            <el-radio v-for="item in settingStore.fontList" :label="item" :key="item">
              {{ item }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <!-- 2. 主题颜色 -->
      <span style="font-size: 16px; font-weight: bold; ">主题颜色</span>
      <el-form>
        <el-form-item style="margin-bottom: 24px">
          <el-radio-group v-model="settingStore.theme">
            <el-radio v-for="item in settingStore.themeList" :key="item" :label="item">
              {{ item }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>


      <!-- 3. 启动 -->
      <span style="font-size: 16px; font-weight: bold; ">启动</span>
      <el-form>
        <el-form-item style="margin-bottom: 24px">
          <div style="display: flex; flex-direction: column; ">
            <el-checkbox v-model="settingStore.autoStart">开机自启动</el-checkbox>
            <el-checkbox v-model="settingStore.startMinimized">启动后最小化到系统托盘</el-checkbox>
          </div>
        </el-form-item>
      </el-form>

      <!-- 4. 快捷键 -->
      <span style="font-size: 16px; font-weight: bold;">快捷键</span>
      <span style="font-size: 12px; color: #999; margin-left: 8px;">
            直接按键盘进行设置, 清空可取消快捷键</span>
      <el-form label-position="right" label-width="140px">
        <el-form-item v-for="item in settingStore.shortcuts" :key="item.id" :label="item.label">
          <el-input v-model="item.value" size="small" style="width: 200px" disabled />
          <el-button style="margin-left: 8px" size="small">恢复默认</el-button>
        </el-form-item>
      </el-form>

      <!-- 5. 主窗口 -->
      <span style="font-size: 16px; font-weight: bold;">主窗口</span>
      <el-form>
        <el-form-item>
          <div style="display: flex; flex-direction: column; ">
            <el-checkbox v-model="settingStore.alwaysOnTop">启用主窗口总在最前面</el-checkbox>
            <el-checkbox v-model="settingStore.hide2trayOnClose">窗口关闭时最小化到系统托盘
            </el-checkbox>
          </div>
        </el-form-item>
      </el-form>


      <!-- 6. 截屏翻译 -->
      <span style="font-size: 16px; font-weight: bold;">截屏翻译</span>
      <el-form>
        <el-form-item>
          <el-radio-group v-model="settingStore.screen">
            <div style="display: flex; flex-direction: column; ">
              <el-radio label="multi">多屏截图</el-radio>
              <el-radio label="single">单屏截图(仅截取鼠标指针所在的屏幕)</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
      </el-form>

    </el-scrollbar>

  </el-card>

</template>

<style scoped>

</style>
