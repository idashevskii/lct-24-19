import 'reflect-metadata';

import { createApp } from 'vue';
import { registerPlugins } from '@core/utils/plugins'
import { createPinia } from 'pinia';
import { createInjector } from '@/utils/di';

import { plugin as formkitPlugin, defaultConfig as formkitDefaultConfig } from '@formkit/vue';

import App from './App.vue';
// import router from './router';
import { AppConfig } from '@/services/AppConfig';
import { ApiService } from '@/services/ApiService';

// import 'vuetify/styles';
// import '@/assets/style.scss';
import '@formkit/themes/genesis'

// Styles
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'



const injector = createInjector({
  services: [AppConfig, ApiService],
});

(async () => {
  try {
    const config = injector.get(AppConfig);
    await config.init();

    const app = createApp(App);

    app.use(createPinia());
    // app.use(router);
    app.use(injector);
    app.use(formkitPlugin, formkitDefaultConfig({
      locale: 'ru',
    }));

    // Register plugins
    registerPlugins(app)

    app.mount('#app');
  } catch (e) {
    alert('Error: ' + e);
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
})();
