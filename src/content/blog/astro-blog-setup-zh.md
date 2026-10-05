---
title: 'Astro 博客搭建记录'
description: '一个静态优先的 Astro 笔记系统背后的选择：内容集、搜索、排版与尽量小的客户端交互面。'
publishDate: '2026-06-04'
category: technical
tags:
  - astro
  - typescript
  - web engineering
  - publishing
language: zh
translationKey: astro-blog-setup
---

我希望博客在浏览器中保持安静，在源码目录里又足够富于表现力。当前方案使用 Astro、Markdown/MDX、内容集、Pagefind、KaTeX、Shiki、RSS 和站点地图生成，不需要额外引入客户端应用框架。

## 边界

站点由三个清晰层次组成：

| 层 | 职责 | 默认运行时机 |
| --- | --- | --- |
| 内容 | Markdown、前置数据、内容集 | 构建时 |
| 表现 | Astro 布局与组件 | 服务器/构建时 |
| 交互 | 搜索、主题、移动菜单 | 少量浏览器脚本 |

这条边界让内容保持可移植。文章不需要知道页眉如何工作，页眉也不需要激活一个全局应用状态。

## 优先建立内容集

博客 schema 保存影响信息架构的字段：`category`、`collection`、`featured`、`tags` 与日期。路由可以直接查询内容，而不需要再维护一份文章注册表。

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

重要的不是精确的字段列表，而是 schema 让文章的发布契约变得可见，并在部署之前得到检查。

## 不借助应用框架的搜索

Pagefind 根据生成后的页面建立索引。搜索路由渲染默认界面，页眉则提供熟悉的 `Ctrl/Cmd + K` 快捷键。当归档允许持续增长时，搜索很有用；但这不是将每个页面都变成应用的理由。

## 将排版当作基础设施

视觉系统刻意保持克制：温暖的纸张底色、单一墨色、小面积强调色、细分隔线，以及与系统无衬线正文配对的衬线展示字体。间距与行长承担了比装饰更多的工作。在移动端，双栏归档会变成单阅读列，而不是简单缩小桌面组图。

## 一份小清单

- 更改内容 schema 后运行 `npm run check`。
- 使用包含数学公式、代码、链接和长表格的文章进行测试。
- 构建后检查 `/rss.xml`、`/sitemap-index.xml` 和 `/robots.txt`。
- 在禁用 JavaScript 时检查归档与搜索路由。
- 将站点身份与导航集中在 `src/site.config.ts`。

有用的结果并不是一个繁复主题，而是一个让人愿意回到工作中的发布界面。
