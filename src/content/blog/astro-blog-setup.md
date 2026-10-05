---
title: 'Astro Blog Setup'
description: 'The decisions behind a static-first Astro notebook: content collections, search, typography, and a small client-side surface.'
publishDate: '2026-06-04'
category: technical
tags:
  - astro
  - typescript
  - web engineering
  - publishing
language: English
translationKey: astro-blog-setup
---

I wanted a blog that could stay quiet in the browser and expressive in the source tree. The current setup uses Astro, Markdown/MDX, content collections, Pagefind, KaTeX, Shiki, RSS, and sitemap generation without introducing a client-side application framework.

## The boundary

The site has three useful layers:

| Layer | Responsibility | Default runtime |
| --- | --- | --- |
| Content | Markdown, frontmatter, collections | Build time |
| Presentation | Astro layouts and components | Server/build time |
| Interaction | Search, theme, mobile menu | Small browser scripts |

That boundary keeps content portable. An article does not need to know how the header works, and the header does not need to hydrate a global application state.

## Content collections first

The blog schema carries the fields that affect information architecture: `category`, `collection`, `featured`, `tags`, and dates. A route can then query content directly instead of maintaining a second registry of posts.

```ts title="src/content.config.ts"
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: () =>
    z.object({
      title: z.string().max(60),
      description: z.string().max(160),
      publishDate: z.coerce.date(),
      category: z.string().default('technical'),
      collection: z.string().optional(),
      featured: z.boolean().default(false),
      tags: z.array(z.string()).default([])
    })
})
```

The important part is not the exact field list. It is that the schema makes an article’s publishing contract visible and checked before deployment.

## Search without a framework

Pagefind builds an index from the generated pages. The search route renders the default UI, while the header provides a familiar `Ctrl/Cmd + K` shortcut that leads to it. Search is useful because the archive is allowed to grow; it is not a reason to turn every page into an application.

## Typography as infrastructure

The visual system is intentionally narrow: a warm paper background, one ink colour, a restrained accent, thin rules, and a serif display face paired with a system sans body. Spacing and line length do more work than decoration. On mobile, the two-column archive becomes a single reading column instead of shrinking the desktop composition.

## A small checklist

- Run `npm run check` after changing a content schema.
- Test a post with math, code, links, and a long table.
- Verify `/rss.xml`, `/sitemap-index.xml`, and `/robots.txt` after building.
- Check the archive and search route with JavaScript disabled.
- Keep identity and navigation in `src/site.config.ts`.

The useful outcome is not an elaborate theme. It is a publishing surface that makes returning to the work feel easy.
