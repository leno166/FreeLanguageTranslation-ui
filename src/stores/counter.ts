import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  api,
  FONT_SIZE_OPTIONS,
  type FontSizeMode,
  type HistoryItem, SCREEN_LIST, type ScreenMode, type SettingConfigs,
  type Shortcut, THEME_LIST, type ThemeMode
} from '@/types/interfaces.ts'
import { debounce } from 'lodash-es'

export const useHistoryStore = defineStore('history', () => {
  const list = ref<HistoryItem[]>([])

  const add = (sourceText: string, translatedText: string) => {
    // 可选：避免重复添加（根据业务决定）
    if (list.value.some(
      item =>
        item.sourceText === sourceText && item.translatedText === translatedText
    )) return

    list.value.unshift({ sourceText, translatedText })

    // 限制最多 100 条，超出则移除最旧的（末尾）
    if (list.value.length > 100) {
      list.value.pop()
    }
  }

  const getSourceTexts = (): string[] => {
    return list.value.map(item => item.sourceText)
  }

  const getTranslatedTextBySourceText = (sourceText: string): string | undefined => {
    return list.value.find(
      item => item.sourceText === sourceText
    )?.translatedText
  }

  const clear = () => {
    list.value = []
  }

  return {
    list,
    add, getSourceTexts, getTranslatedTextBySourceText, clear
  }
})

export const useTranslationStore = defineStore('translation', () => {
  const inputText = ref<string>('')
  // 设置输入文本的方法
  const setInputText = (text: string) => {
    inputText.value = text
  }

  const translationResult = ref<string>('')

  // 防抖间隔
  const debounceTime = 500

  // 翻译动作
  const translate = debounce(async (text: string, historyStore) => {
    // trim: 字符串方法，用于移除字符串首尾的空白字符（包括空格、制表符 \t、换行符 \n、回车符 \r 等）
    if (text.trim() === '') {
      translationResult.value = ''
      return
    }

    // 检查是否命中历史记录
    if (historyStore.getSourceTexts().includes(text)) {
      console.log(`历史记录命中: ${text}`)
      translationResult.value = historyStore.getTranslatedTextBySourceText(text)!
      return
    }

    const json_data = await window.pywebview.api.translation(text)

    translationResult.value = JSON.stringify(json_data)
    historyStore.add(text, translationResult.value)
  }, debounceTime)

  return {
    inputText, setInputText, translate, translationResult
  }
})

export const useSettingStore = defineStore('setting', () => {
  // 0. 更新配置
  const configUpdate = (configs: SettingConfigs) => {
    console.log('配置表: ', configs)

    api.configUpdate(configs)
  }

  // 1. 字号
  const fontList = FONT_SIZE_OPTIONS
  const fontSize = ref<FontSizeMode>(fontList[1])

  const increaseFontSize = () => {
    const currentIndex = fontList.indexOf(fontSize.value)
    if (currentIndex < fontList.length - 1) {
      fontSize.value = fontList[currentIndex + 1]!
    }
  }

  const decreaseFontSize = () => {
    const currentIndex = fontList.indexOf(fontSize.value)
    if (currentIndex > 0) {
      fontSize.value = fontList[currentIndex - 1]!
    }
  }

  // 2. 主题颜色
  const themeList = THEME_LIST
  const theme = ref<ThemeMode>(themeList[0])

  // 3. 启动
  const autoStart = ref<boolean>(false)
  const setAutoStart = async () => {
    await api.setAutoRunning(autoStart.value)
  }

  const startMinimized = ref<boolean>(false)
  const setStartMinimized = async () => {
    await api.setHide2trayOnStart(startMinimized.value)
  }

  // 4. 快捷键
  const shortcuts = ref<Shortcut[]>([
    {
      id: 'increaseFontSize',
      label: '增加字号：',
      value: 'Ctrl +',
      description: '放大查词和翻译结果的字体大小'
    },

    {
      id: 'decreaseFontSize',
      label: '减小字号：',
      value: 'Ctrl -',
      description: '缩小查词和翻译结果的字体大小'
    },

    {
      id: 'screenshotTranslate',
      label: '截图翻译：',
      value: 'Alt P',
      description: '快速启动截图翻译功能'
    },

    {
      id: 'openApp',
      label: '打开软件：',
      value: 'Alt D',
      description: '显示或隐藏主窗口'
    },

    {
      id: 'openMiniWindow',
      label: '打开mini窗口：',
      value: 'Alt m',
      description: '打开简洁的迷你查词窗口'
    }
  ])

  // 5. 主窗口
  const alwaysOnTop = ref<boolean>(false)
  const setAlwaysOnTop = async () => {
    await api.setAlwaysOnTop(alwaysOnTop.value)
  }

  const hide2trayOnClose = ref<boolean>(false)
  const setHide2trayOnClose = async () => {
    await api.setHide2trayOnClose(hide2trayOnClose.value)
  }

  const screen = ref<ScreenMode>(SCREEN_LIST[0])
  const capture = async () => {
    if (screen.value === SCREEN_LIST[0]) {
      await api.captureSingle()
    } else {
      await api.captureAll()
    }
  }

  return {
    configUpdate,
    fontList, fontSize, increaseFontSize, decreaseFontSize,
    themeList, theme,
    autoStart, setAutoStart, startMinimized, setStartMinimized,
    shortcuts,
    alwaysOnTop, setAlwaysOnTop,
    hide2trayOnClose, setHide2trayOnClose,
    screen, capture
  }
}, {
  // 持久化配置
  persist: {
    key: 'setting-store', // 存储的key，默认是store的id
    storage: localStorage, // 存储方式，默认是localStorage
    pick: [
      'fontSize', 'theme',
      'autoStart', 'startMinimized',
      'shortcuts',
      'alwaysOnTop', 'hide2trayOnClose',
      'printScreenMode'
    ]
  }
})

