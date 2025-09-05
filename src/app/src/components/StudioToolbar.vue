<script setup lang="ts">
import { computed } from 'vue'
import { useStudio } from '../composables/useStudio'

const studio = useStudio()
const { host } = studio

const user = computed(() => host.user.get())

const features = [{
  label: 'Files',
  icon: 'i-lucide-files',
  onClick: () => {
    studio.ui.displayFiles = true
  },
}, {
  label: 'Medias',
  icon: 'i-lucide-image',
  onClick: () => {
    studio.ui.displayMedias = true
  },
},
{
  label: 'Config',
  icon: 'i-lucide-settings',
  onClick: () => {
    studio.ui.displayConfig = true
  },
}]

const userMenuItems = computed(() => [
  {
    label: 'Sign out',
    icon: 'i-lucide-log-out',
    onClick: () => {
      alert('TODO: delete cookie manually')
    },
  },
])
</script>

<template>
  <UHeader class="fixed top-0 left-0 right-0 z-50">
    <template #title>
      <div class="flex gap-2">
        <UNavigationMenu
          :items="features"
          highlight
        />
      </div>
    </template>

    <template #right>
      <UButton
        label="Publish"
        icon="i-lucide-save"
        color="primary"
        variant="solid"
        size="sm"
      />
      <USeparator
        orientation="vertical"
        class="h-8"
      />
      <UDropdownMenu
        :portal="false"
        :items="userMenuItems"
        placeholder="Select a content"
      >
        <UButton
          color="neutral"
          variant="ghost"
          size="xs"
        >
          <UAvatar
            :src="user?.avatar"
            size="xs"
          />
          <span>{{ user?.name }}</span>
        </UButton>
      </UDropdownMenu>
    </template>
  </UHeader>
</template>
