import { readFileSync } from 'node:fs';

import { defineConfig, type PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vite.dev/config/
export default defineConfig(async ({ command }) => {
  const plugins: PluginOption[] = [vue(), vueJsx()];

  if (command === 'serve') {
    const vueDevTools = await import('vite-plugin-vue-devtools').then(
      (m) => m.default,
    );

    plugins.push(vueDevTools({ launchEditor: 'webstorm' }));
  }

  return {
    envDir: './src/app/env',
    publicDir: './public',
    server: {
      host: 'rent-o-meter.kottofey.ru',
      https: {
        key: readFileSync('../.ssl/kottofey.ru/privkey.pem'),
        cert: readFileSync('../.ssl/kottofey.ru/fullchain.pem'),
      },
      port: 5173,
      strictPort: true,
      proxy: {
        '/api/v1': {
          target: 'http://localhost:9999',
          changeOrigin: true,
          // rewrite: (path: string) => path.replace(/^\/api\/v1/, '/api/v1'),
        },
      },
    },
    build: {
      emptyOutDir: true,
      outDir: './dist',
      target: 'esnext',
      sourcemap: command === 'serve',
      rollupOptions: {},
    },
    plugins,
    resolve: {
      alias: [{ find: '@', replacement: '/src' }],
    },
  };
});
