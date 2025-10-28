import { joinURL } from 'ufo'
import type { MediaItem } from '../types'
import { TreeRootId } from '../types'

export function generateStemFromFsPath(fsPath: string) {
  return fsPath.split('.').slice(0, -1).join('.')
}

export function generateIdFromFsPath(fsPath: string) {
  return joinURL(TreeRootId.Media, fsPath)
}

export function checkExistingFiles(dbItems: MediaItem[], files: File[], parentFsPath: string) {
  const existingPaths = dbItems.map(item => item.path)
  for (const file of files) {
    const filePath = joinURL(parentFsPath, file.name)
    if (existingPaths.includes(filePath)) {
      return filePath
    }
  }

  return false
}
