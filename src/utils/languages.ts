import type { CollectionEntry } from 'astro:content'

export type LanguageLink = { href: string; label: string; lang: string }

type BlogPost = CollectionEntry<'blog'>

const languageLink = (href: string, language: string): LanguageLink => ({
  href,
  lang: language,
  label: language.toLowerCase().startsWith('zh') ? '中文' : 'EN'
})

export const isChineseLanguage = (language?: string) => language?.toLowerCase().startsWith('zh') ?? false

export const localizePath = (href: string, language?: string) => {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  const [, pathname, suffix] = href.match(/^([^?#]*)(.*)$/u) ?? ['', href, '']
  const cleanPath = pathname === '/zh' ? '/' : pathname.replace(/^\/zh(?=\/)/u, '')
  if (!isChineseLanguage(language)) return `${cleanPath}${suffix}`
  return `${cleanPath === '/' ? '/zh' : `/zh${cleanPath}`}${suffix}`
}

export const getBlogLanguageLinks = (post: BlogPost, posts: BlogPost[]): LanguageLink[] => {
  if (!post.data.translationKey) return []

  return posts
    .filter(({ id, data }) => id !== post.id && data.translationKey === post.data.translationKey && data.language !== post.data.language)
    .map(({ id, data }) => languageLink(localizePath(`/blog/${id}`, data.language), data.language))
}

export const getPageLanguageLinks = (pathname: string, language: string): LanguageLink[] => {
  const isChinese = language.toLowerCase().startsWith('zh')
  const targetLanguage = isChinese ? 'en-US' : 'zh-CN'
  const plainPath = pathname === '/zh' ? '/' : pathname.replace(/^\/zh(?=\/)/u, '')
  const supported = ['/', '/about', '/academic', '/research', '/notes', '/projects', '/blog', '/search', '/collections', '/archives', '/tags', '/links']
  const hasParallelRoute = supported.some((prefix) => prefix === '/' ? plainPath === '/' : plainPath === prefix || plainPath.startsWith(`${prefix}/`))
  return [languageLink(hasParallelRoute ? localizePath(pathname, targetLanguage) : localizePath('/', targetLanguage), targetLanguage)]
}
