/** @type {import('tailwindcss').Config} */
module.exports = {
  // 确保覆盖所有组件和页面文件，解决 content 配置警告
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 覆盖 src 下所有 JS/JSX/TS/TSX 文件
    "./public/index.html"
  ],
  theme: {
    extend: {
      // 颜色配置（与 app.css 中的深色主题匹配）
      colors: {
        primary: '#4A2FBD',       // 主紫色（对应 app.css 中的渐变色）
        secondary: '#AA367C',     // 辅助色（对应 app.css 中的渐变色）
        dark: {
          100: '#B8B8B8',         // 浅灰文本（对应 app.css 中的 .banner p 颜色）
          200: '#151515',         // 卡片深色背景（对应 app.css 中的 .skill-bx）
          300: '#121212',         // 全局深色背景（对应 app.css 中的 body 背景）
        }
      },
      // 字体配置（关联 app.css 中定义的 Centra 字体）
      fontFamily: {
        centra: ['Centra', 'sans-serif'],
      },
      // 扩展背景图片配置（方便使用 app.css 中的 banner-bg 等背景）
      backgroundImage: {
        'banner-pattern': "url('./assets/img/banner-bg.png')",
        'footer-pattern': "url('./assets/img/footer-bg.png')",
      }
    },
  },
  // 确保与 app.css 中的全局样式兼容
  corePlugins: {
    // 禁用 Tailwind 默认的 preflight 样式（避免与 app.css 中的重置样式冲突）
    preflight: false,
  },
  plugins: [],
}