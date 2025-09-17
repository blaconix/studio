import { type StudioAction, StudioFeature, type TreeItem } from '../types'
import { DraftStatus } from '../types/draft'

export const FEATURE_DISPLAY_MAP = {
  [StudioFeature.Content]: 'Content files',
  [StudioFeature.Media]: 'Media library',
  [StudioFeature.Config]: 'Application configuration',
} as const

export enum StudioActionId {
  CreateFolder = 'create-folder',
  CreateFile = 'create-file',
  RevertItem = 'revert-item',
  RenameItem = 'rename-item',
  DeleteItem = 'delete-item',
  DuplicateItem = 'duplicate-item',
}

export const STUDIO_ACTION_DEFINITIONS: StudioAction[] = [
  {
    id: StudioActionId.CreateFolder,
    label: 'Create folder',
    icon: 'i-lucide-folder-plus',
    tooltip: 'Create a new folder',
  },
  {
    id: StudioActionId.CreateFile,
    label: 'Create file',
    icon: 'i-lucide-file-plus',
    tooltip: 'Create a new file',
  },
  {
    id: StudioActionId.RevertItem,
    label: 'Revert changes',
    icon: 'i-lucide-rotate-ccw',
    tooltip: 'Revert changes',
  },
  {
    id: StudioActionId.RenameItem,
    label: 'Rename',
    icon: 'i-lucide-pencil',
    tooltip: 'Rename file',
  },
  {
    id: StudioActionId.DeleteItem,
    label: 'Delete',
    icon: 'i-lucide-trash',
    tooltip: 'Delete file',
  },
  {
    id: StudioActionId.DuplicateItem,
    label: 'Duplicate',
    icon: 'i-lucide-copy',
    tooltip: 'Duplicate file',
  },
] as const

export function computeActionItems(item?: TreeItem | null): StudioAction[] {
  const studioActions = [...STUDIO_ACTION_DEFINITIONS]

  if (!item) {
    return studioActions
  }

  const forbiddenActions: StudioActionId[] = []

  if (item.type === 'root') {
    return studioActions.filter(action => ![StudioActionId.RenameItem, StudioActionId.DeleteItem, StudioActionId.DuplicateItem].includes(action.id))
  }

  // Item type filtering
  switch (item.type) {
    case 'file':
      forbiddenActions.push(StudioActionId.CreateFolder, StudioActionId.CreateFile)
      break
    case 'directory':
      forbiddenActions.push(StudioActionId.DuplicateItem)
      break
  }

  // Draft status filtering
  switch (item.status) {
    case DraftStatus.Updated:
    case DraftStatus.Created:
      break
    case DraftStatus.Deleted:
      forbiddenActions.push(StudioActionId.DuplicateItem, StudioActionId.RenameItem, StudioActionId.DeleteItem)
      break
    case DraftStatus.Renamed:
      forbiddenActions.push(StudioActionId.RenameItem)
      break
    default:
      forbiddenActions.push(StudioActionId.RevertItem)
      break
  }

  return studioActions.filter(action => !forbiddenActions.includes(action.id))
}
