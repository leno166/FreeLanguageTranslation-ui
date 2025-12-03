import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),

    // 自动导入 API（如 ref, reactive, onMounted 等）和 Element Plus 组件的按需引入
    // 避免手动 import，提升开发体验
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),

    // 自动注册 Vue 组件（包括 Element Plus 的组件）
    // 使用时无需手动 import 和 components 注册
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  // 添加构建配置
  build: {
    emptyOutDir: true, // 👈 显式允许清空外部目录

    // 确保资源路径正确
    outDir: '../../py_project/freeLanguageTranslation/ui',
    assetsDir: 'assets',

    assetsInlineLimit: 4096,
  },

  // 设置资源加载路径
  base: './'
})
