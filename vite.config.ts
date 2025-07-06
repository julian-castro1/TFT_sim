import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@parsers': resolve(__dirname, 'src/parsers'),
      '@renderers': resolve(__dirname, 'src/renderers'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types'),
    },
  },
  
  // Development server
  server: {
    port: 5173,
    host: '0.0.0.0',
    open: true,
    cors: true,
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'parsers': ['src/parsers/ArduinoParser'],
          'renderers': ['src/renderers/CanvasRenderer'],
        },
      },
    },
  },
  
  // CSS configuration
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  
  // Optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand'],
  },
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
}) 