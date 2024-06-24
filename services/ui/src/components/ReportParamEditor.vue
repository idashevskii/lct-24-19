<script lang="ts" setup>
import { VSheet } from 'vuetify/components'
import { FormKitSchema, FormKit } from '@formkit/vue'
import { type FormKitGroupValue } from '@formkit/core'
import { ref, computed, type Ref, onMounted } from 'vue';
import { SOURCES_ELEMENT, SOURCE_DOCS_ELEMENT, defaultSchema } from '@/models/template-schemas';
import { useService } from '@/utils/di';
import { ApiService } from '@/services/ApiService';
import type { ReportSource, ReportSourceDocument } from '@/models/entities';
import { type FormKitSchemaNode } from '@formkit/core';

const apiService = useService(ApiService);

const sources: Ref<ReportSource[]> = ref([]);
const sourceDocs: Ref<ReportSourceDocument[]> = ref([]);

const model = defineModel<FormKitGroupValue>()

const props = defineProps<{
  schemaName?: string,
}>();

// const json:any={}
// for(const [k, v] of Object.entries(templateSchemas)){
//   json[k]=v;
// }
// console.log(JSON.stringify(json))

const templateSchemas = ref<Record<string, FormKitSchemaNode[]>>()

const schema = computed(() => {
  const ret = (templateSchemas.value && templateSchemas.value[String(props.schemaName)]) || defaultSchema;
  const sourcesOptions = sources.value.map(({ url, title }) => ({ value: url, label: `${url} - ${title}` }));
  const sourceDocsOptions = sourceDocs.value.map(({ id, name, title }) => ({ value: id, label: `${name} - ${title}` }));

  return ret.map((item: any) => {
    if (item.name === SOURCES_ELEMENT) {
      return { ...item, options: sourcesOptions };
    }
    if (item.name === SOURCE_DOCS_ELEMENT) {
      return { ...item, options: sourceDocsOptions };
    }
    return item;
  })
})

onMounted(async () => {
  sources.value = (await apiService.getSourcesCrud().read({})).items;
  sourceDocs.value = (await apiService.getSourceDocsCrud().read({})).items;

  templateSchemas.value = JSON.parse((await apiService.getUserSettings()).get('TOPICS_CONFIG') || '{}');
});

</script>

<template>
  <VSheet class="pa-4 mx-auto" elevation="6" rounded="lg">
    <div class="text-h5 mb-6">Настройка параметров</div>
    <FormKit type="form" v-model="model" :actions="false">
      <FormKitSchema :schema="schema" />
    </FormKit>
  </VSheet>
</template>
