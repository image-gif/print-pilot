// playground/vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // HTML 就在根目录，默认会以 index.html 为入口
  server: {
    port: 5173,
    open: true
  }
})