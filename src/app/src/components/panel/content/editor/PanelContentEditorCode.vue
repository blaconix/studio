<script setup lang="ts">
import { onMounted, ref, shallowRef, watch } from 'vue'
import type { DatabasePageItem } from '../../../../types'
import { setupMonaco, type Editor } from '../../../../utils/monaco'
import { generateContentFromDocument, parseContent, pickReservedKeysFromDocument } from '../../../../utils/content'

const document = defineModel<DatabasePageItem>()

const editor = shallowRef<Editor.IStandaloneCodeEditor | null>(null)
const editorRef = ref()
const content = ref<string>('')

watch(() => document.value?.id, async () => {
  if (document.value?.body) {
    generateContentFromDocument(document.value).then((md) => {
      content.value = md || ''

      if (editor.value) {
        editor.value.getModel()?.setValue(md || '')
      }
    })
  }
}, { immediate: true })

onMounted(async () => {
  const monaco = await setupMonaco()

  // create a Monaco editor instance
  editor.value = monaco.createEditor(editorRef.value)
  editor.value.onDidChangeModelContent(() => {
    content.value = editor.value!.getModel()!.getValue() || ''

    parseContent(document.value!.id, content.value).then((doc) => {
      document.value = {
        ...pickReservedKeysFromDocument(document.value!),
        ...doc
      } as DatabasePageItem
    })
  })

  // create and attach a model to the editor
  editor.value.setModel(monaco.editor.createModel(content.value, 'mdc'))
})
</script>

<template>
  <div
    ref="editorRef"
    class="h-full -m-4"
  />
</template>
