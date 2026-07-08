import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  build: {
    outDir: '../spfx/lib/frontend',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/embed/mount.ts'),
      name: 'MechanizationEmbed',
      formats: ['es'],
      fileName: 'mechanization-mount'
    },
    rollupOptions: {
      output: {
        // Единый файл: без раздельных чанков с нестабильными именами,
        // иначе SharePoint/CDN кэширует часть чанков и получается смесь
        // старого и нового кода (например, новый mount + старый router).
        inlineDynamicImports: true,
        assetFileNames: 'mechanization.[ext]'
      }
    }
  }
});
