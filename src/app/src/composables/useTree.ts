import type { DraftFileItem, StudioHost, TreeItem } from '../types'
import { ref, watch, computed } from 'vue'
import type { useDraftFiles } from './useDraftFiles'
import { buildTree, findItemFromId, findItemFromRoute, ROOT_ITEM } from '../utils/tree'
import type { RouteLocationNormalized } from 'vue-router'

export function useTree(host: StudioHost, draftFiles: ReturnType<typeof useDraftFiles>) {
  const tree = ref<TreeItem[]>([])
  const currentItem = ref<TreeItem>(ROOT_ITEM)
  const isTreeBuilding = ref<boolean>(false)

  const currentTree = computed<TreeItem[]>(() => {
    if (currentItem.value.id === ROOT_ITEM.id) {
      return tree.value
    }

    let subTree = tree.value
    const idSegments = currentItem.value.id.split('/').filter(Boolean)
    for (let i = 0; i < idSegments.length; i++) {
      const id = idSegments.slice(0, i + 1).join('/')
      const file = subTree.find(item => item.id === id) as TreeItem
      if (file) {
        subTree = file.children!
      }
    }

    return subTree
  })

  // const parentItem = computed<TreeItem | null>(() => {
  //   if (currentItem.value.id === ROOT_ITEM.id) return null

  //   const parent = findParentFromId(tree.value, currentItem.value.id)
  //   return parent || ROOT_ITEM
  // })

  async function selectItem(item: TreeItem) {
    currentItem.value = item
    if (item?.type === 'file') {
      host.app.navigateTo(item.routePath!)
      await selectCorrespondingDraftFile(item)
    }
    else {
      draftFiles.select(null)
    }
  }

  async function selectItemByRoute(route: RouteLocationNormalized) {
    const item = findItemFromRoute(tree.value, route)
    if (!item) return
    currentItem.value = item
    await selectCorrespondingDraftFile(item)
  }

  async function selectCorrespondingDraftFile(item: TreeItem) {
    const originalDatabaseItem = await host.document.get(item.id)
    const draftFileItem = await draftFiles.upsert(item.id, originalDatabaseItem)
    draftFiles.select(draftFileItem)
  }

  async function selectItemByDraftFile(item: DraftFileItem) {
    const treeItem = findItemFromId(tree.value, item.id)
    if (treeItem) {
      selectItem(treeItem)
    }
  }

  watch(draftFiles.listHash, async () => {
    isTreeBuilding.value = true
    const list = await host.document.list()
    const listWithFsPath = list.map((item) => {
      const fsPath = host.document.getFileSystemPath(item.id)
      return {
        ...item,
        fsPath,
      }
    })

    tree.value = buildTree(listWithFsPath, draftFiles.list.value)
    isTreeBuilding.value = false
  }, { immediate: true })

  return {
    root: tree,
    current: currentTree,
    currentItem,
    isTreeBuilding,
    // parentItem,
    selectItem,
    selectItemByRoute,
    selectItemByDraftFile,
  }
}
