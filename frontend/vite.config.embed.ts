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
        assetFileNames: 'mechanization.[ext]',
        chunkFileNames: 'mechanization-[name].js'
      }
    }
  }
});
