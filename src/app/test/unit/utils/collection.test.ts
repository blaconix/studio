import { describe, it, expect } from 'vitest'
import { generateIdFromFsPath } from '../../../src/utils/collection'
import type { CollectionInfo } from '@nuxt/content'
import { collections } from '../../mocks/collection'

describe('generateIdFromFsPath', () => {
  it('should generate id for single file with no prefix', () => {
    const path = 'index.md'
    const result = generateIdFromFsPath(path, collections.landing!)
    expect(result).toBe('landing/index.md')
  })

  it('should generate id for nested file with global pattern', () => {
    const path = '1.getting-started/2.introduction.md'
    const result = generateIdFromFsPath(path, collections.docs!)
    expect(result).toBe('docs/1.getting-started/2.introduction.md')
  })

  it('should handle deeply nested paths', () => {
    const path = '2.essentials/1.nested/3.components.md'
    const result = generateIdFromFsPath(path, collections.docs!)
    expect(result).toBe('docs/2.essentials/1.nested/3.components.md')
  })

  it('should handle collection with custom prefix', () => {
    const customCollection: CollectionInfo = {
      name: 'docs_en',
      pascalName: 'DocsEn',
      tableName: '_content_docs_en',
      source: [
        {
          _resolved: true,
          prefix: '/en',
          cwd: '',
          include: 'en/**/*',
          exclude: ['en/index.md'],
        },
      ],
      type: 'page',
      fields: {},
      schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $ref: '#/definitions/docs_en',
        definitions: {},
      },
      tableDefinition: '',
    }

    const path = 'en/1.getting-started/2.introduction.md'
    const result = generateIdFromFsPath(path, customCollection)
    expect(result).toBe('docs_en/en/1.getting-started/2.introduction.md')
  })

  it('should handle empty prefix correctly', () => {
    const customCollection: CollectionInfo = {
      name: 'pages',
      pascalName: 'Pages',
      tableName: '_content_pages',
      source: [
        {
          _resolved: true,
          prefix: '',
          cwd: '',
          include: 'content/**/*.md',
        },
      ],
      type: 'page',
      fields: {},
      schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $ref: '#/definitions/pages',
        definitions: {},
      },
      tableDefinition: '',
    }

    const path = 'content/about.md'
    const result = generateIdFromFsPath(path, customCollection)
    expect(result).toBe('pages/about.md')
  })
})
