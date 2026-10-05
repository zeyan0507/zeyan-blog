# Zeyan's Blog

这是一个独立的个人科研与技术博客，使用 Astro 构建。项目保留了 Astro Theme Pure 的内容模型
和部分通用工具，但信息架构、视觉系统、文章内容、配置和组件均围绕这个博客重新组织。

## 内容方向

- 科研思考、论文阅读、工程实验与学习记录
- 以排版和阅读体验为核心的克制型界面
- 静态优先，尽量减少客户端 JavaScript
- 博客分类、标签、Collections、归档、RSS、Sitemap、SEO 和 Pagefind 搜索

## 技术栈

- Astro 与 TypeScript
- Markdown / MDX Content Collections
- 在合适的地方使用 Astro Pure 工具和组件
- Shiki、KaTeX、Pagefind、RSS 与 Sitemap

## 本地开发

安装依赖并启动开发服务器：

```sh
npm install
npm run dev
```

常用检查命令：

```sh
npm run check
npm run lint
npm run build
npm run preview
```

## 项目结构

- `src/site.config.ts` —— 网站身份、导航、社交链接、项目、研究主题和页脚配置
- `src/content/blog/` —— 博客文章及其 frontmatter
- `src/content/collections/` —— 长期学习主题及文章集合
- `src/components/` —— 网站自己的导航、博客和集合组件
- `src/pages/` —— `/blog`、`/research`、`/projects`、`/about` 等公开页面
- `packages/pure/` —— 作为技术基础保留的本地 Astro Pure 包

## 写作

在 `src/content/blog/` 下新增 Markdown 或 MDX 文件，并按照 `src/content.config.ts` 中的 schema
填写 frontmatter。正在撰写的文章可以设置 `draft: true`，这样不会被发布到生成的网站中。

生产构建会将静态文件输出到 `dist/`，可以部署到任意静态托管平台。

## 论文阅读中心

中英文阅读中心沿用 `/zh/blog/paper-reading` 和 `/blog/paper-reading`。首页与博客菜单提供入口，
支持研究方向、论文年份、排序、每页 8 篇笔记和关键词查询；筛选条件保存在 URL 中。
按 `/` 可以聚焦阅读中心查询框，`Ctrl/Cmd + K` 仍然打开全站搜索。

`category: paper-reading` 的公开笔记，以及带有 `paper` 信息的其他公开文章，会出现在所属语言的阅读中心。
草稿不会出现在列表、统计或搜索中。普通文章无需添加以下字段，旧笔记也可以暂时不关联论文：

```yaml
category: paper-reading
researchTopics:
  - reinforcement-learning
paper:
  title: 'High-Dimensional Continuous Control Using Generalized Advantage Estimation'
  authors: ['John Schulman', 'Philipp Moritz', 'Sergey Levine', 'Michael Jordan', 'Pieter Abbeel']
  year: 2015
  venue: arXiv
  url: 'https://arxiv.org/abs/1506.02438'
  arxivId: '1506.02438'
```

研究方向的标识与中英文名称维护在 `src/paper-reading.config.ts`，一篇笔记可以有多个方向，
只有已经有公开笔记的方向会显示为筛选按钮。细粒度方法仍使用 `tags`，系统学习路线仍使用专题集。

论文标题为 `paper` 对象唯一必填项。其他可选字段为 `authors`、`year`、`venue`、`url`、`doi`、`arxivId`。
请为同一论文的笔记和翻译使用相同的 DOI 或 arXiv ID，方便稳定去重；没有标识时按原文标题与年份去重。
论文年份独立于笔记发布时间。未关联原论文的内容只计入笔记数，不计入论文数。

全文查询复用 Pagefind，只返回当前语言的论文阅读笔记，并显示命中摘要。索引不可用时降级匹配
标题、作者、标签、论文信息与摘要，并明确提示。全文搜索应在 `npm run build` 后使用
`npm run preview -- --host 127.0.0.1 --port 4325` 验证；开发服务器仅提供元信息查询。

## 版本回溯

本次改版前的完整源码已保存在 Git 标签 `before-paper-reading-2026-10-05`，对应提交 `328e466`。
同一版本另有本机 ZIP 备份：`C:/Users/MSI/Desktop/vlog-backups/zeyan-blog-before-paper-reading-2026-10-05.zip`。
备份不包含依赖、环境变量或部署凭据。

不改变当前工作区即可导出旧版源码：

```sh
git fetch origin --tags
git archive --format=zip --output=blog-before-paper-reading.zip before-paper-reading-2026-10-05
```

要单独查看或启动旧版，可以创建一个独立的工作区：

```sh
git worktree add --detach ../zeyan-blog-original before-paper-reading-2026-10-05
```

要回退已发布版本，先确认工作区干净，找到 `feat: add bilingual paper reading center` 的提交，
再使用 `git revert <提交号>` 生成回退提交并 `git push origin main`。不要对共享分支使用强制推送。

## 许可证

仓库中包含改编自 Astro Theme Pure 的代码。仓库许可证请参阅 `LICENSE`，本地包的具体信息请参阅
`packages/pure/` 下的包元数据。
