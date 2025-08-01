import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// IMPORTANT: Port is fixed to prevent constant restarts during development
export default defineConfig({
  plugins: [react()],
  base: '/KasapApp/',
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    port: 8923,
    strictPort: true,
    open: true,
    watch: {
      usePolling: true,
    },
    hmr: {
      port: 8924,
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  define: {
    __DEV__: true,
  },
  esbuild: {
    loader: 'jsx',
    include: /.*\.[tj]sx?$/,
    exclude: [],
    target: 'es2020',
    keepNames: true,
    logLevel: 'silent',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-native-web'],
    exclude: ['@expo/vector-icons', 'react-native-safe-area-context', 'react-native-screens'],
  },
}); 