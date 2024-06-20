<script setup lang="ts">
import { AppConfig } from '@/services/AppConfig';
import { usePageStore } from '@/stores/page';
import { useService } from '@/utils/di';
import { onBeforeMount } from 'vue';
import { VSheet } from 'vuetify/components';

const appConfig = useService(AppConfig);

const pageStore = usePageStore();

onBeforeMount(async () => {
  pageStore.setTitle('Документация');
});
</script>

<template>
  <VSheet elevation="6" class="pa-4 ma-4">Раздел в разработке</VSheet>
</template>

<style scoped lang="scss">
</style>