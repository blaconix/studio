<script setup lang="ts">
import { computed } from 'vue'
import { useStudio } from '../../../composables/useStudio'
import type { DatabasePageItem } from '../../../types'

const { tree, draftFiles } = useStudio()

const folderTree = computed(() => (tree.current.value || []).filter(f => f.type === 'directory'))
const fileTree = computed(() => (tree.current.value || []).filter(f => f.type === 'file'))
</script>

<template>
  <PanelContentEditor
    v-if="tree.currentItem.value.type === 'file' && draftFiles.current.value"
    :db-item="draftFiles.current.value.document as DatabasePageItem"
  />
  <div
    v-else
    class="flex flex-col"
  >
    <PanelContentTree
      v-if="folderTree?.length > 0"
      class="mb-4"
      :tree="folderTree"
      type="directory"
    />
    <PanelContentTree
      v-if="fileTree?.length > 0"
      :tree="fileTree"
      type="file"
    />
  </div>
</template>
