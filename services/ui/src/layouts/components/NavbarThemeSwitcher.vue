<script setup lang="ts">
import type { ThemeSwitcherTheme } from '@layouts/types'
import { mdiWeatherNight, mdiWeatherSunny, mdiWeatherSunset } from '@mdi/js';

const themes: ThemeSwitcherTheme[] = [
  {
    name: 'light',
    icon: mdiWeatherSunny,
  },
  {
    name: 'dark',
    icon: mdiWeatherNight,
  },
]
</script>

<template>
  <ThemeSwitcher :themes="themes" />
</template>
