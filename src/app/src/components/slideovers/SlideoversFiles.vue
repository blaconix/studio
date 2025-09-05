<script setup lang="ts">
import { useStudio } from '../../composables/useStudio'

const { ui } = useStudio()
</script>

<template>
  <div
    class="fixed top-[var(--toolbar-height)] bottom-0 left-0 w-112 h-full overflow-y-auto border-r border-gray-200"
  >
    <div class="flex justify-between p-4">
      <div>
        Files
      </div>
      <UButton
        icon="i-lucide-x"
        variant="ghost"
        size="xl"
        @click="ui.displayFiles = false"
      />
    </div>
  </div>
</template>

<style>
.slide-leave-active,
.slide-enter-active {
  transition: 0.3s;
}
.slide-enter-from {
  transform: translate(100%, 0);
}
.slide-enter {
  transform: translate(0, 0);
}
.slide-leave-to {
  transform: translate(100%, 0);
}
</style>
