declare module '@pagefind/default-ui' {
  interface SearchResult { url: string; sub_results: { url: string; [key: string]: unknown }[]; [key: string]: unknown }
  export class PagefindUI {
    constructor(options: {
      element: string | HTMLElement
      bundlePath?: string
      baseUrl?: string
      showImages?: boolean
      showSubResults?: boolean
      resetStyles?: boolean
      processResult?: (result: SearchResult) => SearchResult
    })
    destroy(): void
  }
}
