<script lang="ts" setup>
import {
  VIcon
} from 'vuetify/components'
import { computed } from 'vue';

import { templateIcons, DEFAULT_SCHEMA } from '@/models/template-schemas';
import type { ReportTopic } from '@/models/entities';

const props = defineProps<{
  item?: Partial<ReportTopic>,
}>()

const icon = computed(() => props.item?.code && templateIcons[props.item.code] || templateIcons[DEFAULT_SCHEMA])

</script>

<template>
  <VIcon :icon="icon"></VIcon>
  <span class="ps-1 label">{{ item?.title }}</span>
</template>

<style lang="scss" scoped>
.label {
  vertical-align: middle
}
</style>