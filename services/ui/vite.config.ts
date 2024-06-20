import { fileURLToPath, URL } from 'node:url';

import { defineConfig, ViteDevServer } from 'vite';
import vue from '@vitejs/plugin-vue';

const baseUrl = process.env.BASE_URI;

const envJsPlugin = () => ({
  name: 'env-js',
  configureServer(server: ViteDevServer) {
    server.middlewares.use(process.env.BASE_URI + '/env.js', async (req, res, next) => {
      // @ts-ignore
      const config = (await import('./public/env.js')).default;
      const ret: { [k: string]: string | null } = {};
      for (const k in config) {
        ret[k] = process.env[config[k].replace(/^\$\{(.*)\}$/, '$1')] || null;
      }
      res
        .writeHead(200, { 'Content-Type': 'text/javascript' })
        .end('export default ' + JSON.stringify(ret) + ';');
    });
  },
});

const restorePrefixedExternalResourcesPlugin = (resources: string[]) => ({
  name: 'restore-prefixed-external-resources',
  transformIndexHtml: (html: string) =>
    resources.reduce((html, resource) => html.replace(baseUrl + resource, resource), html),
});

// https://vitejs.dev/config/
export default defineConfig({
  base: baseUrl,
  plugins: [vue(), envJsPlugin(), restorePrefixedExternalResourcesPlugin(['/favicon.svg'])],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    strictPort: true,
    host: true,
    port: 80,
    hmr: { clientPort: 443 },
  },
});
