"use client"
import { useState, useCallback } from "react"
// 직접 axios를 사용하는 대신, 설정이 완료된 api 클라이언트를 가져옵니다.
import api from '@/lib/api/base';
import { logSearchQuery } from '@/lib/api/analysis';
import type { SearchResult, SearchFilters } from "@/types"

export const useSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({})
  const [totalResults, setTotalResults] = useState(0)
  const [searchTime, setSearchTime] = useState(0)
  const [knowledgePanel, setKnowledgePanel] = useState<any>(null)

  const search = useCallback(async (searchQuery: string, searchFilters?: SearchFilters) => {
    if (!searchQuery.trim()) {
      setResults([])
      setQuery("")
      setTotalResults(0)
      return
    }

    setLoading(true)
    setError(null)
    setQuery(searchQuery)
    setFilters(searchFilters || {})

    try {
      const startTime = Date.now()

      // 검색어 로깅 API 호출 (성공적으로 동작하던 부분)
      await logSearchQuery(searchQuery);

      console.log("검색 실행됨:", searchQuery);

      // ★★★ 이 부분이 수정되었습니다! ★★★
      // 직접 axios.get 대신, baseURL이 설정된 'api' 인스턴스를 사용합니다.
      const response = await api.get('/es/questions', {
        params: { query: searchQuery, ...searchFilters },
      })
      // ★★★★★★★★★★★★★★★★★★★★★

      console.log("📦 검색 결과:", response.data);

      const rawResults: any[] = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      const apiResults: SearchResult[] = rawResults.map((r, index) => ({
        ...r,
        id: String(r.question_id ?? index),
        keywords: r.tags || [],
      }));

      const knowledgeData = response.data.knowledgePanel || null

      setResults(apiResults)
      const endTime = Date.now()
      setSearchTime((endTime - startTime) / 1000)
    } catch (err) {
      setError("검색 중 오류가 발생했습니다.")
      setResults([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearSearch = useCallback(() => {
    setResults([])
    setQuery("")
    setFilters({})
    setError(null)
    setTotalResults(0)
    setSearchTime(0)
  }, [])

  return {
    results,
    knowledgePanel,
    loading,
    error,
    query,
    filters,
    totalResults,
    searchTime,
    search,
    clearSearch,
  }
}
