import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // outDir: '../../public/action'
    outDir: "../../public/side_panel/",
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
  base: './'
})
