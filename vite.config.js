import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8081, // 设置开发服务器端口
    proxy: {
      '/api/v1': {
        target: 'http://192.168.45.212:8080', // Spring Boot 后端地址
        changeOrigin: true,
      },
    },
  },
})