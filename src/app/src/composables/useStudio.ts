import { createStorage } from 'unstorage'
import indexedDbDriver from 'unstorage/drivers/indexedb'
import { useGit } from './useGit'
import { useDraftFiles } from './useDraftFiles'
import { reactive, watch } from 'vue'
import { createSharedComposable } from '@vueuse/core'

const storage = createStorage({
  driver: indexedDbDriver({
    storeName: 'nuxt-content-preview',
  }),
})

export const useStudio = createSharedComposable(() => {
  const host = window.useStudioHost()
  const git = useGit({
    owner: 'owner',
    repo: 'repo',
    branch: 'main',
    token: '',
    authorName: 'Name',
    authorEmail: 'email@example.com',
  })

  const draftFiles = useDraftFiles(host, git, storage)

  host.on.mounted(async () => {
    await draftFiles.load()
    await Promise.all(draftFiles.list.value.map(async (draft) => {
      if (draft.status === 'deleted') {
        await host.document.delete(draft.id)
      }
      else {
        await host.document.upsert(draft.id, draft.document!)
      }
    }))
    host.requestRerender()
  })

  const ui = reactive({
    displayEditor: false,
    displayFiles: false,
    displayMedias: false,
    displayConfig: false,
    // commitPreviewVisibility: false,
    // contentsListVisibility: false,
  })

  watch(ui, (value) => {
    if (Object.values(value).some(value => value)) {
      host.ui.expandSidebar()
    }
    else {
      host.ui.collapseSidebar()
    }
  })

  // Exclusive panel behavior - only one panel can be open at a time
  const panelKeys = ['displayFiles', 'displayMedias', 'displayConfig', 'displayEditor'] as const

  watch(ui, (newVal, oldVal) => {
    // Find which key changed from false to true
    const activeKey = panelKeys.find(key => newVal[key] && !oldVal?.[key])

    if (activeKey) {
      // Close all other panels
      panelKeys.forEach((key) => {
        if (key !== activeKey && newVal[key]) {
          ui[key] = false
        }
      })
    }
  })

  // host.on.beforeUnload((event: BeforeUnloadEvent) => {
  //   // Ignore on development to prevent annoying dialogs
  //   if (import.meta.dev) return
  //   if (!draftFiles.list.value.length) return

  //   // Recommended
  //   event.preventDefault()
  //   event = event || window.event

  //   // For IE and Firefox prior to version 4
  //   if (event) {
  //     event.returnValue = 'Sure?'
  //   }

  //   // For Safari
  //   return 'Sure?'
  // })

  const returnValue = {
    host,
    git,
    ui,
    draftFiles,
    // draftMedia: {
    //   get -> DraftMediaItem
    //   upsert
    //   remove
    //   revert
    //   move
    //   list -> DraftMediaItem[]
    //   revertAll
    // }
    // media: {
    //   list -> MediaItem[]
    // }
    // config {
    //   get -> ConfigItem
    //   update
    //   revert
    // }
  }

  return returnValue
})
