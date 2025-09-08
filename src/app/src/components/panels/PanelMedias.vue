<script setup lang="ts">
import PanelBase from './PanelBase.vue'

const open = defineModel<boolean>()
</script>

<template>
  <PanelBase
    v-model="open"
    title="Medias"
  >
    <div class="p-4">
      <p>Media management goes here...</p>

      <div class="mt-4 text-gray-500 text-sm">
        TODO: media management interface
      </div>
    </div>
  </PanelBase>
</template>
