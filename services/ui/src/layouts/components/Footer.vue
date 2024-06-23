<script setup lang="ts">
import { APP_NAME } from '@/constants';
</script>

<template>
  <div class="h-100 d-flex align-center justify-space-between">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      {{ APP_NAME }}
      &nbsp;
      Дизайн <a
        href="https://themeselection.com"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary ms-1"
      >ThemeSelection</a>
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 text-primary d-none">
      <a
        href=""
        target="_blank"
        rel="noopener noreferrer"
      >Политика конфиден­циальности</a>
      <a
        href=""
        target="_blank"
        rel="noopener noreferrer"
      >Пользовательское соглашение</a>
    </span>
  </div>
</template>
