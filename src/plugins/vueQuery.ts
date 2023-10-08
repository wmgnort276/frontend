import type { App } from 'vue';
import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query';

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  }
};

export function setupVueQuery(app: App<Element>) {
  app.use(VueQueryPlugin, vueQueryPluginOptions);
}
