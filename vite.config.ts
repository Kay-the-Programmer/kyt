/// <reference types="vitest" />
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest.setup.ts',
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    // Pre-bundle heavy dependencies for faster dev startup
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'gsap/ScrollToPlugin', 'react', 'react-dom', 'react-router-dom']
    },
    build: {
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Optimize chunk size
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Core React in its own chunk
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            // GSAP in its own chunk
            'gsap-vendor': ['gsap', 'gsap/ScrollTrigger', 'gsap/ScrollToPlugin'],
          },
        },
      },
      // Use esbuild for minification (faster, no extra dependency)
      minify: 'esbuild',
      // Target modern browsers for smaller output
      target: 'es2020',
    },
  };
});
