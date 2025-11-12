/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // 1. 主要中文字体（优先微软雅黑、等线，兼容不同系统）
        'sans': [
          '"Microsoft YaHei"', // 微软雅黑（Windows）
          '"DengXian"',       // 等线（Windows）
          '"PingFang SC"',    // 苹方（macOS/iOS）
          '"Heiti SC"',       // 黑体（macOS/iOS）
          '"Source Han Sans CN"', // 思源黑体（跨平台）
          'sans-serif'        // 最终备选
        ],
        // 2. 衬线字体（可选，用于标题等场景）
        'serif': [
          '"SimSun"',         // 宋体（Windows）
          '"Song"',           // 宋体（macOS）
          'serif'
        ],
        // 3. 等宽字体（用于代码块）
        'mono': [
          'Menlo',
          'Monaco',
          '"Courier New"',
          'monospace'
        ]
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}

