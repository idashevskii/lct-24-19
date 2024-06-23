<script lang="ts" setup>
import { useRoute } from 'vue-router'
import AccountSettingsAccount from '@/views/pages/account-settings/AccountSettingsAccount.vue'
import AccountSettingsNotification from '@/views/pages/account-settings/AccountSettingsNotification.vue'
import AccountSettingsSecurity from '@/views/pages/account-settings/AccountSettingsSecurity.vue'
import { mdiAccountEdit, mdiBellCog, mdiShieldAccount } from '@mdi/js';
import { usePageStore } from '@/stores/page';

const route = useRoute()

const activeTab = ref(route.params.tab)


const pageStore = usePageStore();

onBeforeMount(async () => {
  pageStore.setTitle('Настройки аккаунта');
});


// tabs
const tabs = [
  { title: 'Профиль', icon: mdiAccountEdit, tab: 'account' },
  { title: 'Безопасность', icon: mdiShieldAccount, tab: 'security' },
  { title: 'Уведомления', icon: mdiBellCog, tab: 'notification' },
]
</script>

<template>
  <div>
    <VTabs
      v-model="activeTab"
      show-arrows
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
      :touch="false"
    >
      <!-- Account -->
      <VWindowItem value="account">
        <AccountSettingsAccount />
      </VWindowItem>

      <!-- Security -->
      <VWindowItem value="security">
        <AccountSettingsSecurity />
      </VWindowItem>

      <!-- Notification -->
      <VWindowItem value="notification">
        <AccountSettingsNotification />
      </VWindowItem>
    </VWindow>
  </div>
</template>
