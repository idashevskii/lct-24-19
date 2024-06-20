<script setup lang="ts">
import { AppConfig } from '@/services/AppConfig';
import { ApiService, } from '@/services/ApiService';
import { type Report, type ReportTemplate, type ReportTopic } from '@/models/entities';
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
} from 'vuetify/components';
import Crud, { type CrudConfig, type CrudDtHeaders } from '@/components/Crud.vue';
import ReportTopicView from '@/components/ReportTopicView.vue';
import { indexBy } from '@/utils/collections';
import ReportParamEditor from '@/components/ReportParamEditor.vue';
import { mdiFileEye } from '@mdi/js';
import type { RouteLocationRaw } from 'vue-router';
import { Route } from '@/router';
import { formatDate } from '@/utils/dates';

const appConfig = useService(AppConfig);
const apiService = useService(ApiService);

const pageStore = usePageStore();

onBeforeMount(async () => {
  pageStore.setTitle('Отчёты');
});

const reportTopicsCrud = apiService.getReportTopicsCrud();
const reportTemplatesCrud = apiService.getReportTemplatesCrud();

const crudProvider: CrudConfig<Report> = {
  headers: [
    { title: 'Название', align: 'start', key: 'title', },
    { title: 'Шаблон', key: 'template_title', align: 'start', sortable: false },
    { title: 'Создан', key: 'createdAt', align: 'end' },
  ],
  api: apiService.getReportsCrud(),
  editingMapper: async (item) => {
    const template = getReportTemplate(item)
    if (template) {
      item = { ...item, parameters: { ...template.parameters, ...item.parameters } }
    }
    if(!item.title){
      item.title=`Отчёт за ${formatDate(new Date())}`
    }
    return item;
  },
  onCreate: async (item, next) => {
    creatingNext = next;
    creatingItem.value = item;
    dialogSelectTemplate.value = true;
  }
};

const reportTopics = ref<ReportTopic[]>([])
const reportTemplates = ref<ReportTemplate[]>([])
const topics = computed(() => indexBy(reportTopics.value, 'id'))
const templates = computed(() => indexBy(reportTemplates.value, 'id'))
onMounted(async () => {
  reportTopics.value = (await reportTopicsCrud.read({})).items;
  reportTemplates.value = (await reportTemplatesCrud.read({})).items;
})

const getReportTemplate = (item: Partial<Report>) => item?.templateId ? templates.value[item.templateId] : undefined;
const getReportTopic = (item: Partial<Report>) => {
  const template = getReportTemplate(item)
  if (template) {
    return topics.value[template.topicId]
  }
  return undefined;
};

const dialogSelectTemplate = ref(false);

let creatingNext: undefined | ((item: Partial<Report>) => Promise<void>) = undefined;
const creatingItem = ref<Partial<Report>>({});

const closeEdit = () => {
  creatingNext = undefined;
  dialogSelectTemplate.value = false;
};

const save = async () => {
  if (creatingNext) {
    creatingNext(creatingItem.value)
  }
  closeEdit();
};

const reportToRoute = (item: Report): RouteLocationRaw => {
  return { name: Route.REPORT, params: { id: item.id } };
}

</script>

<template>
  <Crud :provider="crudProvider">
    <template v-slot:item.title="{ item }">
      <RouterLink :to="reportToRoute(item)">{{ item.title }}</RouterLink>
    </template>
    <template v-slot:item.template_title="{ item }">
      <div class="mb-1">{{ getReportTemplate(item)?.title }}</div>
      <div class="text-disabled">
        <ReportTopicView :item="getReportTopic(item)" />
      </div>
    </template>
    <template v-slot:item.createdAt="{ item }">
      {{ item?.createdAt.toLocaleDateString() }}
    </template>
    <template v-slot:editForm="{ item }">
      <VContainer>
        <VRow>
          <VCol cols="12">
            <VTextField v-model="item.title" label="Название отчёта"></VTextField>
          </VCol>
          <VCol cols="12">
            <ReportTopicView :item="getReportTopic(item)" />
          </VCol>
          <VCol cols="12" v-if="getReportTopic(item)">
            <ReportParamEditor v-model="item.parameters" :schema-name="getReportTopic(item)?.code" />
          </VCol>
        </VRow>
      </VContainer>
    </template>
    <template v-slot:extraActions="{ item }">
      <RouterLink :to="reportToRoute(item)">
        <VIcon size="small" :icon="mdiFileEye" />
      </RouterLink>
    </template>
  </Crud>

  <VDialog v-model="dialogSelectTemplate" max-width="480px">
    <VCard>
      <VCardTitle>
        <span class="text-h5">Выбор шаблона для нового отчёта</span>
      </VCardTitle>
      <VCardText>
        <VSelect v-model="creatingItem.templateId" :items="reportTemplates" clearable label="Шаблон" item-value="id"
          item-title="title">
          <template v-slot:item="{ props, item }">
            <VListItem v-bind="props" :subtitle="topics[item.raw.topicId]?.title"></VListItem>
          </template>
        </VSelect>
      </VCardText>
      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn color="blue-darken-1" variant="text" @click="closeEdit">Отмена</VBtn>
        <VBtn color="blue-darken-1" variant="text" @click="save">Создать</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
