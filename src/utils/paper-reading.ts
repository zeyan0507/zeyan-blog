import type { CollectionEntry } from 'astro:content'

import { localizePath } from './languages'

type Post = CollectionEntry<'blog'>

export interface ReadingEntry {
  id: string
  url: string
  title: string
  description: string
  topics: string[]
  year: string
  published: string
  updated: string
  searchText: string
}

export const isPaperNote = ({ data }: Post) =>
  !data.draft && (data.category === 'paper-reading' || Boolean(data.paper))

export const getPaperKey = ({ data }: Post): string | undefined => {
  const paper = data.paper
  if (!paper) return undefined
  if (paper.doi) return `doi:${paper.doi}`
  if (paper.arxivId) return `arxiv:${paper.arxivId.replace(/v\d+$/u, '')}`
  if (paper.url) {
    const url = new URL(paper.url)
    if (url.hostname === 'doi.org' || url.hostname === 'dx.doi.org') {
      return `doi:${decodeURIComponent(url.pathname.slice(1)).toLowerCase()}`
    }
    if (url.hostname === 'arxiv.org') {
      return `arxiv:${url.pathname.replace(/^\/(?:abs|pdf)\//u, '').replace(/(?:v\d+)?(?:\.pdf)?$/u, '')}`
    }
  }
  return `title:${paper.title.normalize('NFKC').trim().toLowerCase().replace(/\s+/gu, ' ')}:${paper.year ?? ''}`
}

export const getReadingStats = (posts: Post[]) => {
  const notes = posts.filter(isPaperNote)
  const uniqueNotes = new Set(notes.map((post) => post.data.translationKey ?? post.id))
  const papers = new Set(notes.map(getPaperKey).filter((key): key is string => Boolean(key)))
  const updated = notes
    .map(({ data }) => data.updatedDate ?? data.publishDate)
    .sort((first, second) => second.valueOf() - first.valueOf())[0]
  return { noteCount: uniqueNotes.size, paperCount: papers.size, updated }
}

export const getReadingEntry = (post: Post): ReadingEntry => {
  const { id, data } = post
  return {
    id,
    url: localizePath(`/blog/${id}`, data.language),
    title: data.title,
    description: data.description,
    topics: data.researchTopics,
    year: data.paper?.year?.toString() ?? 'unknown',
    published: data.publishDate.toISOString(),
    updated: (data.updatedDate ?? data.publishDate).toISOString(),
    searchText: [
      data.title,
      data.description,
      ...data.tags,
      data.paper?.title,
      ...(data.paper?.authors ?? []),
      data.paper?.venue,
      data.paper?.doi,
      data.paper?.arxivId
    ]
      .filter(Boolean)
      .join(' ')
      .normalize('NFKC')
      .toLowerCase()
  }
}
