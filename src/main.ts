import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import router from './router'
import type { SettingConfigs, Shortcut } from '@/types/interfaces.ts'
import { useSettingStore } from '@/stores/counter.ts'

// 清除持久化数据
// localStorage.removeItem('setting-store')

if (!window.api) {
  window.api = {}  as never // 或根据你的类型赋值
}

const mockApi = {
  // ====================================================
  // 翻译
  // ====================================================

  // ====================================================
  // 翻译
  translation: async (text: string) => {
    console.log('调用 translation:', text)
    return `模拟翻译结果: "${text}" -> 这是模拟的翻译`
  },

  // ====================================================
  // 设置
  // ====================================================

  // ====================================================
  // 配置更新
  config_update: async (configs: SettingConfigs) => {
    console.log('调用 config_update:', configs)
  },

  // ====================================================
  // 启动
  set_auto_running: async (enable: boolean) => {
    console.log('调用 set_auto_running:', enable)
  },

  set_hide2tray_on_start: async (enable: boolean) => {
    console.log('调用 set_hide2tray_on_start:', enable)
  },

  // ====================================================
  // 快捷键
  modify_hotkey: async (shortcut: Shortcut) => {
    console.log('调用 modify_hotkey:', shortcut)
    return shortcut
  },

  // ====================================================
  // 主窗口
  set_always_on_top: async (enable: boolean) => {
    console.log('调用 set_always_on_top:', enable)
  },

  set_hide2tray_on_close: async (enable: boolean) => {
    console.log('调用 set_hide2tray_on_close:', enable)
  },

  // ====================================================
  // 截屏翻译
  capture_single: async () => {
    console.log('调用 capture_single')
    alert('模拟单屏截图')
  },

  capture_all: async () => {
    console.log('调用 capture_all')
    alert('模拟多屏截图')
  }
}

// 开发环境：注入模拟的 pywebview API
if (import.meta.env.DEV && !window.pywebview) {
  console.log('注入模拟 pywebview API 用于调试')

  window.pywebview = {
    api: mockApi
  }
}

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

const settingStore = useSettingStore()
window.api.increaseFontSize = settingStore.increaseFontSize
window.api.decreaseFontSize = settingStore.decreaseFontSize

// 等待 pywebview 就绪
const waitForPyWebView = () => {
  return new Promise<void>((resolve) => {
    let attempts = 0
    const maxAttempts = 10 // 30 * 100ms = 3秒

    const check = () => {
      if (window.pywebview && window.pywebview.api) {
        console.log('pywebview API 已就绪')
        resolve()
      } else if (attempts >= maxAttempts) {
        console.warn('⚠️ pywebview API 未就绪，超时，直接设置 mockApi')
        window.pywebview = {
          api: mockApi
        }
        resolve()
      } else {
        attempts++
        console.log(`⏳ 等待 pywebview API... (${attempts}/${maxAttempts})`)
        setTimeout(check, 100)
      }
    }

    check()
  })
}

waitForPyWebView().then(() => {
  app.mount('#app')
})
