import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@energma/input-mask-react': path.resolve(__dirname, '../lib/dist')
    }
  }
});
