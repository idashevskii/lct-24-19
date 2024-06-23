<script lang="ts" setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import { mdiAccountWrench, mdiApi, mdiFileChart, mdiFileDocumentMultipleOutline, mdiFrequentlyAskedQuestions, mdiSearchWeb, mdiViewDashboard, mdiViewDashboardOutline } from '@mdi/js';

</script>

<template>
<!--   
  <VerticalNavGroup :item="{
    title: 'Дашборды',
    badgeContent: '5',
    badgeClass: 'bg-error',
    icon: mdiViewDashboard,
  }">
    <VerticalNavLink :item="{
      title: 'Аналитика',
      to: '/dashboard/analytics',
      icon: mdiViewDashboardOutline,
    }" />
  </VerticalNavGroup> -->

  <VerticalNavSectionTitle :item="{ heading: 'Конструктор отчётов', }" />

  <VerticalNavLink :item="{
    title: 'Отчёты',
    icon: mdiFileChart,
    to: '/reports',
  }" />

  <VerticalNavLink :item="{
    title: 'Шаблоны',
    icon: mdiFileChart,
    to: '/templates',
  }" />

  <VerticalNavSectionTitle :item="{ heading: 'Источники', }" />

  <VerticalNavLink :item="{
    title: 'Веб-страницы',
    icon: mdiSearchWeb,
    to: '/sources/urls',
  }" />

  <VerticalNavLink :item="{
    title: 'Документы',
    icon: mdiFileDocumentMultipleOutline,
    to: '/sources/documents',
  }" />

  <VerticalNavSectionTitle :item="{ heading: 'Настройки', }" />

  <VerticalNavLink :item="{
    title: 'Аккаунт',
    icon: mdiAccountWrench,
    to: '/settings/account',
  }" />

  <VerticalNavLink :item="{
    title: 'Сторонние сервисы',
    icon: mdiApi,
    to: '/settings/3rd-party',
  }" />

  <VerticalNavSectionTitle :item="{ heading: 'Помощь', }" />

  <VerticalNavLink :item="{
    title: 'FAQ',
    icon: mdiFrequentlyAskedQuestions,
    to: '/help/faq',
  }" />
</template>
