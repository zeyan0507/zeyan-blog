import type { APIRoute, GetStaticPaths } from 'astro'
import { getCollection, type CollectionEntry } from 'astro:content'
import sharp from 'sharp'
import { site } from '@/site-config'

export const prerender = true
export const getStaticPaths = (async () => [
  { params: { id: 'site' }, props: { post: undefined } },
  ...(await getCollection('blog', ({ data }) => !data.draft)).map((post) => ({ params: { id: post.id }, props: { post } }))
]) satisfies GetStaticPaths

const escapeXml = (value: string) => value.replace(/[&<>"']/g, (character) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]!
)

function titleLines(title: string) {
  const lines: string[] = []
  let line = ''
  let width = 0
  for (const character of title) {
    const characterWidth = /[^\u0000-\u00ff]/.test(character) ? 2 : 1
    if (width + characterWidth > 34) { lines.push(line.trim()); line = ''; width = 0 }
    line += character
    width += characterWidth
  }
  if (line) lines.push(line.trim())
  return lines.slice(0, 4)
}

export const GET: APIRoute = async ({ props }) => {
  const post = props.post as CollectionEntry<'blog'> | undefined
  const title = post?.data.title ?? site.title
  const category = post?.data.category.replaceAll('-', ' ') ?? 'Research · Engineering · Learning'
  const date = post?.data.publishDate.toISOString().slice(0, 10) ?? site.tagline
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${site.appearance.lightColor}"/>
    <path d="M72 122H1128M72 544H1128" stroke="#dcd8d0"/>
    <text x="72" y="83" font-size="24" font-family="sans-serif" fill="#ba6420">${escapeXml(site.shortTitle)}</text>
    <text x="72" y="176" font-size="18" font-family="sans-serif" fill="#686c75">${escapeXml(category.toUpperCase())}</text>
    ${titleLines(title).map((line, index) => `<text x="72" y="${265 + index * 72}" font-size="60" font-family="Microsoft YaHei, Noto Sans CJK SC, DejaVu Sans, sans-serif" fill="#20232d">${escapeXml(line)}</text>`).join('')}
    <text x="72" y="588" font-size="19" font-family="sans-serif" fill="#686c75">${escapeXml(date)}</text>
    <text x="1128" y="588" text-anchor="end" font-size="19" font-family="sans-serif" fill="#686c75">${escapeXml(site.author)}</text>
  </svg>`
  const image = await sharp(Buffer.from(svg)).png().toBuffer()
  return new Response(new Uint8Array(image), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } })
}
