<script setup lang="ts">
import { ApiService, type ApiConfig } from '@/services/ApiService';
import { AppConfig } from '@/services/AppConfig';
import { usePageStore } from '@/stores/page';
import { useService } from '@/utils/di';
import { onBeforeMount, onMounted, ref } from 'vue';
import { VBtn, VCheckbox, VForm, VSheet, VTextField, VSelect, VListItem, VRow, VCol, VCardText } from 'vuetify/components';
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
  <VRow>
    <VCol cols="12">
      <VCard title="Сторонние сервисы">
        <VCardText class="d-flex">
          <VForm validate-on="submit lazy" @submit.prevent="submit">
            <VRow>
              <VCol cols="12">
                <VCheckbox v-model="settings.dummyApi" label="Режим тестирования" />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <VTextField v-model="settings.tavilyApiKey" label="Ключ Tavily" />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <VSelect v-model="settings.llmPreset" label="LLM Модель" :items="llmModels" item-title="title"
                  item-value="name" />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <VTextField v-model="settings.llmKey" label="Ключ LLM" />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <VBtn :loading="loading" class="mt-2" text="Сохранить" type="submit" block />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

</template>
