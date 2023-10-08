import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { checker } from 'vite-plugin-checker';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import path from 'path';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import legacy from '@vitejs/plugin-legacy';
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
		esbuildOptions: {
			legalComments: 'none'
		}
	},
  plugins: [
    vue(),
    VueI18nPlugin({
      include: [path.resolve(__dirname, './src/locales/**')]
    }),
    Components({
      resolvers: [AntDesignVueResolver()]
    }),
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    ckeditor5({ theme: require.resolve('@ckeditor/ckeditor5-theme-lark') })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  envPrefix: 'VUE_',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
});
