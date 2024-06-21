<script lang="ts" setup generic="T">
import { mdiDelete, mdiPencil, mdiPlusCircleOutline } from '@mdi/js';
import {
  VToolbar, VDivider, VDialog,
  VCard, VCardText,
  VDataTableServer,
  VBtn,
  VSpacer,
  VCardTitle,
  VTextField,
  VCardActions,
  VIcon
} from 'vuetify/components'
import { ref, computed, type Ref } from 'vue';
import type { CrudApiProvider } from '@/services/ApiService';

export interface CrudConfig<T> {
  headers: CrudDtHeaders[],
  api: CrudApiProvider<T>,
  editingMapper?: (item: Partial<T>) => Promise<Partial<T>>,
  savingMapper?: (item: Partial<T>) => Promise<Partial<T>>,
  onCreate?: (item: Partial<T>, next: (item: Partial<T>) => Promise<void>) => Promise<void>,
}

export interface CrudDtHeaders { }

import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

const props = defineProps<{
  provider: CrudConfig<T>,
}>()

const dialogEdit = ref(false);
const dialogDelete = ref(false);
const editedItem: Ref<Partial<T> | null> = ref(null);
let deletingItem: T | null = null;

const itemsPerPage = ref(10)
const page = ref(1)
const serverItems: Ref<T[]> = ref([])
const loading = ref(true)
const totalItems = ref(0)
const search = ref('')
const sortBy = ref([{ key: props.provider.api.keyProp as string, order: 'desc' }]) as Ref<any[]>

const isEditing = computed(() => !!(editedItem.value && editedItem.value[props.provider.api.keyProp]));

const prepareEditingItem = async (item: Partial<T>) => props.provider.editingMapper ? await props.provider.editingMapper(item) : item;

const createItem = async () => {
  let item = {};
  const next = async (item: Partial<T>) => {
    editedItem.value = await prepareEditingItem(item);
    dialogEdit.value = true;
  }
  if (props.provider.onCreate) {
    await props.provider.onCreate(item, next)
  } else {
    await next(item)
  }
};

const editItem = async (item: T) => {
  editedItem.value = await prepareEditingItem({ ...item });
  dialogEdit.value = true;
};

const deleteItem = (item: T) => {
  deletingItem = item;
  dialogDelete.value = true;
};

const deleteItemConfirm = async () => {
  if (deletingItem) {
    loading.value = true;
    await props.provider.api.delete(deletingItem)
    deletingItem = null;
    loading.value = false;
    await update();
  }
  closeDelete();
};

const closeEdit = () => {
  dialogEdit.value = false;
};

const closeDelete = () => {
  dialogDelete.value = false;
};

const save = async () => {
  let item = editedItem.value as T;
  if (item) {
    loading.value = true;
    if (props.provider.savingMapper) {
      item = await props.provider.savingMapper(item) as T
    }
    if (isEditing.value) {
      await props.provider.api.update(item)
    } else {
      await props.provider.api.create(item)
    }
    loading.value = false;
    await update();
  }
  closeEdit();
};

const loadItems = async ({ page, itemsPerPage, sortBy }: any) => {
  loading.value = true
  const { items, total } = await props.provider.api.read({
    page, perPage: itemsPerPage, sorting: sortBy.map(({ key, order }: any) => ({ key, reverse: order === 'desc' })), searchQuery: search.value,
  })
  serverItems.value = items;
  totalItems.value = total;
  loading.value = false;
}

const update = () => loadItems({
  page: page.value,
  itemsPerPage: itemsPerPage.value,
  sortBy: sortBy.value,
})

const headers = [
  { title: '#', align: 'start', sortable: true, key: props.provider.api.keyProp },
  ...props.provider.headers,
  { title: 'Действия', key: 'actions', sortable: false },
]

defineSlots<({
  [k in `item.${string}`]: (props: { item: T }) => any
} & {
  editForm(props: { item: T }): any
  extraActions(props: { item: T }): any
})>()

</script>

<template>
  <VDataTableServer v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems" v-model:page="page"
    :items-per-page-options="[5, 10, 20, 50, 100]" :items-length="totalItems" :loading="loading" :search="search"
    item-value="name" @update:options="loadItems" loading-text="Загрузка данных.." v-model:sort-by="sortBy" multi-sort>
    <template v-slot:top>
      <VToolbar flat>
        <VTextField v-model="search" class="ma-2" density="compact" placeholder="Поиск" hide-details />
        <VDivider class="mx-4" inset vertical />
        <VSpacer />
        <VBtn color="primary" @click="createItem()" :prepend-icon="mdiPlusCircleOutline">Создать</VBtn>
      </VToolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <div class="d-flex justify-center ga-2">
        <slot name="extraActions" :item="item" />
        <VIcon size="small" @click="editItem(item)" :icon="mdiPencil" />
        <VIcon size="small" @click="deleteItem(item)" :icon="mdiDelete" />
      </div>
    </template>
    <template v-slot:no-data>Данных не найдено</template>
    <template v-for="(_, name) in $slots as unknown as Record<`item.${string}`, any>" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </VDataTableServer>

  <VDialog v-model="dialogEdit" :fullscreen="mobile" max-width="480px" persistent>
    <VCard>
      <VCardTitle>
        <span class="text-h5">{{ isEditing ? 'Модификация' : 'Создание' }}</span>
      </VCardTitle>
      <VCardText class="pa-0">
        <slot name="editForm" :item="editedItem as T"></slot>
      </VCardText>
      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn color="blue-darken-1" variant="text" @click="closeEdit">Отмена</VBtn>
        <VBtn color="blue-darken-1" variant="text" @click="save">Сохранить</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="dialogDelete" max-width="500px">
    <VCard>
      <VCardTitle class="text-h5">Вы уверены, что хотите удалить?</VCardTitle>
      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn color="blue-darken-1" variant="text" @click="closeDelete">Отмена</VBtn>
        <VBtn color="blue-darken-1" variant="text" @click="deleteItemConfirm">Да</VBtn>
        <VSpacer></VSpacer>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
