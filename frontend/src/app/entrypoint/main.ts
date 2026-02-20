import { createApp } from 'vue';
import { createPinia } from 'pinia';
import '@/app/styles/reset.scss';
import { VueQueryPlugin } from '@tanstack/vue-query';

import App from './App.vue';

import { router } from '@/app/router';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(VueQueryPlugin, {
  enableDevtoolsV6Plugin: true,
});

app.mount('#app');
