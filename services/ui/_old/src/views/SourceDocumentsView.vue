<script setup lang="ts">
import { ApiService } from '@/services/ApiService';
import { type ReportSourceDocument, } from '@/models/entities';
import { usePageStore } from '@/stores/page';
import { useService } from '@/utils/di';
import { onBeforeMount, ref } from 'vue';
import { VTextField, VContainer, VRow, VCol, VFileInput, VIcon } from 'vuetify/components';
import Crud, { type CrudConfig } from '@/components/Crud.vue';
import { arrayBufferToBase64 } from '@/utils/files'
import { mdiDownload, mdiFileEye } from '@mdi/js';

const apiService = useService(ApiService);

const pageStore = usePageStore();

onBeforeMount(async () => {
  pageStore.setTitle('Источники данных - документы');
});

const crudProvider: CrudConfig<ReportSourceDocument> = {
  headers: [
    { key: 'title', title: 'Название', align: 'start', },
    { key: 'file', title: 'Файл', align: 'start', sortable: false },
    { key: 'createdAt', title: 'Создан', align: 'end' },
  ],
  api: apiService.getSourceDocsCrud(),
  savingMapper: async (item) => {
    if (attachment.value) {
      const file = attachment.value
      item.mime = file.type
      item.name = file.name
      item.content = arrayBufferToBase64(await file.arrayBuffer());
      attachment.value = undefined;
      if (!item.title) {
        item.title = file.name.replace('_', ' ').replace(/\.\w+$/, '')
      }
    }
    return item;
  }
};

const downloadUrl = (item: ReportSourceDocument, download: boolean) => {
  return apiService.getSourceDocDownloadUrl(item, download);
}

const attachment = ref<File>()

</script>

<template>
  <Crud :provider="crudProvider">
    <template v-slot:item.title="{ item }">
      <a :href="downloadUrl(item, false)" target="_blank">{{ item.title }}</a>
    </template>
    <template v-slot:item.file="{ item }">
      <div class="mb-1">{{ item.name }}</div>
      <div class="text-disabled">{{ item.mime }}</div>
    </template>
    <template v-slot:item.createdAt="{ item }">
      {{ item?.createdAt.toLocaleDateString() }}
    </template>
    <template v-slot:editForm="{ item }">
      <VContainer>
        <VRow>
          <VCol cols="12">
            <VTextField v-model="item.title" label="Название" hint="Не обязательно" :persistentHint="true" />
          </VCol>
          <VCol cols="12">
            <VFileInput v-model="attachment" label="Файл" clearable />
          </VCol>
        </VRow>
      </VContainer>
    </template>
    <template v-slot:extraActions="{ item }">
      <a :href="downloadUrl(item, false)" target="_blank">
        <VIcon size="small" :icon="mdiFileEye" />
      </a>
      <a :href="downloadUrl(item, true)" target="_blank">
        <VIcon size="small" :icon="mdiDownload" />
      </a>
    </template>
  </Crud>
</template>