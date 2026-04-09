import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// GitHub Pages serves from repo subpath; local dev uses "/".
export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true' ? '/Hubstaff-V2/' : '/',
  plugins: [react(), tailwindcss()],
})
