<script lang="ts" setup>
import avatar1 from '@images/avatars/avatar-1.png'
import { mdiRefresh, mdiUpload } from '@mdi/js';

const accountData = {
  avatarImg: avatar1,
  firstName: 'Иван',
  lastName: 'Петров',
  email: 'my@example.com',
  country: 'Россия',
  language: 'Русский',
  timezone: '(GMT+02:00) International Date Line West',
}

const refInputEl = ref<HTMLElement>()

const accountDataLocal = ref(structuredClone(accountData))
const isAccountDeactivated = ref(false)

const resetForm = () => {
  accountDataLocal.value = structuredClone(accountData)
}

// changeAvatar function
const changeAvatar = (file: Event) => {
  const fileReader = new FileReader()
  const { files } = file.target as HTMLInputElement

  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string')
        accountDataLocal.value.avatarImg = fileReader.result
    }
  }
}

// reset avatar image
const resetAvatar = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg
}

const timezones = [
  '(GMT-11:00) International Date Line West',
  '(GMT-11:00) Midway Island',
  '(GMT-10:00) Hawaii',
  '(GMT-09:00) Alaska',
  '(GMT-08:00) Pacific Time (US & Canada)',
  '(GMT-08:00) Tijuana',
  '(GMT-07:00) Arizona',
  '(GMT-07:00) Chihuahua',
  '(GMT-07:00) La Paz',
  '(GMT-07:00) Mazatlan',
  '(GMT-07:00) Mountain Time (US & Canada)',
  '(GMT-06:00) Central America',
  '(GMT-06:00) Central Time (US & Canada)',
  '(GMT-06:00) Guadalajara',
  '(GMT-06:00) Mexico City',
  '(GMT-06:00) Monterrey',
  '(GMT-06:00) Saskatchewan',
  '(GMT-05:00) Bogota',
  '(GMT-05:00) Eastern Time (US & Canada)',
  '(GMT-05:00) Indiana (East)',
  '(GMT-05:00) Lima',
  '(GMT-05:00) Quito',
  '(GMT-04:00) Atlantic Time (Canada)',
  '(GMT-04:00) Caracas',
  '(GMT-04:00) La Paz',
  '(GMT-04:00) Santiago',
  '(GMT-03:30) Newfoundland',
  '(GMT-03:00) Brasilia',
  '(GMT-03:00) Buenos Aires',
  '(GMT-03:00) Georgetown',
  '(GMT-03:00) Greenland',
  '(GMT-02:00) Mid-Atlantic',
  '(GMT-01:00) Azores',
  '(GMT-01:00) Cape Verde Is.',
  '(GMT+00:00) Casablanca',
  '(GMT+00:00) Dublin',
  '(GMT+00:00) Edinburgh',
  '(GMT+00:00) Lisbon',
  '(GMT+00:00) London',
]

const currencies = [
  'USD',
  'EUR',
  'GBP',
  'AUD',
  'BRL',
  'CAD',
  'CNY',
  'CZK',
  'DKK',
  'HKD',
  'HUF',
  'INR',
]
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Профиль">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar rounded="lg" size="100" class="me-6" :image="accountDataLocal.avatarImg" />

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-5">
            <div class="d-flex flex-wrap gap-2">
              <VBtn color="primary" @click="refInputEl?.click()">
                <VIcon :icon="mdiUpload" class="d-sm-none" />
                <span class="d-none d-sm-block">Загрузить новое фото</span>
              </VBtn>

              <input ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,GIF" hidden @input="changeAvatar">

              <VBtn type="reset" color="error" variant="outlined" @click="resetAvatar">
                <span class="d-none d-sm-block">Сбросить</span>
                <VIcon :icon="mdiRefresh" class="d-sm-none" />
              </VBtn>
            </div>

            <p class="text-body-1 mb-0">
              Допустимые форматы: JPG, PNG. Максимальный размер: 1024K
            </p>
          </form>
        </VCardText>

        <VDivider />

        <VCardText>
          <!-- 👉 Form -->
          <VForm class="mt-6">
            <VRow>
              <!-- 👉 First Name -->
              <VCol md="6" cols="12">
                <VTextField v-model="accountDataLocal.firstName" placeholder="Иван" label="Имя" />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol md="6" cols="12">
                <VTextField v-model="accountDataLocal.lastName" placeholder="Петров" label="Фамилия" />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12" md="6">
                <VTextField v-model="accountDataLocal.email" label="E-mail" placeholder="my@example.com"
                  type="email" />
              </VCol>

              <!-- 👉 Country -->
              <VCol cols="12" md="6">
                <VSelect v-model="accountDataLocal.country" label="Страна"
                  :items="['Россия']" placeholder="Выберите страну" />
              </VCol>

              <!-- 👉 Language -->
              <VCol cols="12" md="6">
                <VSelect v-model="accountDataLocal.language" label="Language" placeholder="Язык"
                  :items="['Русский']" />
              </VCol>

              <!-- 👉 Timezone -->
              <VCol cols="12" md="6">
                <VSelect v-model="accountDataLocal.timezone" label="Timezone" placeholder="Временная зона"
                  :items="timezones" :menu-props="{ maxHeight: 200 }" />
              </VCol>

              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn>Сохранить изменения</VBtn>

                <VBtn color="secondary" variant="outlined" type="reset" @click.prevent="resetForm">
                  Сбросить
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Deactivate Account -->
      <VCard title="Деактивация аккаунта">
        <VCardText>
          <div>
            <VCheckbox v-model="isAccountDeactivated" label="Я подтверждаю деактивацию своей учетной записи" />
          </div>

          <VBtn :disabled="!isAccountDeactivated" color="error" class="mt-3">
            Деактивировать аккаунт
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
