<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStudio } from '../composables/useStudio'
import { StudioItemActionId, StudioFeature } from '../types'
import { checkExistingFiles } from '../utils/media'

const { context, host } = useStudio()
const isUploading = ref(false)

const folderTree = computed(() => (context.activeTree.value.current.value || []).filter(f => f.type === 'directory'))
const fileTree = computed(() => (context.activeTree.value.current.value || []).filter(f => f.type === 'file' && !f.id.endsWith('.gitkeep')))

const currentTreeItem = computed(() => context.activeTree.value.currentItem.value)
const currentDraftItem = computed(() => context.activeTree.value.draft.current.value)

const showFolderForm = computed(() => {
  return context.actionInProgress.value?.id === StudioItemActionId.CreateMediaFolder
    || (
      context.actionInProgress.value?.id === StudioItemActionId.RenameItem
      && context.actionInProgress.value?.item?.type === 'directory'
    )
})

const showFileForm = computed(() => {
  return context.actionInProgress.value?.id === StudioItemActionId.CreateDocument
    || (
      context.actionInProgress.value?.id === StudioItemActionId.RenameItem
      && context.actionInProgress.value?.item?.type === 'file')
})

async function onFileDrop(event: DragEvent) {
  if (currentDraftItem.value) {
    return
  }

  const files = Array.from(event.dataTransfer?.files || [])
  if (files.length === 0) {
    return
  }

  const parentFsPath = currentTreeItem.value.fsPath
  const existingPath = checkExistingFiles(await host.media.list(), files, parentFsPath)
  // TODO: Display smooth alert error
  if (existingPath) {
    console.error(`File already exists: ${existingPath}`)
    return
  }

  isUploading.value = true
  try {
    await context.itemActionHandler[StudioItemActionId.UploadMedia]({ parentFsPath, files })
  }
  catch (error) {
    console.error('Media upload error:', error)
  }
  finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div
    class="h-full flex flex-col"
    @drop.prevent.stop="onFileDrop"
    @dragover.prevent.stop
  >
    <div class="flex items-center justify-between gap-2 px-4 py-1 border-b-[0.5px] border-default bg-muted/70">
      <ItemBreadcrumb />
      <ItemActionsToolbar />
    </div>

    <div class="flex-1 relative">
      <div
        v-if="context.activeTree.value.draft.isLoading.value"
        class="absolute inset-0 bg-primary/3 animate-pulse pointer-events-none"
      />

      <template v-else>
        <MediaEditor
          v-if="currentTreeItem.type === 'file' && currentDraftItem"
          :media-item="currentDraftItem.modified || currentDraftItem.original!"
          :github-file="currentDraftItem.githubFile!"
          :status="currentDraftItem.status"
        />
        <div
          v-else
          class="bg-default h-full"
          :class="{ 'bg-primary/3 animate-pulse': isUploading }"
        >
          <div class="flex flex-col p-4">
            <div v-if="folderTree?.length > 0 || showFolderForm">
              <div class="flex items-center gap-1 mb-3">
                <UIcon
                  name="i-lucide-folder"
                  class="size-3.5 text-muted"
                />
                <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">
                  Directories
                </h3>
                <UBadge
                  v-if="folderTree?.length > 0"
                  :label="folderTree.length.toString()"
                  color="neutral"
                  variant="soft"
                  size="xs"
                />
                <div class="flex-1 h-px bg-border ml-2" />
              </div>
              <ItemTree
                class="mb-6"
                :tree="folderTree"
                :show-form="showFolderForm"
                :feature="StudioFeature.Media"
              />
            </div>
            <div>
              <div class="flex items-center gap-1 mb-3">
                <UIcon
                  name="i-lucide-image"
                  class="size-3.5 text-muted"
                />
                <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">
                  Media
                </h3>
                <UBadge
                  :label="fileTree.length.toString()"
                  color="neutral"
                  variant="soft"
                  size="xs"
                />
                <div class="flex-1 h-px bg-border ml-2" />
              </div>
              <ItemTree
                :tree="fileTree"
                :show-form="showFileForm"
                :feature="StudioFeature.Media"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
