import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// GitHub Pages: set DEPLOY_BASE=/Hubstaff-V2/ only in CI (see workflow). Never rely on
// GITHUB_ACTIONS here—some shells leave it set and break local dev (blank page).
export default defineConfig({
  base: process.env.DEPLOY_BASE?.trim() || '/',
  plugins: [react(), tailwindcss()],
})
