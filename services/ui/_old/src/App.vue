<script setup lang="ts">
import { RouterView } from 'vue-router';
import { ref } from 'vue';
import {
  VMain,
  VList,
  VAppBar,
  VNavigationDrawer,
  VApp,
  VAppBarNavIcon,
  VToolbarTitle,
  VListItem,
  VMenu,
  VListItemTitle,
  VBtn,
} from 'vuetify/components';
import { mdiDotsVertical, mdiLogout } from '@mdi/js';
import { useService } from './utils/di';
import { usePageStore } from './stores/page';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import NavigationMenu from './components/NavigationMenu.vue';


const { title } = storeToRefs(usePageStore());

watch(title, (val) => {
  window.document.title = val;
});

const logout = () => {
  window.location.reload();
};

const drawer = ref(true);
</script>

<template>
  <VApp>
    <VNavigationDrawer v-model="drawer">
      <NavigationMenu />
    </VNavigationDrawer>

    <VAppBar density="compact" color="primary">
      <template v-slot:prepend>
        <VAppBarNavIcon @click="drawer = !drawer"></VAppBarNavIcon>
      </template>

      <VToolbarTitle>{{ title }}</VToolbarTitle>

      <template v-slot:append>
        <VMenu>
          <template v-slot:activator="{ props }">
            <VBtn :icon="mdiDotsVertical" v-bind="props"></VBtn>
          </template>
          <VList>
            <VListItem @click="logout" :prepend-icon="mdiLogout">
              <VListItemTitle>Выход</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </template>
    </VAppBar>

    <VMain>
      <RouterView />
    </VMain>
  </VApp>
</template>

<style scoped></style>
