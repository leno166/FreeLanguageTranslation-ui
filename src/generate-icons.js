// scripts/generate-icons.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// SVG 内容（直接从你的组件复制）
const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景圆圈 -->
  <circle cx="256" cy="256" r="240" fill="url(#gradient)" stroke="#3b82f6" stroke-width="8"/>

  <!-- 翻译箭头 -->
  <path d="M180 256L250 200V220H332L332 292H250V312L180 256Z" fill="white"/>
  <path d="M332 256L262 312V292H180V220H262V200L332 256Z" fill="white"/>

  <!-- 语言气泡 -->
  <circle cx="180" cy="180" r="40" fill="white" opacity="0.2"/>
  <circle cx="332" cy="332" r="40" fill="white" opacity="0.2"/>

  <defs>
    <linearGradient id="gradient" x1="0" y1="0" x2="512" y2="512">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
</svg>`

// 创建 icons 目录
const iconsDir = path.join(__dirname, '../public/icons')
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

// 要生成的尺寸
const sizes = [16, 32, 48, 64, 128, 256, 512]

async function generateIcons() {
  console.log('🚀 开始生成图标...')

  // 1. 保存原始 SVG
  fs.writeFileSync(path.join(iconsDir, 'logo.svg'), svgContent)
  console.log('✅ SVG 文件已生成: logo.svg')

  // 2. 生成各种尺寸的 PNG
  const pngPromises = sizes.map(async size => {
    const buffer = await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toBuffer()

    const fileName = `icon-${size}x${size}.png`
    fs.writeFileSync(path.join(iconsDir, fileName), buffer)
    console.log(`✅ PNG 文件已生成: ${fileName}`)

    return { size, buffer }
  })

  const pngResults = await Promise.all(pngPromises)

  // 3. 生成 favicon.ico（Windows 图标）
  // ICO 文件需要包含多种尺寸
  const icoSizes = [16, 32, 48]
  const icoImages = await Promise.all(
    icoSizes.map(size =>
      sharp(Buffer.from(svgContent))
        .resize(size, size)
        .png()
        .toBuffer()
    )
  )

  // 使用 sharp 生成 ICO
  await sharp(icoImages[0])
    .resize(32, 32)
    .toFile(path.join(iconsDir, 'favicon.ico'))

  console.log('✅ ICO 文件已生成: favicon.ico')

  // 4. 生成苹果 touch 图标
  await sharp(Buffer.from(svgContent))
    .resize(180, 180)
    .png()
    .toFile(path.join(iconsDir, 'apple-touch-icon.png'))

  console.log('✅ 苹果 touch 图标已生成: apple-touch-icon.png')

  // 5. 生成 manifest 图标
  const manifestSizes = [
    { size: 72, name: 'icon-72x72.png' },
    { size: 96, name: 'icon-96x96.png' },
    { size: 128, name: 'icon-128x128.png' },
    { size: 144, name: 'icon-144x144.png' },
    { size: 152, name: 'icon-152x152.png' },
    { size: 192, name: 'icon-192x192.png' },
    { size: 384, name: 'icon-384x384.png' },
    { size: 512, name: 'icon-512x512.png' }
  ]

  for (const item of manifestSizes) {
    await sharp(Buffer.from(svgContent))
      .resize(item.size, item.size)
      .png()
      .toFile(path.join(iconsDir, item.name))
    console.log(`✅ Manifest 图标已生成: ${item.name}`)
  }

  console.log('🎉 所有图标生成完成！')
}

generateIcons().catch(console.error)
