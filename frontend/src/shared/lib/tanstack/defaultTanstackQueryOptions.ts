import { type VueQueryPluginOptions } from '@tanstack/vue-query';

export const defaultTanstackQueryOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      mutations: {},
      queries: {
        retry: false,
      },
    },
  },
};
