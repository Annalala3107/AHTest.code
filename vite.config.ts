import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('katex')) return 'vendor-katex';
            if (id.includes('@monaco-editor')) return 'vendor-editor';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('canvas-confetti') || id.includes('jszip') || id.includes('@supabase')) return 'vendor-utils';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
