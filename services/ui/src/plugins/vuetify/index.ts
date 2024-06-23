import type { App } from 'vue'

import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import defaults from './defaults'
import { themes } from './theme'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

// Styles

import '@core/scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'

export default function (app: App) {
  const vuetify = createVuetify({
    aliases: {
      IconBtn: VBtn,
    },
    icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
    defaults,
    theme: {
      defaultTheme: 'light',
      themes,
    },
  })

  app.use(vuetify)
}
