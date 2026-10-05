import type { ReadingEntry } from '@/utils/paper-reading'
import { selectReadingEntries, type ReadingFilters } from '@/utils/reading-filters'

interface SearchHit {
  url: string
  excerpt: string
}
interface PagefindModule {
  search(
    query: string,
    options: { filters: Record<string, string> }
  ): Promise<{
    results: { data(): Promise<SearchHit> }[]
  }>
}
type SearchMatches = Map<string, string>

class PaperLibrary extends HTMLElement {
  private entries: ReadingEntry[] = []
  private cards = new Map<string, HTMLElement>()
  private searchIndex?: Promise<PagefindModule>
  private searchCache = new Map<string, SearchMatches>()
  private generation = 0
  private debounce?: ReturnType<typeof setTimeout>
  private listeners = new AbortController()
  private pageSize = 8
  private chinese = false

  connectedCallback() {
    this.entries = JSON.parse(this.dataset.records ?? '[]') as ReadingEntry[]
    this.chinese = this.dataset.language?.startsWith('zh') ?? false
    this.querySelectorAll<HTMLElement>('[data-note-id]').forEach((card) => {
      if (card.dataset.noteId) this.cards.set(card.dataset.noteId, card)
    })
    const tools = this.querySelector<HTMLElement>('[data-interactive]')
    if (tools) tools.hidden = false
    this.listeners.abort()
    this.listeners = new AbortController()
    const { signal } = this.listeners

    this.querySelector<HTMLInputElement>('[name=q]')?.addEventListener(
      'input',
      () => {
        this.generation++
        clearTimeout(this.debounce)
        this.debounce = setTimeout(() => this.change({ page: '1' }, true), 180)
      },
      { signal }
    )
    this.querySelectorAll<HTMLSelectElement>('select').forEach((select) => {
      select.addEventListener('change', () => this.change({ page: '1' }), { signal })
    })
    this.addEventListener(
      'click',
      (event) => {
        const target =
          event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button') : null
        if (!target) return
        if (target.hasAttribute('data-topic'))
          this.change({ topic: target.dataset.topic ?? '', page: '1' })
        if (target.hasAttribute('data-reset')) this.reset()
        if (target.hasAttribute('data-page-prev'))
          this.change({ page: String(this.filters().page - 1) })
        if (target.hasAttribute('data-page-next'))
          this.change({ page: String(this.filters().page + 1) })
      },
      { signal }
    )
    window.addEventListener(
      'popstate',
      () => {
        clearTimeout(this.debounce)
        this.restoreControls()
        void this.render()
      },
      { signal }
    )
    document.addEventListener(
      'keydown',
      (event) => {
        const editing =
          event.target instanceof Element &&
          event.target.closest('input, textarea, select, [contenteditable]')
        if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !editing) {
          event.preventDefault()
          this.querySelector<HTMLInputElement>('[name=q]')?.focus()
        }
      },
      { signal }
    )
    this.restoreControls()
    void this.render()
  }

  disconnectedCallback() {
    this.listeners.abort()
    clearTimeout(this.debounce)
    this.generation++
  }

  private filters(): ReadingFilters {
    const params = new URL(window.location.href).searchParams
    const sort = params.get('sort')
    const topic = params.get('topic') ?? ''
    const knownTopics = new Set(
      Array.from(
        this.querySelectorAll<HTMLElement>('[data-topic]'),
        (button) => button.dataset.topic
      )
    )
    const year = params.get('year') ?? ''
    const depth = params.get('depth') ?? ''
    return {
      query: (params.get('q') ?? '').trim().slice(0, 300),
      topic: knownTopics.has(topic) ? topic : '',
      year: this.entries.some((entry) => entry.year === year) ? year : '',
      depth: ['skim', 'deep', 'reproduced', 'unmarked'].includes(depth) ? depth : '',
      sort: sort === 'year' || sort === 'published' ? sort : 'updated',
      page: Math.max(1, Number.parseInt(params.get('page') ?? '1', 10) || 1)
    }
  }

  private restoreControls() {
    const filters = this.filters()
    const query = this.querySelector<HTMLInputElement>('[name=q]')
    if (query) query.value = filters.query
    for (const name of ['year', 'depth', 'sort'] as const) {
      const select = this.querySelector<HTMLSelectElement>(`[name=${name}]`)
      if (select) select.value = filters[name]
    }
    this.querySelectorAll<HTMLElement>('[data-topic]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.topic === filters.topic))
    })
  }

  private change(overrides: Record<string, string>, replace = false) {
    clearTimeout(this.debounce)
    const url = new URL(window.location.href)
    const values: Record<string, string> = {
      q: this.querySelector<HTMLInputElement>('[name=q]')?.value.trim() ?? ''
    }
    this.querySelectorAll<HTMLSelectElement>('select').forEach((select) => {
      values[select.name] = select.value
    })
    Object.assign(values, overrides)
    for (const [name, value] of Object.entries(values)) {
      if (!value || (name === 'sort' && value === 'updated') || (name === 'page' && value === '1'))
        url.searchParams.delete(name)
      else url.searchParams.set(name, value)
    }
    if (url.href !== window.location.href) {
      if (replace) window.history.replaceState(null, '', url)
      else window.history.pushState(null, '', url)
    }
    this.restoreControls()
    void this.render()
  }

  private reset() {
    const query = this.querySelector<HTMLInputElement>('[name=q]')
    if (query) query.value = ''
    this.querySelectorAll<HTMLSelectElement>('select').forEach((select) => {
      select.value = select.name === 'sort' ? 'updated' : ''
    })
    this.change({ topic: '', page: '1' })
  }

  private status(text = '') {
    const status = this.querySelector<HTMLElement>('[data-search-status]')
    if (status) {
      status.textContent = text
      status.hidden = !text
    }
  }

  private async search(query: string): Promise<SearchMatches> {
    const cached = this.searchCache.get(query)
    if (cached) return cached
    if (!this.searchIndex) {
      const bundleUrl = '/pagefind/pagefind.js'
      this.searchIndex = import(bundleUrl) as Promise<PagefindModule>
    }
    let pagefind: PagefindModule
    try {
      pagefind = await this.searchIndex
    } catch (error) {
      this.searchIndex = undefined
      throw error
    }
    const result = await pagefind.search(query, { filters: { kind: 'paper-note' } })
    const hits = await Promise.all(result.results.map((result) => result.data()))
    const byUrl = new Map(this.entries.map((entry) => [entry.url, entry.id]))
    const matches: SearchMatches = new Map()
    for (const hit of hits) {
      const path = new URL(hit.url, window.location.origin).pathname.replace(/\/$/u, '')
      const id = byUrl.get(path)
      if (id) matches.set(id, hit.excerpt)
    }
    if (this.searchCache.size >= 6)
      this.searchCache.delete(this.searchCache.keys().next().value ?? '')
    this.searchCache.set(query, matches)
    return matches
  }

  private async render() {
    const generation = ++this.generation
    const filters = this.filters()
    this.status()
    this.removeAttribute('aria-busy')
    const cached = this.searchCache.get(filters.query)
    this.show(
      filters,
      cached ?? new Map(),
      !filters.query || Boolean(cached) || this.hasAttribute('data-dev')
    )
    if (!filters.query) return
    if (this.hasAttribute('data-dev')) {
      this.status(
        this.chinese
          ? '当前为开发预览：正在匹配标题和元信息；全文查询请在生产构建后测试。'
          : 'Development preview: matching titles and metadata. Build the site to test full-text search.'
      )
      return
    }
    this.status(this.chinese ? '正在查询笔记全文…' : 'Searching note text…')
    this.setAttribute('aria-busy', 'true')
    try {
      const matches = await this.search(filters.query)
      if (generation !== this.generation) return
      this.show(filters, matches)
      this.status()
    } catch {
      if (generation !== this.generation) return
      this.show(filters, new Map())
      this.status(
        this.chinese
          ? '全文索引暂时不可用，目前仅匹配标题、作者、标签与摘要。可稍后重试。'
          : 'Full-text search is unavailable. Matching titles, authors, tags, and descriptions only. Try again later.'
      )
    } finally {
      if (generation === this.generation) this.removeAttribute('aria-busy')
    }
  }

  private show(filters: ReadingFilters, matches: SearchMatches, normalizePage = true) {
    const selected = selectReadingEntries(this.entries, filters, new Set(matches.keys()))
    const pages = Math.max(1, Math.ceil(selected.length / this.pageSize))
    const page = Math.min(filters.page, pages)
    if (normalizePage && page !== filters.page) {
      const url = new URL(window.location.href)
      if (page === 1) url.searchParams.delete('page')
      else url.searchParams.set('page', String(page))
      window.history.replaceState(null, '', url)
    }
    this.cards.forEach((card) => {
      card.hidden = true
    })
    const list = this.querySelector<HTMLElement>('.reading-list')
    selected.slice((page - 1) * this.pageSize, page * this.pageSize).forEach((entry, index) => {
      const card = this.cards.get(entry.id)
      if (!card || !list) return
      card.hidden = false
      const number = card.querySelector<HTMLElement>('.paper-number')
      if (number)
        number.textContent = String((page - 1) * this.pageSize + index + 1).padStart(2, '0')
      const excerpt = card.querySelector<HTMLElement>('[data-excerpt]')
      const description = card.querySelector<HTMLElement>('.paper-description')
      const snippet = filters.query ? matches.get(entry.id) : undefined
      if (excerpt) {
        this.excerpt(excerpt, snippet ?? '')
        excerpt.hidden = !snippet
      }
      if (description) description.hidden = Boolean(snippet)
      list.append(card)
    })
    const summary = this.querySelector<HTMLElement>('[data-summary]')
    if (summary)
      summary.textContent = this.chinese
        ? `找到 ${selected.length} 篇 / 共 ${this.entries.length} 篇${filters.query ? ` · “${filters.query}”` : ''}`
        : `${selected.length} of ${this.entries.length} notes${filters.query ? ` · “${filters.query}”` : ''}`
    const empty = this.querySelector<HTMLElement>('[data-empty]')
    if (empty) empty.hidden = selected.length !== 0
    const pagination = this.querySelector<HTMLElement>('[data-pagination]')
    if (pagination) pagination.hidden = pages <= 1
    const label = this.querySelector<HTMLElement>('[data-page-label]')
    if (label) label.textContent = `${page} / ${pages}`
    const previous = this.querySelector<HTMLButtonElement>('[data-page-prev]')
    const next = this.querySelector<HTMLButtonElement>('[data-page-next]')
    if (previous) previous.disabled = page <= 1
    if (next) next.disabled = page >= pages
  }

  private excerpt(target: HTMLElement, html: string) {
    target.replaceChildren()
    const parsed = new DOMParser().parseFromString(html, 'text/html')
    const append = (node: Node, parent: Node) => {
      if (node.nodeType === Node.TEXT_NODE)
        parent.appendChild(document.createTextNode(node.textContent ?? ''))
      else if (node instanceof Element) {
        const container = node.tagName === 'MARK' ? document.createElement('mark') : parent
        if (container !== parent) parent.appendChild(container)
        node.childNodes.forEach((child) => append(child, container))
      }
    }
    parsed.body.childNodes.forEach((node) => append(node, target))
  }
}

if (!customElements.get('paper-library')) customElements.define('paper-library', PaperLibrary)
