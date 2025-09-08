<script setup lang="ts">
import PanelBase from './PanelBase.vue'

const open = defineModel<boolean>()
</script>

<template>
  <PanelBase
    v-model="open"
    title="Files"
  >
    <div class="p-4">
      <p>Files content goes here...</p>

      <!-- TODO: Add files list, file tree, etc. -->
      <div class="mt-4 text-gray-500 text-sm">
        This is where the files management interface will be implemented.
      </div>
    </div>
  </PanelBase>
</template>
