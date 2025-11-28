import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { HistoryItem, Shortcut } from '@/types/interfaces.ts'
import { debounce } from 'lodash-es'

export const useHistoryStore = defineStore('history', () => {
  const list = ref<HistoryItem[]>([])

  const add = (sourceText: string, translatedText: string) => {
    // 可选：避免重复添加（根据业务决定）
    if (list.value.some(
      item =>
        item.sourceText === sourceText && item.translatedText === translatedText
    )) return

    list.value.push({ sourceText, translatedText })
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

  // 用于取消翻译请求的 AbortController
  let abortController: AbortController | null = null

  // 防抖间隔
  const debounceTime = 100

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

    // 如果前边有未完成的请求, 取消掉
    if (abortController) {
      abortController.abort()
    }
    // 创建请求
    let response: Response
    abortController = new AbortController()

    // 尝试发送
    try {
      response = await fetch('/api/translation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ translation: text }),
        signal: abortController.signal  // 添加取消信号
      })
    } catch (error) {
      // 如果是取消请求导致的错误，不进行错误处理
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('请求被取消')
        return
      }

      console.error('网络错误:', error)
      translationResult.value = ''
      return
    } finally {
      // 请求完成后清理 AbortController
      abortController = null
    }

    //     处理响应
    if (response && response.ok) {
      const data = await response.json()
      translationResult.value = data.result || JSON.stringify(data)
      historyStore.add(text, translationResult.value)
      return
    }

    // 请求失败
    console.error('请求失败:', response.status, response.statusText)
    translationResult.value = ''
    return
  }, debounceTime)

  return {
    inputText, setInputText, translate, translationResult
  }
})

export const useSettingStore = defineStore('setting', () => {
  // 1. 字号
  const fontList = [12, 18, 24, 30, 36] as const
  const fontSize = ref<typeof fontList[number]>(fontList[1])

  // 2. 主题颜色
  const themeList = ['跟随系统', '浅色', '深色'] as const
  const theme = ref<typeof themeList[number]>(themeList[0])

  // 3. 启动
  const autoStart = ref<boolean>(false)
  const setAutoStart = async () => {
    let response: Response

    try {
      response = await fetch('/api/autoStart', {
        method: 'GET',
        headers: {
          autoStart: String(autoStart.value)
        }
      })
    } catch (error) {
      console.error('网络错误', error)
      return
    }

    if (response.ok) {
      return
    }

    console.error('请求失败:', response.status)
    return
  }

  const startMinimized = ref<boolean>(false)
  const setStartMinimized = async () => {
    let response: Response

    try {
      response = await fetch('/api/startMinimized', {
        method: 'GET',
        headers: {
          startMinimized: String(startMinimized.value)
        }
      })
    } catch (error) {
      console.error('网络错误', error)
      return
    }

    if (response.ok) {
      return
    }

    console.error('请求失败:', response.status)
    return
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

  // 主窗口
  const alwaysOnTop = ref<boolean>(false)
  const setAlwaysOnTop = async () => {
    let response: Response

    try {
      response = await fetch('/setting/window/props', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          alwaysOnTop: String(alwaysOnTop.value)
        })
      })
    } catch (error) {
      console.error('网络错误', error)
      return
    }

    if (response.ok) {
      return
    }

    console.error('请求失败:', response.status)
    return
  }

  return {
    fontList, fontSize, themeList, theme,
    autoStart, setAutoStart, startMinimized, setStartMinimized,
    shortcuts,
    alwaysOnTop, setAlwaysOnTop
  }
}, {
  // 持久化配置
  persist: {
    key: 'setting-store', // 存储的key，默认是store的id
    storage: localStorage, // 存储方式，默认是localStorage
    pick: [
      'fontSize', 'theme', 'autoStart', 'startMinimized', 'shortcuts', 'alwaysOnTop'
    ]
  }
})

