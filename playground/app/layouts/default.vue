<script setup lang="ts">
const { data: nav } = await useAsyncData('nav', () => {
  return queryCollectionNavigation('content')
})
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside>
          <UContentNavigation :navigation="nav" />
        </UPageAside>
      </template>

      <slot />
    </UPage>
  </UContainer>
</template>
