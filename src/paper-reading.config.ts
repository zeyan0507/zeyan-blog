export const researchTopics = [
  { slug: 'reinforcement-learning', label: 'Reinforcement learning', labelZh: '强化学习' },
  { slug: 'ai-for-science', label: 'AI for science', labelZh: 'AI 驱动科学' },
  { slug: 'scientific-ml', label: 'Scientific machine learning', labelZh: '科学机器学习' },
  { slug: 'research-methods', label: 'Research methods', labelZh: '研究方法' }
] as const

export const readingDepths = {
  skim: { label: 'First pass', labelZh: '初读' },
  deep: { label: 'Close reading', labelZh: '精读' },
  reproduced: { label: 'Reproduced', labelZh: '已复现' },
  unmarked: { label: 'Not marked', labelZh: '未标注' }
} as const
