"use client"

import { useState, useCallback } from "react"
import axios from "axios"
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
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8485"




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


      console.log("검색 실행됨", searchQuery);
      // Elasticsearch API 호출
      const response = await axios.get(`${baseURL}/es/questions`, {
        params: { query: searchQuery, ...searchFilters },
      })
      console.log("📦 검색 결과:", response.data);

      // ES 응답이 배열인지, 객체 안 배열인지 확인 후 flatten
const rawResults: any[] = Array.isArray(response.data)
  ? response.data
  : response.data.results || [];

// question_id를 id로, tags를 keywords로 변환
const apiResults: SearchResult[] = rawResults.map((r) => ({
  ...r,
  id: String(r.question_id),     // question_id → id
  keywords: r.tags || [],        // tags → keywords
}));
      const knowledgeData = response.data.knowledgePanel || null

      setResults(apiResults)
      // setTotalResults(total)

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
