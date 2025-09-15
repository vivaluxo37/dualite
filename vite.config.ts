import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Performance optimizations
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          queries: ['@tanstack/react-query'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-navigation-menu'],
          icons: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom']
  },

  define: {
    'import.meta.env': 'import.meta.env',
  },

  // Development server optimization
  server: {
    port: 5173,
    host: true,
    open: true
  },

  // Preview server optimization
  preview: {
    port: 4173,
    host: true
  }
});