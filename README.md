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

## License

This repository includes code adapted from Astro Theme Pure. See `LICENSE` for the repository
license and the package metadata under `packages/pure/` for the local package details.
