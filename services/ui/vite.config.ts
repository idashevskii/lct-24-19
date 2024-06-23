import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, ViteDevServer } from 'vite'
import vuetify from 'vite-plugin-vuetify'
import svgLoader from 'vite-svg-loader'

const baseUrl = process.env.BASE_URI

const envJsPlugin = () => ({
  name: 'env-js',
  configureServer(server: ViteDevServer) {
    server.middlewares.use(process.env.BASE_URI + '/env.js', async (req, res, next) => {
      // @ts-ignore
      const config = (await import('./public/env.js')).default
      const ret: { [k: string]: string | null } = {}
      for (const k in config) {
        ret[k] = process.env[config[k].replace(/^\$\{(.*)\}$/, '$1')] || null
      }
      res.writeHead(200, { 'Content-Type': 'text/javascript' }).end('export default ' + JSON.stringify(ret) + ';')
    })
  },
})

const restorePrefixedExternalResourcesPlugin = (resources: string[]) => ({
  name: 'restore-prefixed-external-resources',
  transformIndexHtml: (html: string) =>
    resources.reduce((html, resource) => html.replaceAll(baseUrl + resource, resource), html),
})

// https://vitejs.dev/config/
export default defineConfig({
  base: baseUrl,
  plugins: [
    vue(),
    envJsPlugin(),
    restorePrefixedExternalResourcesPlugin(['/favicon.svg']),
    vueJsx(),

    // Docs: https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin
    vuetify({
      styles: {
        configFile: 'src/assets/styles/variables/_vuetify.scss',
      },
    }),
    Components({
      dirs: ['src/@core/components', 'src/components'],
      dts: true,
    }),

    // Docs: https://github.com/antfu/unplugin-auto-import#unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core', '@vueuse/math', 'pinia'],
      vueTemplate: true,

      // ℹ️ Disabled to avoid confusion & accidental usage
      ignore: ['useCookies', 'useStorage'],
    }),
    svgLoader(),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@core': fileURLToPath(new URL('./src/@core', import.meta.url)),
      '@layouts': fileURLToPath(new URL('./src/@layouts', import.meta.url)),
      '@images': fileURLToPath(new URL('./src/assets/images/', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/assets/styles/', import.meta.url)),
      '@configured-variables': fileURLToPath(new URL('./src/assets/styles/variables/_template.scss', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
  optimizeDeps: {
    exclude: ['vuetify'],
    entries: ['./src/**/*.vue'],
  },
  server: {
    strictPort: true,
    host: true,
    port: 80,
    hmr: { clientPort: 443 },
  },
})
