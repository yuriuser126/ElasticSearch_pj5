// 타입 정의
export interface SearchResult {
  id: string
  title: string
  description: string
  url: string
  source: string
  keywords: string[]
  category: string
  lastUpdated: string
  dataFormat: string
  swaggerUrl?: string
  apiEndpoint?: string
  license: string
  downloadCount: number
  rating: number
}

export interface SwaggerDoc {
  id: string
  title: string
  description: string
  version: string
  swaggerUrl: string
  apiEndpoint: string
  methods: Array<{
    method: string
    path: string
    summary: string
    description: string
  }>
}

export interface SearchFilters {
  category?: string
  format?: string
  sortBy?: "relevance" | "date" | "popularity"
}
