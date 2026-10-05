import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { site } from './site.config'

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(80),
      description: z.string().max(220),
      publishDate: z.coerce.date().optional(),
      pubDate: z.coerce.date().optional(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.object({
        src: image(),
        alt: z.string().optional(),
        inferSize: z.boolean().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        color: z.string().optional()
      }).optional(),
      tags: z.array(z.string()).default([]).transform((tags) =>
        [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))]
      ),
      category: z.string().default('technical').transform((value, context) => {
        const category = site.blogCategories.find((item) =>
          item.slug === value.toLowerCase() || item.label.toLowerCase() === value.toLowerCase()
        )
        if (!category || category.slug === 'all') {
          context.addIssue({ code: 'custom', message: 'Choose a category from site.blogCategories.' })
          return z.NEVER
        }
        return category.slug
      }),
      collection: z.string().optional(),
      featured: z.boolean().default(false),
      language: z.string().default('en').transform((value, context) => {
        const language = ({ English: 'en', Chinese: 'zh-CN', zh: 'zh-CN' } as Record<string, string>)[value] ?? value
        try { return Intl.getCanonicalLocales(language)[0] } catch {
          context.addIssue({ code: 'custom', message: 'Use a language tag such as en or zh-CN.' })
          return z.NEVER
        }
      }),
      translationKey: z.string().optional(),
      draft: z.boolean().default(false),
      pin: z.boolean().optional(),
      comment: z.boolean().default(false)
    }).superRefine((data, context) => {
      if (!data.publishDate && !data.pubDate) {
        context.addIssue({ code: 'custom', path: ['pubDate'], message: 'A pubDate or publishDate is required.' })
      }
      if (data.publishDate && data.pubDate && data.publishDate.valueOf() !== data.pubDate.valueOf()) {
        context.addIssue({ code: 'custom', path: ['pubDate'], message: 'pubDate and publishDate must agree.' })
      }
    }).transform((data) => ({ ...data, publishDate: data.publishDate ?? data.pubDate! }))
})

const collection = defineCollection({
  loader: glob({ base: './src/content/collections', pattern: '**/*.md' }),
  schema: ({ image }) => z.object({
    title: z.string().max(80),
    titleZh: z.string().max(80).optional(),
    description: z.string().max(220),
    descriptionZh: z.string().max(220).optional(),
    introZh: z.string().max(500).optional(),
    started: z.coerce.date(),
    updated: z.coerce.date().optional(),
    cover: image().optional(),
    posts: z.array(z.string()).default([]),
    status: z.string().default('Active')
  })
})

export const collections = { blog, collections: collection }
