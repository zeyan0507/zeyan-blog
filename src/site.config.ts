import type { CardListData, Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

export const site = {
  title: "Zeyan's Blog",
  shortTitle: 'ZEYAN / NOTES',
  author: 'Zeyan',
  monogram: 'Z',
  established: '2026',
  tagline: 'Research, systems, and notes made durable.',
  location: 'Working across ideas, code, and experiments.',
  description:
    'A quiet notebook for research, engineering, paper reading, and the small ideas that become useful later.',
  siteUrl: 'https://zeyan.dev',
  locale: { lang: 'en-US', attrs: 'en_US', dateLocale: 'en-US' },
  navigation: [
    { label: 'Blog', href: '/blog' },
    { label: 'Research', href: '/research' },
    { label: 'Notes', href: '/notes' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' }
  ],
  navigationZh: [
    { label: '博客', href: '/blog' },
    { label: '研究', href: '/research' },
    { label: '笔记', href: '/notes' },
    { label: '项目', href: '/projects' },
    { label: '关于', href: '/about' }
  ],
  social: {
    github: undefined as string | undefined,
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
    { slug: 'daily-life', label: 'Daily Life', description: 'The non-technical edges of a technical life.' }
  ],
  collectionsIntro:
    'Long-running threads of study. Each collection gathers notes that are more useful together than alone.',
  projects: [
    {
      name: 'Research Notebook',
      description: 'A small publishing system for turning experiments and reading notes into durable knowledge.',
      stack: 'Astro · TypeScript · Markdown',
      status: 'In progress',
      year: '2026',
      href: undefined
      ,github: undefined as string | undefined,
      demo: undefined as string | undefined,
      related: ['astro-blog-setup'] as string[]
    },
    {
      name: 'Reproducible Lab Notes',
      description: 'Templates and scripts for keeping model runs, assumptions, and results close together.',
      stack: 'Python · PyTorch · Hydra',
      status: 'Exploring',
      year: '2025—',
      href: undefined
      ,github: undefined as string | undefined,
      demo: undefined as string | undefined,
      related: ['research-notes'] as string[]
    },
    {
      name: 'Reading Queue',
      description: 'A lightweight workflow for prioritising papers without losing the trail of open questions.',
      stack: 'Markdown · CLI · SQLite',
      status: 'Prototype',
      year: '2025',
      href: undefined
      ,github: undefined as string | undefined,
      demo: undefined as string | undefined,
      related: ['from-dqn-to-ppo'] as string[]
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
      'I am Zeyan, a researcher and engineer keeping a public notebook for the ideas I want to understand properly.',
    stack: ['Python', 'PyTorch', 'Linux', 'TypeScript', 'Astro', 'Markdown'],
    education: [] as { period: string; title: string; detail: string }[],
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
