import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { HistoryItem } from '@/types/interfaces.ts'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useHistoryStore = defineStore('history', {
  state: () => ({
    list: [] as HistoryItem[]
  }),

  actions: {
    add(sourceText: string, translatedText: string) {
      // 可选：避免重复添加（根据业务决定）
      if (this.list.some(
        item =>
          item.sourceText === sourceText && item.translatedText === translatedText
      )) return

      this.list.push({ sourceText: sourceText, translatedText: translatedText })
    },

    getSourceTexts(): string[] {
      return this.list.map(item => item.sourceText)
    },

    getTranslatedTextBySourceText(sourceText: string): string | undefined {
      return this.list.find(item => item.sourceText === sourceText)?.translatedText
    },

    clear() {
      this.list = []
    }
  }
})
