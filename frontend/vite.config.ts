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
      host: true,
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
