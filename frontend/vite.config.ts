import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import fs from 'node:fs';

const uiKitRoot = path.resolve(__dirname, '../packages/ui-kit');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const keyPath = path.resolve(__dirname, 'certs/localhost-key.pem');
  const certPath = path.resolve(__dirname, 'certs/localhost.pem');
  const httpsEnabled = fs.existsSync(keyPath) && fs.existsSync(certPath);
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8081';

  return {
    plugins: [vue()],
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
    base: '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          entryFileNames: 'assets/mechanization.js',
          chunkFileNames: 'assets/mechanization-[name].js',
          assetFileNames: 'assets/mechanization.[ext]'
        }
      }
    },
    server: {
      port: 5173,
      host: true,
      https: httpsEnabled
        ? {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath)
          }
        : undefined,
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true
        }
      }
    }
  };
});
