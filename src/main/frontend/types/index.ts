// 타입 정의
export interface SearchResult {
  id: string
  title: string
  description: string
  url: string
  link?: string; 
  source: string
  tags: string[]    
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

export interface KnowledgePanelType {
  title: string
  description: string
  // 기타 필요한 필드들
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
  page?: number 
  size?: number
  sortBy?: "relevance" | "date" | "popularity"
}

export interface CollectionHistory {
  id: string
  datasetName: string
  collectedAt: string
  status: "success" | "failed" | "in_progress"
  recordCount: number
  fileSize: string
  format: string
  source: string
  error?: string
}

export interface HackerNewsItem {
  id?: number;
  by: string;
  time: number;
  title: string;
  url: string;
  score?: number;
  descendants?: number;
  type?: string;
}

export interface TrendKeyword {
  keyword: string
  count: number
  trend: "up" | "down" | "stable"
  percentage: number
}
