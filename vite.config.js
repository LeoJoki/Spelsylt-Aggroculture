import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    assetsInlineLimit: 0, // Disable inlining assets as base64
    base: '/Spelsylt-Aggroculture/', // Ändra detta till ditt repo-namn
  }
})
