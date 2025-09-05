<script setup lang="ts">
// watch is handled in useStudio composable
// import PreviewEditor from './components/PreviewEditor.vue'
// import ContentsListModal from './components/ContentsListModal.vue'
import { useStudio } from './composables/useStudio'
import StudioToolbar from './components/StudioToolbar.vue'
// import CommitPreviewModal from './components/CommitPreviewModal.vue'

const { ui } = useStudio()
// const activeDocuments = ref<{ id: string, label: string, value: string }[]>([])

// const selectedContentId = ref<string | null>(null)
// const selectedContent = ref<any | null>(null)

// const contentItems = computed(() => {
//   const items = []
//   if (activeDocuments.value.length > 0) {
//     items.unshift(
//       activeDocuments.value,
//     )
//   }

//   if (draftFiles.list.value.length > 0) {
//     items.push([
//       {
//         label: `Drafts (${draftFiles.list.value.length})`,
//         children: draftFiles.list.value.map((draft) => {
//           return {
//             label: draft.id,
//             value: draft.id,
//             onSelect: () => {
//               onContentSelect(draft.id)
//             },
//           }
//         }),
//       },
//     ])
//   }

//   items.push([{
//     id: 'show-all-contents',
//     label: 'Show all contents',
//     value: 'show-all-contents',
//     onSelect: () => {
//       studio.ui.contentsListVisibility = true
//     },
//   }])

//   return items
// })

// async function onContentSelect(id: string) {
//   selectedContentId.value = id
//   selectedContent.value = await host.document.get(id)
// }

// function onEditorUpdate(content: any) {
//   draftFiles.upsert(selectedContentId.value!, content)
// }
// function onRevert() {
//   draftFiles.revert(selectedContentId.value!)
// }

// function detectActiveDocuments() {
//   activeDocuments.value = host.document.detectActives().map((content) => {
//     return {
//       id: content.id,
//       label: content.title,
//       value: content.id,
//       onSelect: () => {
//         onContentSelect(content.id)
//       },
//     }
//   })
// }

// host.on.mounted(() => {
//   detectActiveDocuments()
//   host.on.routeChange(() => {
//     setTimeout(() => {
//       detectActiveDocuments()
//     }, 100)
//   })
// })
</script>

<template>
  <Suspense>
    <UApp :toaster="{ portal: false }">
      <StudioToolbar />

      <SlideoversFiles v-if="ui.displayFiles" />

      <!-- <PreviewEditor
        v-model="studio.ui.displayEditor"
      /> -->
      <!-- <CommitPreviewModal
        v-model="studio.ui.commitPreviewVisibility"
      />
      <ContentsListModal
        v-model="studio.ui.contentsListVisibility"
        @update:content="onEditorUpdate"
        @select="onContentSelect"
      /> -->
    </UApp>
  </Suspense>
  <!-- </div> -->
</template>
