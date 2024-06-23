<script setup lang="ts">
import { usePageStore } from './stores/page';

const { title } = storeToRefs(usePageStore());

watch(title, (val) => {
  window.document.title = val;
});

</script>

<template>
  <VApp>
    <RouterView />
  </VApp>
</template>
