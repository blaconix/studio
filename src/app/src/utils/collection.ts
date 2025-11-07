import type { CollectionSource, CollectionInfo } from '@nuxt/content'
import { join } from 'pathe'

export function parseSourceBase(source: CollectionSource) {
  const [fixPart, ...rest] = source.include.includes('*') ? source.include.split('*') : ['', source.include]
  return {
    fixed: fixPart || '',
    dynamic: '*' + rest.join('*'),
  }
}

export function generateIdFromFsPath(path: string, collectionInfo: CollectionInfo) {
  const { fixed } = parseSourceBase(collectionInfo.source[0]!)

  const pathWithoutFixed = path.substring(fixed.length)

  return join(collectionInfo.name, collectionInfo.source[0]?.prefix || '', pathWithoutFixed)
}
