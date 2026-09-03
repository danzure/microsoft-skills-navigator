import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          // React Core runtime
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/react-router/') ||
            id.includes('/node_modules/react-router-dom/') ||
            id.includes('\\node_modules\\react\\') ||
            id.includes('\\node_modules\\react-dom\\') ||
            id.includes('\\node_modules\\react-router\\') ||
            id.includes('\\node_modules\\react-router-dom\\')
          ) {
            return 'vendor-core';
          }

          // React Flow and graph layout engine (used on /path/:pathId)
          if (id.includes('@xyflow') || id.includes('dagre')) {
            return 'vendor-flow';
          }

          // Drag and drop sorting kit (used on /career-paths)
          if (id.includes('@dnd-kit')) {
            return 'vendor-dnd';
          }

          // Fluent UI and product icons
          if (id.includes('@fluentui') || id.includes('@iconify')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },
})
