<script setup lang="ts">
import { computeActionItems } from '../../../utils/context'
import { computed, type PropType } from 'vue'
import type { TreeItem } from '../../../types'

const props = defineProps({
  item: {
    type: Object as PropType<TreeItem>,
    required: true,
  },
})

const actions = computed(() => {
  return computeActionItems(props.item)
})
</script>

<template>
  <UDropdownMenu
    :items="actions"
    :content="{ side: 'bottom' }"
  >
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-ph-dots-three-vertical"
      aria-label="Open actions"
      square
      size="sm"
      class="cursor-pointer"
      @click="$event.stopPropagation()"
    />
  </UDropdownMenu>
</template>
