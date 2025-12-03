export interface HistoryItem {
  sourceText: string
  translatedText: string
}

export const FONT_SIZE_OPTIONS = [12, 18, 24, 30, 36] as const
export type FontSizeMode = typeof FONT_SIZE_OPTIONS[number]

export const THEME_LIST = ['跟随系统', '浅色', '深色'] as const
export type ThemeMode = typeof THEME_LIST[number]

export interface Shortcut {
  id: string,
  label: string,
  value: string,
  description: string,
}

export const SCREEN_LIST = ['single', 'multi'] as const
export type ScreenMode = typeof SCREEN_LIST[number]

export interface SettingConfigs {
  fontSize: FontSizeMode,
  theme: ThemeMode,
  autoStart: boolean,
  startMinimized: boolean,
  shortcuts: Shortcut[],
  alwaysOnTop: boolean,
  hide2trayOnClose: boolean,
  screen: ScreenMode,
}

// 后端 API 方法定义
interface BackendApi {
  // 翻译
  translation: (text: string) => Promise<string>,

  // 设置 配置更新
  config_update: (configs: SettingConfigs) => Promise<void>

  // 设置 启动
  set_auto_running: (enable: boolean) => Promise<void>,
  set_hide2tray_on_start: (enable: boolean) => Promise<void>,

  // 设置 快捷键
  modify_hotkey: (shortcut: Shortcut) => Promise<Shortcut>

  // 设置 主窗口
  set_always_on_top: (enable: boolean) => Promise<void>,
  set_hide2tray_on_close: (enable: boolean) => Promise<void>,

  // 设置 截屏翻译
  capture_single: () => Promise<void>,
  capture_all: () => Promise<void>,
}

// pywebview api 类型定义
declare global {
  interface Window {
    pywebview: {
      api: BackendApi
    },

    api: {
      increaseFontSize: () => void,
      decreaseFontSize: () => void,
    }
  }
}

// 前端 API 方法定义
interface FrontendApi {
  // 翻译
  translation: (text: string) => Promise<string>

  // 设置 配置更新
  configUpdate: (configs: SettingConfigs) => Promise<void>,

  // 设置 启动
  setAutoRunning: (enable: boolean) => Promise<void>
  setHide2trayOnStart: (enable: boolean) => Promise<void>

  // 设置 快捷键
  modifyHotkey: (shortcut: Shortcut) => Promise<Shortcut>

  // 设置 主窗口
  setAlwaysOnTop: (enable: boolean) => Promise<void>
  setHide2trayOnClose: (enable: boolean) => Promise<void>

  // 设置 截屏翻译
  captureSingle: () => Promise<void>
  captureAll: () => Promise<void>
}

// 创建安全的 API 访问函数
export const api: FrontendApi = {
  // ====================================================
  // 翻译
  // ====================================================

  // ====================================================
  // 翻译
  translation: (text: string) => {
    return window.pywebview.api.translation(text)
  },

  // ====================================================
  // 设置
  // ====================================================

  // ====================================================
  // 配置更新
  configUpdate: (configs: SettingConfigs) => {
    return window.pywebview.api.config_update(configs)
  },

  // ====================================================
  // 启动
  setAutoRunning: (enable: boolean) => {
    return window.pywebview.api.set_auto_running(enable)
  },

  setHide2trayOnStart: (enable: boolean) => {
    return window.pywebview.api.set_hide2tray_on_start(enable)
  },

  // ====================================================
  // 快捷键
  modifyHotkey: (shortcut: Shortcut) => {
    return window.pywebview.api.modify_hotkey(shortcut)
  },

  // ====================================================
  // 主窗口
  setAlwaysOnTop: (enable: boolean) => {
    return window.pywebview.api.set_always_on_top(enable)
  },

  setHide2trayOnClose: (enable: boolean) => {
    return window.pywebview.api.set_hide2tray_on_close(enable)
  },

  // ====================================================
  // 截屏翻译
  captureSingle: () => {
    return window.pywebview.api.capture_single()
  },

  captureAll: () => {
    return window.pywebview.api.capture_all()
  }
}
