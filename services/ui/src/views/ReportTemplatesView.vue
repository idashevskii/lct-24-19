<script setup lang="ts">
import { ApiService } from '@/services/ApiService';
import { type Report, type ReportSource, type ReportTemplate, type ReportTopic } from '@/models/entities';
import { usePageStore } from '@/stores/page';
import { useService } from '@/utils/di';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { VTextField, VContainer, VRow, VCol, VSelect, VListItem, VSheet } from 'vuetify/components';
import Crud, { type CrudConfig } from '@/components/Crud.vue';
import ReportParamEditor from '@/components/ReportParamEditor.vue';
import { indexBy } from '@/utils/collections';
import ReportTopicView from '@/components/ReportTopicView.vue';
import { formatDate } from '@/utils/dates';

const apiService = useService(ApiService);

const pageStore = usePageStore();

onBeforeMount(async () => {
  pageStore.setTitle('Шаблоны отчётов');
});


const reportTopicsCrud = apiService.getReportTopicsCrud();
const reportTopics = ref<ReportTopic[]>([])
onMounted(async () => {
  reportTopics.value = (await reportTopicsCrud.read({})).items;
})
const topics = computed(() => indexBy(reportTopics.value, 'id'))


const crudProvider: CrudConfig<ReportTemplate> = {
  headers: [
    { key: 'title', title: 'Название', align: 'start', },
    { key: 'topic', title: 'Тема', align: 'start', sortable: false, },
    { key: 'createdAt', title: 'Создан', align: 'start', },
  ],
  api: apiService.getReportTemplatesCrud(),
  editingMapper: async (item) => {
    if (!item.title) {
      item.title = `Шаблон отчёта от ${formatDate(new Date())}`
    }
    return item;
  },
};

</script>

<template>
  <Crud :provider="crudProvider">
    <template v-slot:item.createdAt="{ item }">
      {{ item?.createdAt.toLocaleDateString() }}
    </template>
    <template v-slot:item.topic="{ item }">
      <ReportTopicView :item="topics[item.topicId]" />
    </template>
    <template v-slot:editForm="{ item }">
      <VContainer>
        <VRow>
          <VCol cols="12">
            <VTextField v-model="item.title" label="Название"></VTextField>
          </VCol>
          <VCol cols="12">
            <VSelect v-model="item.topicId" :items="reportTopics" clearable label="Тема" item-value="id"
              item-title="title">
              <template v-slot:item="{ props }">
                <VListItem v-bind="props" />
              </template>
            </VSelect>
          </VCol>
          <VCol cols="12" v-if="item.topicId">
            <ReportParamEditor v-model="item.parameters" :schema-name="topics[item.topicId]?.code" />
          </VCol>
        </VRow>
      </VContainer>
    </template>
  </Crud>
</template>