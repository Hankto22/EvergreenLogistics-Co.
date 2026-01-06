import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Force Vite to resolve to the single React/ReactDOM in the project root
      // This prevents duplicate React copies which can cause "invalid hook" errors
      // when libraries end up bundling their own React instance.
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      '@': path.resolve(__dirname, 'src'),
    },
    // Ensure Vite de-duplicates React imports so only one copy is used at runtime
    dedupe: ['react', 'react-dom'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4545',
        changeOrigin: true,
      },
    },
  },
})
