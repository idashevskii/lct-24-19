<script setup lang="ts">
import VueMarkdown from 'vue-markdown-render';
import { VSheet } from 'vuetify/components';


defineProps<{
  content?: string
}>()

</script>

<template>
  <VSheet elevation="2" class="ma-3 pa-3 markdown-render" v-if="content">
    <VueMarkdown :source="content" />
  </VSheet>
</template>

<style lang="scss" scoped>
.markdown-render {
  :deep() {

    ul,
    ol {
      margin-left: 20px;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 0.5em;
      margin-bottom: 0.25em;
    }

    p {
      margin-bottom: 0.25em;
    }

    pre {
      background: #eee;
      padding: 1em;
      margin-top: 1em;
      margin-bottom: 1em;
      overflow: auto;
      max-width: 100%;
    }
  }
}
</style>
