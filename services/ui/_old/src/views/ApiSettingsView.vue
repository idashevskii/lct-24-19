<script setup lang="ts">
import { ApiService, type ApiConfig } from '@/services/ApiService';
import { AppConfig } from '@/services/AppConfig';
import { usePageStore } from '@/stores/page';
import { useService } from '@/utils/di';
import { onBeforeMount, onMounted, ref } from 'vue';
import { VBtn, VCheckbox, VForm, VSheet, VTextField, VSelect, VListItem } from 'vuetify/components';
import { llmModels } from '@/data/llm-models'


const appConfig = useService(AppConfig);
const apiService = useService(ApiService);

const pageStore = usePageStore();

onBeforeMount(async () => {
  pageStore.setTitle('Настройки сторонних сервисов');
});

const loading = ref(false)

const submit = async () => {
  loading.value = true

  apiService.setApiConfig(settings.value)

  loading.value = false
}

const settings = ref<ApiConfig>({} as ApiConfig)

onMounted(async () => {
  loading.value = true

  settings.value = await apiService.getApiConfig();

  loading.value = false
})

</script>

<template>
  <VSheet class="mx-auto" max-width="480">
    <VForm validate-on="submit lazy" @submit.prevent="submit">
      <VCheckbox v-model="settings.dummyApi" label="Режим тестирования" />

      <VTextField v-model="settings.tavilyApiKey" label="Ключ Tavily" />

      <VSelect v-model="settings.llmPreset" label="LLM Модель" :items="llmModels" item-title="title" item-value="name" />

      <VTextField v-model="settings.llmKey" label="Ключ LLM" />

      <VBtn :loading="loading" class="mt-2" text="Сохранить" type="submit" block />
    </VForm>
  </VSheet>
</template>
