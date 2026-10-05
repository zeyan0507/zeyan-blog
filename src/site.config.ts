import type { CardListData, Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

export const site = {
  title: "Zeyan's Blog",
  shortTitle: "ZEYAN'S BLOG",
  author: 'zeyan',
  authorZh: '仄言',
  monogram: 'Z',
  established: '2026',
  tagline: 'Senior year at Xidian University, in progress.',
  location: "Xi'an, China",
  description:
    'A personal notebook for research, technology, learning, and everyday life.',
  siteUrl: 'https://zeyan-blog.vercel.app',
  profile: {
    avatar: '/images/avatar-zeyan.jpg',
    name: 'zeyan',
    nameZh: '仄言',
    location: "Xi'an, China",
    locationZh: '西安',
    role: 'Senior undergraduate at Xidian University',
    roleZh: '西电大四',
    introduction: 'Senior year at Xidian University, in progress.',
    introductionZh: '西电大四ing'
  },
  locale: { lang: 'en-US', attrs: 'en_US', dateLocale: 'en-US' },
  navigation: [
    { label: 'Blog', href: '/blog' },
    { label: 'Academic', href: '/academic' },
    { label: 'Projects', href: '/projects' },
    { label: 'Links', href: '/links' },
    { label: 'About', href: '/about' }
  ],
  navigationZh: [
    { label: '博客', href: '/blog' },
    { label: '学术', href: '/academic' },
    { label: '项目', href: '/projects' },
    { label: '链接', href: '/links' },
    { label: '关于', href: '/about' }
  ],
  social: {
    github: 'https://github.com/zeyan0507' as string | undefined,
    email: undefined as string | undefined,
    scholar: undefined as string | undefined
  },
  appearance: { defaultTheme: 'system', lightColor: '#fcfbf8', darkColor: '#13161b' },
  analytics: { enabled: false, scriptSrc: undefined as string | undefined, websiteId: undefined as string | undefined },
  blogCategories: [
    { slug: 'all', label: 'All', description: 'Every dispatch from the notebook.' },
    { slug: 'research', label: 'Research', description: 'Questions, experiments, and work in progress.' },
    { slug: 'technical', label: 'Technical', description: 'Tools, systems, code, and practical notes.' },
    { slug: 'paper-reading', label: 'Paper Reading', description: 'Slow reading notes for papers worth returning to.' },
    { slug: 'learning-notes', label: 'Learning Notes', description: 'Concepts made clearer by writing them down.' },
    { slug: 'daily-life', label: 'Daily Life', description: 'The non-technical edges of a technical life.' },
    { slug: 'month-journal', label: 'Month Journal', description: 'Monthly notes, changes, and small discoveries.' }
  ],
  collectionsIntro:
    'Long-running threads of study. Each collection gathers notes that are more useful together than alone.',
  projects: [
    {
      name: "Zeyan's Blog",
      description: 'A bilingual personal blog for publishing notes and keeping useful ideas easy to revisit.',
      stack: 'Astro · TypeScript · Markdown',
      status: 'Active',
      year: '2026—',
      href: 'https://zeyan-blog.vercel.app',
      github: 'https://github.com/zeyan0507/zeyan-blog' as string | undefined,
      demo: 'https://zeyan-blog.vercel.app' as string | undefined,
      related: ['astro-blog-setup'] as string[]
    }
  ],
  research: {
    description:
      'I am interested in methods that make learning systems easier to reason about, reproduce, and apply to scientific questions.',
    interests: ['Reinforcement learning', 'AI for science', 'Scientific machine learning', 'Reproducible research'],
    topics: [
      ['Policy optimisation', 'Understanding the assumptions that make learning signals useful.'],
      ['Scientific inverse problems', 'Building models that respect structure instead of hiding it.'],
      ['Research tooling', 'Making the path from idea to evidence easier to inspect.']
    ],
    experiments: [
      { title: 'Advantage estimator diagnostics', description: 'Compare estimator variance and value error across fixed-seed rollouts.', status: 'Planned' },
      { title: 'Small reproducibility audits', description: 'Record environment, assumptions, and a minimal rerun command beside each experiment.', status: 'Planned' }
    ]
  },
  about: {
    intro:
      "I'm zeyan, a senior undergraduate at Xidian University, currently based in Xi'an.",
    stack: [] as string[],
    education: [
      { period: 'Current', title: 'Xidian University', detail: 'Senior undergraduate' }
    ] as { period: string; title: string; detail: string }[],
    experience: [] as { period: string; title: string; detail: string }[],
    cv: undefined as string | undefined,
    principles: [
      'Write to expose assumptions, not to sound certain.',
      'Prefer small experiments that can be rerun.',
      'Leave a clear trail from question to evidence.'
    ]
  },
  footer: {
    note: 'Built slowly, published deliberately.',
    links: [
      { label: 'RSS', href: '/rss.xml' }
    ]
  }
} as const

export const theme: ThemeUserConfig = {
  title: site.title,
  author: site.author,
  description: site.description,
  favicon: '/favicon/favicon.svg',
  socialCard: '/og/site.png',
  locale: {
    lang: site.locale.lang,
    attrs: site.locale.attrs,
    dateLocale: site.locale.dateLocale,
    dateOptions: { day: 'numeric', month: 'short', year: 'numeric' }
  },
  logo: { src: '/favicon/favicon.svg', alt: site.title },
  titleDelimiter: '·',
  prerender: true,
  npmCDN: 'https://cdn.jsdelivr.net/npm',
  head: [],
  customCss: [],
  header: { menu: site.navigation.map(({ label, href }) => ({ title: label, link: href })) },
  footer: {
    year: `© ${new Date().getFullYear()}`,
    links: [],
    credits: false,
    social: [{ icon: 'rss', label: 'RSS', href: '/rss.xml' }]
  },
  content: {
    externalLinks: { content: ' ↗', properties: { style: 'user-select:none' } },
    blogPageSize: 8,
    share: [],
    imageCaption: true
  }
}

export const integ: IntegrationUserConfig = {
  links: {
    logbook: [],
    applyTip: [
      { name: 'Name', val: site.author },
      { name: 'Desc', val: site.description },
      { name: 'Link', val: site.siteUrl },
      { name: 'Avatar', val: `${site.siteUrl}/favicon/favicon.svg` }
    ],
    cacheAvatar: false
  },
  pagefind: true,
  quote: {
    server: 'https://dummyjson.com/quotes/random',
    target: `(data) => data.quote || 'Make the work easy to return to.'`
  },
  typography: {
    class: 'prose prose-pure dark:prose-invert max-w-none text-base',
    blockquoteStyle: 'normal',
    inlineCodeBlockStyle: 'modern'
  },
  mediumZoom: { enable: true, selector: '.prose .zoomable', options: { className: 'zoomable' } },
  waline: { enable: false, showMeta: false, additionalConfigs: {} }
}

export const terms: CardListData = {
  title: 'Site policy',
  list: [
    { title: 'Privacy Policy', link: '/terms/privacy-policy' },
    { title: 'Terms and Conditions', link: '/terms/terms-and-conditions' },
    { title: 'Copyright', link: '/terms/copyright' },
    { title: 'Disclaimer', link: '/terms/disclaimer' }
  ]
}

const config = { ...theme, integ } as Config

export default config
