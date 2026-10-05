import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
          'vendor-emailjs': ['@emailjs/browser'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
  esbuild: {
    legalComments: 'none',
  },
})