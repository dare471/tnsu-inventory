import { defineConfig, type Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

const uiKitRoot = path.resolve(__dirname, '../packages/ui-kit');

/** SPFx loads only mechanization-mount.js — extracted Vue/ui-kit CSS must live inside the bundle. */
function inlineExtractedCss(): Plugin {
  return {
    name: 'inline-extracted-css',
    enforce: 'post',
    generateBundle(_, bundle) {
      const cssChunk = Object.entries(bundle).find(([name, item]) =>
        item.type === 'asset' && name.endsWith('.css')
      );
      if (!cssChunk) return;

      const [, asset] = cssChunk;
      if (asset.type !== 'asset') return;

      const css = asset.source.toString();
      const jsEntry = Object.values(bundle).find(
        (item) => item.type === 'chunk' && item.isEntry
      );
      if (!jsEntry || jsEntry.type !== 'chunk') return;

      const inject = `(function(){if(typeof document!=='undefined'&&!document.getElementById('mechanization-vue-styles')){var s=document.createElement('style');s.id='mechanization-vue-styles';s.textContent=${JSON.stringify(css)};document.head.appendChild(s);}})();`;
      jsEntry.code = inject + jsEntry.code;
      delete bundle[cssChunk[0]];
    }
  };
}

export default defineConfig({
  plugins: [vue(), inlineExtractedCss()],
  resolve: {
    alias: [
      {
        find: /@tnsu\/ui-kit-vue\/styles\.css/,
        replacement: path.resolve(uiKitRoot, 'src/styles.css')
      },
      {
        find: '@tnsu/ui-kit-vue',
        replacement: path.resolve(uiKitRoot, 'src/index.ts')
      },
      { find: '@', replacement: path.resolve(__dirname, 'src') }
    ]
  },
  build: {
    outDir: '../spfx/lib/frontend',
    emptyOutDir: true,
    assetsInlineLimit: 5_000_000,
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
