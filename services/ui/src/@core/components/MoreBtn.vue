<script lang="ts" setup>
import { mdiDotsVertical } from '@mdi/js';

const props = defineProps<{
  menuList?: unknown[]
  itemProps?: boolean
}>()
</script>

<template>
  <IconBtn>
    <VIcon :icon="mdiDotsVertical" />

    <VMenu
      v-if="props.menuList"
      activator="parent"
    >
      <VList
        :items="props.menuList"
        :item-props="props.itemProps"
      />
    </VMenu>
  </IconBtn>
</template>
