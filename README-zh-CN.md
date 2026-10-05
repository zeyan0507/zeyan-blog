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

## 许可证

仓库中包含改编自 Astro Theme Pure 的代码。仓库许可证请参阅 `LICENSE`，本地包的具体信息请参阅
`packages/pure/` 下的包元数据。
