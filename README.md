# Zeyan's Blog

An independent personal research and technical notebook built with Astro. The site keeps the
content model and useful utilities from Astro Theme Pure, while using its own information
architecture, visual system, writing, and configuration.

## Focus

- Research notes, paper reading, engineering experiments, and learning in public
- Typography-led layouts with a quiet, content-first reading experience
- Static-first pages with very little client-side JavaScript
- Blog categories, tags, collections, archives, RSS, sitemap, SEO metadata, and Pagefind search

## Stack

- Astro and TypeScript
- Markdown / MDX content collections
- Astro Pure utilities and components where they remain useful
- Shiki, KaTeX, Pagefind, RSS, and sitemap generation

## Local development

Install dependencies and start the development server:

```sh
npm install
npm run dev
```

Useful checks:

```sh
npm run check
npm run lint
npm run build
npm run preview
```

## Project map

- `src/site.config.ts` — site identity, navigation, social links, projects, research topics, and footer
- `src/content/blog/` — blog posts and their frontmatter
- `src/content/collections/` — long-running collections of related posts
- `src/components/` — site-specific navigation, blog, and collection components
- `src/pages/` — public routes such as `/blog`, `/research`, `/projects`, and `/about`
- `packages/pure/` — the local Astro Pure package used as the technical foundation

## Writing a post

Add a Markdown or MDX file under `src/content/blog/` with the required frontmatter from
`src/content.config.ts`. Use `draft: true` for work that should stay out of the generated site.

The production build emits static files to `dist/`, which can be deployed to any static hosting
provider.

## Paper reading

The bilingual reading center uses the existing `/blog/paper-reading` and `/zh/blog/paper-reading`
routes. It supports topic, source-paper year, reading-depth filters, sorting, eight-note pagination,
and scoped full-text search. Filters are shareable URL parameters. Press `/` to focus its search.

Published posts with `category: paper-reading` or optional `paper` metadata appear in their language's
index. Optional `researchTopics` use slugs from `src/paper-reading.config.ts`; `readingDepth` accepts
`skim`, `deep`, or `reproduced`. Omitted depths stay unmarked. The `paper` object requires a `title`
and optionally accepts `authors`, `year`, `venue`, `url`, `doi`, and `arxivId`. Use the same paper
identifier on related notes and translations for deduplication. Unlinked notes are not counted as papers.

Run `npm run build` and `npm run preview` to verify Pagefind full-text search. Development mode and
unavailable production indexes fall back to metadata matching with an explicit notice. Drafts are
excluded from both the center and the search index. See `README-zh-CN.md` for a frontmatter example.

## Version history

The pre-redesign source is preserved at tag `before-paper-reading-2026-10-05` (commit `328e466`).
Export it with `git archive`, or inspect it in a separate detached worktree. To undo the redesign
on the shared branch, use `git revert` on the `feat: add bilingual paper reading center` commit,
then push normally. Do not force-push history. Detailed instructions are in `README-zh-CN.md`.

## License

This repository includes code adapted from Astro Theme Pure. See `LICENSE` for the repository
license and the package metadata under `packages/pure/` for the local package details.
