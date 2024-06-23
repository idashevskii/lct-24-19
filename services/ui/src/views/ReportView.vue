<script setup lang="ts">
import { AppConfig } from '@/services/AppConfig';
import { ApiService, } from '@/services/ApiService';
import { type Report, type ReportDocument, type ReportTemplate, type ReportTopic } from '@/models/entities';
import { usePageStore } from '@/stores/page';
import { useService } from '@/utils/di';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import {
  VSelect, VTextField, VContainer, VRow, VCol, VListItem, VToolbar, VDivider, VDialog,
  VCard, VCardText,
  VBtn,
  VSpacer,
  VCardTitle,
  VCardActions,
  VIcon,
  VProgressCircular,
  VSheet,
  VToolbarTitle,
  VTextarea,
  VAlert,
} from 'vuetify/components';
import { mdiChartBoxPlusOutline, mdiCheckOutline, mdiCogPlayOutline, mdiNoteEditOutline } from '@mdi/js';
import { useRoute } from 'vue-router';

import MarkdownViewer from '@/components/MarkdownViewer.vue';

const appConfig = useService(AppConfig);
const apiService = useService(ApiService);

const pageStore = usePageStore();

const route = useRoute()

const report = ref<Report>()

const update = async () => {
  pageStore.setTitle('Просмотр отчёта');

  report.value = await apiService.getReport(Number(route.params.id), { withDocuments: true })
  const docs = report.value?.documents;
  if (docs) {
    selectedDocument.value = docs[docs.length - 1]
  }
}

onBeforeMount(update);

const loading = ref(false)

const documents = computed(() => report.value?.documents || [])

const runGenerate = async () => {
  if (!report.value) {
    return;
  }
  loading.value = true;

  await apiService.generateReport(report.value.id);
  await update();

  loading.value = false;
}

const openRegenerate = async () => {
  regenDialog.value = true
}

const runRegen = async () => {
  closeRegen();
  if (!report.value || !selectedDocument.value) {
    return;
  }

  loading.value = true;

  await apiService.regenerateReport(report.value.id, {
    prompt: regenPrompt.value,
    reportDocId: selectedDocument.value.id,
    selectionStart: selectionStart.value,
    selectionLength: selectionLength.value,
  });
  await update();

  loading.value = false;
}

const closeRegen = async () => {
  regenDialog.value = false
}

const selectedDocument = ref<ReportDocument>()

const regenDialog = ref(false)
const regenPrompt = ref('')

const selectionStart = ref(0)
const selectionLength = ref(0)

const renderSelection = () => {
  const sel = window.getSelection();
  if (sel && sel.anchorNode?.parentNode === selectionArea.value && sel.focusNode?.parentNode === selectionArea.value) {
    const from = Math.min(sel.anchorOffset, sel.focusOffset)
    const to = Math.max(sel.anchorOffset, sel.focusOffset)
    if (to > from) {
      selectionStart.value = from
      selectionLength.value = to - from
    }
  }
};

const selectionArea = ref<HTMLElement>()

</script>

<template>
  
  <VRow>
    <VCol cols="12">
      <VCard title="Сторонние сервисы">
        <VCardText>
  
  
  <VToolbar flat>
    <VToolbarTitle>{{ report?.title }}</VToolbarTitle>
    <VSpacer />
    <VDivider class="mx-4" inset vertical />
    <!--
    <VBtn color="primary" :prepend-icon="mdiChartBoxPlusOutline">Нарисовать графики</VBtn>
    <VBtn color="primary" :prepend-icon="mdiCheckOutline">Сделать фактчекинг</VBtn>
    -->
    <VBtn color="primary" @click="openRegenerate()" :prepend-icon="mdiNoteEditOutline">Внести правки</VBtn>
    <VBtn color="primary" @click="runGenerate()" :prepend-icon="mdiCogPlayOutline">Сгенерировать</VBtn>
  </VToolbar>
  <VSheet elevation="5" class="ma-3 pa-3" v-if="loading">
    <div class="text-center">
      <VProgressCircular indeterminate></VProgressCircular>
    </div>
  </VSheet>
  <div class="my-3 py-3">
    <VSelect v-model="selectedDocument" :items="documents" clearable label="Документ" return-object item-value="id"
      item-title="name">
      <template v-slot:selection="{ item }">#{{ item.raw.id }}: {{ item.raw.name }}, {{ item.raw.createdAt }}</template>
      <template v-slot:item="{ props, item }">
        <VListItem v-bind="props" :subtitle="'#' + item.raw.id + ' ' + item.raw.createdAt" />
      </template>
    </VSelect>
  </div>

  <MarkdownViewer :content="selectedDocument?.content" />

  
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  
  <VDialog v-model="regenDialog" max-width="640px">
    <VCard>
      <VCardTitle>
        <span class="text-h5">Внесение правок в текущий документ</span>
      </VCardTitle>
      <VCardText>
        <VTextarea v-model="regenPrompt" label="Описание необходимых изменений" />
        <div class="my-1">Выделите фрагмент документа, который необходимо изменить:</div>
        <pre ref="selectionArea" class="regen-source" @mouseup="renderSelection()" @touchend="renderSelection()">{{
          selectedDocument?.content }}</pre>
        <div v-if="selectionLength" class="my-1 text-disabled">Выбрано {{ selectionLength }} символов, начиная от {{
          selectionStart }}</div>
        <VAlert class="my-2" v-else text="Фрагмент текста не выбран" type="warning" />
      </VCardText>
      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn color="blue-darken-1" variant="text" @click="closeRegen">Отмена</VBtn>
        <VBtn color="blue-darken-1" variant="text" @click="runRegen">Готово</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.regen-source {
  overflow: auto;
  max-width: 100%;
  background: #eee;
  padding: 1em;
  max-height: 320px;
}
</style>
