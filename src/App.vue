<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { computed } from 'vue'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <template v-if="isAdminRoute">
    <RouterView />
  </template>
  <template v-else>
    <DefaultLayout>
      <RouterView />
    </DefaultLayout>
  </template>
</template>

<style>
/* Global styles that shouldn't be in a component's scoped style can go here */
</style>
