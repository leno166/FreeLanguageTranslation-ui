# FreeLanguageTranslation-ui

> **FreeLanguageTranslation Desktop App:** 一个基于 Vue 3 + FastAPI + PyWebView 的跨平台桌面翻译应用，仿照有道翻译界面设计。

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vue 3.3](https://img.shields.io/badge/Vue-3.3-4fc08d?logo=vue.js)](https://vuejs.org/)
[![FastAPI 0.104](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python 3.8+](https://img.shields.io/badge/Python-3.8+-3776ab?logo=python)](https://www.python.org/)

## 🎯 核心功能

* **多语言互译：** 支持英汉、日汉、韩汉、越汉、葡汉、西汉、法汉等多种语言翻译
* **智能识别：** 自动检测输入语言类型
* **历史记录：** 保存翻译历史，快速复用
* **实时翻译：** 输入时实时进行翻译，支持防抖处理

## 🎨 界面特色

* **现代化UI：** 基于 Element Plus 的优雅界面设计
* **主题切换：** 支持浅色、深色、跟随系统主题
* **字号调节：** 可自定义翻译结果显示字号
* **响应式布局：** 适配不同屏幕尺寸

## 💻 桌面集成

* **系统托盘：** 最小化到系统托盘运行
* **全局快捷键：** 支持自定义快捷键操作
* **窗口置顶：** 主窗口可设置为总在最前面
* **开机自启：** 支持开机自动启动

## 🔧 技术亮点

* **跨平台架构：** 基于 PyWebView，轻松扩展到 Linux、macOS、移动端
* **前后端分离：** Vue 3 + TypeScript 前端，FastAPI 后端
* **状态持久化：** 使用 Pinia 进行状态管理，数据持久化存储
* **打包部署：** PyInstaller 一体化打包，开箱即用

## 🛠️ 技术栈

### 前端技术

* **框架：** Vue 3 + TypeScript + Vite
* **UI组件：** Element Plus
* **状态管理：** Pinia + 持久化插件
* **路由：** Vue Router
* **构建工具：** Vite

### 后端技术

* **框架：** FastAPI
* **桌面容器：** PyWebView
* **打包工具：** PyInstaller
* **HTTP服务：** Uvicorn

## 📦 项目结构

```text
freeLanguageTranslation/
├── freeLanguageTranslation/         # FastAPI 后端代码
│   ├── main.py                      # 后端入口文件
│   └── ...
├── FreeLanguageTranslation-ui/      # Vue 前端源码
│   ├── src/
│   │   ├── components/              # Vue 组件
│   │   ├── stores/                  # 状态管理
│   │   ├── layouts/                 # 页面布局
│   │   └── router/                  # 路由配置
│   ├── package.json
│   └── vite.config.ts
├── ui-static/                       # 前端构建产物（打包时复制到此）
└── build/                           # 打包配置
```

## 🚀 快速开始

### 环境要求

* Python 3.8+
* Node.js 16+
* PyInstaller

### 前端开发
```shell
# 进入前端目录
cd FreeLanguageTranslation-ui

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build
```

### 后端开发

```shell
# 进入后端目录  
cd freeLanguageTranslation

# 安装依赖
pip install -r requirements.txt

# 启动后端服务
python main.py
```

### 一体化打包

#### 1. 构建前端

```shell
cd FreeLanguageTranslation-ui
npm run build
```

#### 2. 复制构建产物

```shell
# 将 dist 目录内容复制到 freeLanguageTranslation/ui-static
cp -r ui-static ../freeLanguageTranslation/
```

#### 3. 打包桌面应用

```shell
cd freeLanguageTranslation
pyinstaller build.spec
```

## 📱 应用界面

### 主界面

* 简洁的翻译输入输出区域
* 语言选择下拉框
* 实时翻译结果显示

### 设置页面

* **显示设置：** 字号调节、主题切换
* **启动设置：** 开机自启、最小化启动
* **快捷键设置：** 截图翻译、打开软件等
* **窗口设置：** 置顶显示、托盘最小化

### 历史记录

* 翻译历史弹窗
* 点击快速复用
* 智能截断长文本显示

## 🎯 使用说明

### 基本翻译

1. 在输入框输入要翻译的文本
2. 选择目标语言（默认英汉互译）
3. 实时查看翻译结果

### 快捷键操作

* Alt + P：截图翻译
* Alt + D：显示/隐藏主窗口
* Alt + M：打开迷你窗口
* Ctrl + +/-：调节字号

### 系统集成

* 右键系统托盘图标进行快捷操作
* 支持窗口关闭时最小化到托盘
* 可设置开机自动启动

## 🔄 跨平台支持
本项目采用跨平台技术栈，可轻松扩展到：

* **Windows：** ✅ 已支持
* **macOS：** 🔄 计划支持
* **Linux：** 🔄 计划支持
* **移动端：** 📱 未来规划

## 🤝 贡献指南
我们欢迎任何形式的贡献！

1. `Fork` 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 `Pull Request`

## 📄 许可证
本项目采用 MIT 许可证 - 查看 LICENSE 文件了解详情。

## 🙏 致谢

* [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
* [FastAPI](https://fastapi.tiangolo.com/) - 现代 Python Web 框架
* [Element Plus](https://element-plus.org/) - Vue 3 组件库
* [PyWebView](https://pywebview.flowrl.com/) - 轻量级跨平台 WebView 库

---

**注意：** 本项目仍在积极开发中，部分功能可能尚未完全实现。欢迎提交 Issue 和 Pull Request！

---

<div align="center">
如果这个项目对你有帮助，请给它一个 ⭐️ ！
</div>
