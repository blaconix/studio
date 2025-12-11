import { expect, test, describe } from 'vitest'
import { buildFormTreeFromSchema } from '../../../src/utils/form'
import type { Draft07 } from '@nuxt/content'

describe('buildFormTreeFromSchema', () => {
  test('handle array of objects with items', () => {
    const schema: Draft07 = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $ref: '#/definitions/posts',
      definitions: {
        posts: {
          type: 'object',
          properties: {
            array: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  slug: {
                    type: 'string',
                  },
                  username: {
                    type: 'string',
                  },
                  name: {
                    type: 'string',
                  },
                  to: {
                    type: 'string',
                  },
                  avatar: {
                    type: 'object',
                    properties: {
                      src: {
                        type: 'string',
                        $content: {
                          editor: {
                            input: 'media',
                          },
                        },
                      },
                      alt: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
          additionalProperties: false,
          required: [],
        },
      },
    }

    expect(buildFormTreeFromSchema('posts', schema)).toStrictEqual({
      posts: {
        id: '#frontmatter/posts',
        type: 'object',
        title: 'Posts',
        children: {
          array: {
            id: '#frontmatter/posts/array',
            type: 'array',
            title: 'Array',
            items: {
              id: '#array/items',
              type: 'object',
              title: 'Items',
              children: {
                slug: {
                  id: '#array/items/slug',
                  type: 'string',
                  title: 'Slug',
                },
                username: {
                  id: '#array/items/username',
                  type: 'string',
                  title: 'Username',
                },
                name: {
                  id: '#array/items/name',
                  type: 'string',
                  title: 'Name',
                },
                to: {
                  id: '#array/items/to',
                  type: 'string',
                  title: 'To',
                },
                avatar: {
                  id: '#array/items/avatar',
                  type: 'object',
                  title: 'Avatar',
                  children: {
                    src: {
                      id: '#array/items/avatar/src',
                      type: 'media',
                      title: 'Src',
                    },
                    alt: {
                      id: '#array/items/avatar/alt',
                      type: 'string',
                      title: 'Alt',
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
  })

  test('handle array of objects with items bis', () => {
    const schema: Draft07 = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $ref: '#/definitions/pricing',
      definitions: {
        pricing: {
          type: 'object',
          additionalProperties: false,
          required: [],
          properties: {
            plans: {
              type: 'object',
              properties: {
                solo: {
                  type: 'object',
                  properties: {
                    features: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }

    expect(buildFormTreeFromSchema('pricing', schema)).toStrictEqual({ pricing: {
      id: '#frontmatter/pricing',
      title: 'Pricing',
      type: 'object',
      children: {
        plans: {
          id: '#frontmatter/pricing/plans',
          title: 'Plans',
          type: 'object',
          children: {
            solo: {
              id: '#frontmatter/pricing/plans/solo',
              title: 'Solo',
              type: 'object',
              children: {
                features: {
                  id: '#frontmatter/pricing/plans/solo/features',
                  title: 'Features',
                  type: 'array',
                  items: {
                    id: '#features/items',
                    title: 'Items',
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
    })
  })

  test('handle type creation for editor types (media, icon...) ', () => {
    const schema: Draft07 = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $ref: '#/definitions/posts',
      definitions: {
        posts: {
          type: 'object',
          properties: {
            media: {
              type: 'string',
              $content: {
                editor: {
                  input: 'media',
                },
              },
            },
            icon: {
              type: 'string',
              $content: {
                editor: {
                  input: 'icon',
                },
              },
            },
          },
          additionalProperties: false,
          required: [],
        },
      },
    }

    expect(buildFormTreeFromSchema('posts', schema)).toStrictEqual({
      posts: {
        id: '#frontmatter/posts',
        type: 'object',
        title: 'Posts',
        children: {
          media: {
            id: '#frontmatter/posts/media',
            type: 'media',
            title: 'Media',
          },
          icon: {
            id: '#frontmatter/posts/icon',
            type: 'icon',
            title: 'Icon',
          },
        },
      },
    })
  })

  test('hide field if set in editor metas', () => {
    const schema: Draft07 = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $ref: '#/definitions/posts',
      definitions: {
        posts: {
          type: 'object',
          properties: {
            string: {
              type: 'string',
            },
            hidden: {
              type: 'string',
              $content: {
                editor: {
                  hidden: true,
                },
              },
            },
          },
          additionalProperties: false,
          required: [],
        },
      },
    }

    expect(buildFormTreeFromSchema('posts', schema)).toStrictEqual({
      posts: {
        id: '#frontmatter/posts',
        type: 'object',
        title: 'Posts',
        children: {
          string: {
            id: '#frontmatter/posts/string',
            type: 'string',
            title: 'String',
          },
        },
      },
    })
  })

  test('handle select type creation', () => {
    const schema: Draft07 = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $ref: '#/definitions/posts',
      definitions: {
        posts: {
          type: 'object',
          properties: {
            select: {
              type: 'string',
              enum: ['value1', 'value2'],
            },
          },
          additionalProperties: false,
          required: [],
        },
      },
    }

    expect(buildFormTreeFromSchema('posts', schema)).toStrictEqual({
      posts: {
        id: '#frontmatter/posts',
        type: 'object',
        title: 'Posts',
        children: {
          select: {
            id: '#frontmatter/posts/select',
            type: 'string',
            title: 'Select',
            options: ['value1', 'value2'],
          },
        },
      },
    })
  })

  test('do not handle content internal fields', () => {
    const schema: Draft07 = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $ref: '#/definitions/posts',
      definitions: {
        posts: {
          type: 'object',
          properties: {
            contentId: {
              type: 'string',
            },
            weight: {
              type: 'string',
            },
            stem: {
              type: 'string',
            },
            extension: {
              type: 'string',
              enum: [
                'md',
                'yaml',
                'json',
                'csv',
                'xml',
              ],
            },
            meta: {
              type: 'object',
              additionalProperties: {},
            },
            path: {
              type: 'string',
            },
            body: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                },
                children: {},
                toc: {},
              },
              required: [
                'type',
              ],
              additionalProperties: false,
            },
            string: {
              type: 'string',
            },
          },
          additionalProperties: false,
          required: [],
        },
      },
    }

    expect(buildFormTreeFromSchema('posts', schema)).toStrictEqual({
      posts: {
        id: '#frontmatter/posts',
        type: 'object',
        title: 'Posts',
        children: {
          string: {
            id: '#frontmatter/posts/string',
            type: 'string',
            title: 'String',
          },
        },
      },
    })
  })

  test('handle two level deep object with `allOff` property', () => {
    const schema: Draft07 = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $ref: '#/definitions/posts',
      definitions: {
        posts: {
          type: 'object',
          properties: {
            seo: {
              allOf: [
                {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string',
                    },
                    description: {
                      type: 'string',
                    },
                  },
                },
                {
                  type: 'object',
                  additionalProperties: {},
                },
              ],
            },
          },
          additionalProperties: false,
          required: [],
        },
      },
    }

    expect(buildFormTreeFromSchema('posts', schema)).toStrictEqual({
      posts: {
        id: '#frontmatter/posts',
        type: 'object',
        title: 'Posts',
        children: {
          seo: {
            id: '#frontmatter/posts/seo',
            type: 'object',
            title: 'Seo',
            children: {
              title: {
                id: '#frontmatter/posts/seo/title',
                type: 'string',
                title: 'Title',
              },
              description: {
                id: '#frontmatter/posts/seo/description',
                type: 'string',
                title: 'Description',
              },
            },
          },
        },
      },
    })
  })

  test('handle two level deep object with `anyOf` property and prioritize string type', () => {
    const schema: Draft07 = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $ref: '#/definitions/posts',
      definitions: {
        posts: {
          type: 'object',
          properties: {
            navigation: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['value1', 'value2'],
                },
                {
                  type: 'boolean',
                },
              ],
              default: false,
            },
          },
          additionalProperties: false,
          required: [],
        },
      },
    }

    expect(buildFormTreeFromSchema('posts', schema)).toStrictEqual({
      posts: {
        id: '#frontmatter/posts',
        type: 'object',
        title: 'Posts',
        children: {
          navigation: {
            id: '#frontmatter/posts/navigation',
            type: 'string',
            toggleable: true,
            title: 'Navigation',
            options: ['value1', 'value2'],
          },
        },
      },
    })
  })

  test('handle two level deep object with `anyOf` property and prioritize object type', () => {
    const schema: Draft07 = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $ref: '#/definitions/posts',
      definitions: {
        posts: {
          type: 'object',
          properties: {
            navigation: {
              anyOf: [
                {
                  type: 'boolean',
                },
                {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string',
                    },
                    description: {
                      type: 'string',
                    },
                    icon: {
                      type: 'string',
                    },
                  },
                  required: [
                    'title',
                    'description',
                    'icon',
                  ],
                  additionalProperties: false,
                },
              ],
              default: true,
            },
          },
          additionalProperties: false,
          required: [],
        },
      },
    }

    expect(buildFormTreeFromSchema('posts', schema)).toStrictEqual({
      posts: {
        id: '#frontmatter/posts',
        type: 'object',
        title: 'Posts',
        children: {
          navigation: {
            id: '#frontmatter/posts/navigation',
            type: 'object',
            title: 'Navigation',
            toggleable: true,
            children: {
              title: {
                id: '#frontmatter/posts/navigation/title',
                type: 'string',
                title: 'Title',
              },
              description: {
                id: '#frontmatter/posts/navigation/description',
                type: 'string',
                title: 'Description',
              },
              icon: {
                id: '#frontmatter/posts/navigation/icon',
                type: 'string',
                title: 'Icon',
              },
            },
          },
        },
      },
    })
  })

  test('handle three level deep object', () => {
    const schema: Draft07 = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $ref: '#/definitions/posts',
      definitions: {
        posts: {
          type: 'object',
          properties: {
            hero: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                },
                description: {
                  type: 'string',
                },
                image: {
                  type: 'object',
                  properties: {
                    dark: {
                      type: 'string',
                    },
                    light: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          additionalProperties: false,
          required: [],
        },
      },
    }

    expect(buildFormTreeFromSchema('posts', schema)).toStrictEqual({
      posts: {
        id: '#frontmatter/posts',
        type: 'object',
        title: 'Posts',
        children: {
          hero: {
            id: '#frontmatter/posts/hero',
            type: 'object',
            title: 'Hero',
            children: {
              title: {
                id: '#frontmatter/posts/hero/title',
                type: 'string',
                title: 'Title',
              },
              description: {
                id: '#frontmatter/posts/hero/description',
                type: 'string',
                title: 'Description',
              },
              image: {
                id: '#frontmatter/posts/hero/image',
                type: 'object',
                title: 'Image',
                children: {
                  dark: {
                    id: '#frontmatter/posts/hero/image/dark',
                    type: 'string',
                    title: 'Dark',
                  },
                  light: {
                    id: '#frontmatter/posts/hero/image/light',
                    type: 'string',
                    title: 'Light',
                  },
                },
              },
            },
          },
        },
      },
    })
  })
})
