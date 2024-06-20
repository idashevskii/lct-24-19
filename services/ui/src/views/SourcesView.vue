<script setup lang="ts">
import { ApiService } from '@/services/ApiService';
import { type ReportSource, } from '@/models/entities';
import { usePageStore } from '@/stores/page';
import { useService } from '@/utils/di';
import { onBeforeMount } from 'vue';
import { VTextField, VContainer, VRow, VCol, VChip } from 'vuetify/components';
import Crud, { type CrudConfig } from '@/components/Crud.vue';

const apiService = useService(ApiService);

const pageStore = usePageStore();

onBeforeMount(async () => {
  pageStore.setTitle('Источники данных - веб');
});

const crudProvider: CrudConfig<ReportSource> = {
  headers: [
    { key: 'title', title: 'Название', align: 'start', },
    { key: 'description', title: 'Описание', align: 'start', },
    { key: 'auth', title: 'Авторизация', align: 'start', sortable: false },
    { key: 'available', title: 'Доступность', align: 'start' },
  ],
  api: apiService.getSourcesCrud(),
};

</script>

<template>
  <Crud :provider="crudProvider">
    <template v-slot:item.available="{ item }">
      <VChip :color="item.available ? 'green' : 'red'" :text="item.available ? 'Доступен' : 'Нет доступа'" size="small"
        label></VChip>
    </template>
    <template v-slot:item.auth="{ item }">
      <VChip :color="item.authRequred ? 'orange' : 'green'" :text="item.available ? 'Не требуется' : 'Требуется'"
        size="small" label></VChip>
    </template>
    <template v-slot:item.title="{ item }">
      <a :href="item.url" target="_blank">{{ item.title }}</a>
    </template>
    <template v-slot:editForm="{ item }">
      <VContainer>
        <VRow>
          <VCol cols="12">
            <VTextField v-model="item.title" label="Название"></VTextField>
          </VCol>
          <VCol cols="12">
            <VTextField v-model="item.description" label="Описание"></VTextField>
          </VCol>
          <VCol cols="12">
            <VTextField v-model="item.url" label="URL"></VTextField>
          </VCol>
        </VRow>
      </VContainer>
    </template>
  </Crud>
</template>