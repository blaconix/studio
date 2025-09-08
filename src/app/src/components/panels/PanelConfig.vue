<script setup lang="ts">
import PanelBase from './PanelBase.vue'

const open = defineModel<boolean>()
</script>

<template>
  <PanelBase
    v-model="open"
    title="Configuration"
  >
    <div class="p-4">
      <p>Configuration settings go here...</p>

      <div class="mt-4 text-gray-500 text-sm">
        TODO: configuration interface
      </div>
    </div>
  </PanelBase>
</template>
