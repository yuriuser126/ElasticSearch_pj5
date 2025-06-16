"use client"

import { useState, useCallback } from "react"
import axios from "axios"
import type { SearchResult, SearchFilters } from "@/types"




export const useSearch = (initialQuery: string = "") => {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState(initialQuery)
  const [totalResults, setTotalResults] = useState(0)
  const [searchTime, setSearchTime] = useState(0)
  const [knowledgePanel, setKnowledgePanel] = useState<any>(null)
  const resultsPerPage = 10;
  const shouldShowPagination = !loading && !error && results.length > 0 && totalResults > resultsPerPage;

  
  
  
  // ❌ page 상태 제거 - page.tsx에서 관리
  // const [page, setPage] = useState(1)
  
  // ❌ filters 상태를 참조로 반환하지 않음 - 무한 루프 방지
  const [filters, setFilters] = useState<SearchFilters>({})

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  const size = 10
  

  const search = useCallback(async (searchQuery: string, searchParams: any = {}) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setQuery("");
      setTotalResults(0);
      return;
    }

    setLoading(true);
    setError(null);
    setQuery(searchQuery);

    try {
      const startTime = Date.now();

      const currentPage = searchParams.page ?? 1;
      const currentSize = searchParams.size ?? size;

      console.log("🔍 검색 API 호출:", {
        query: searchQuery,
        page: currentPage,
        size: currentSize,
        params: searchParams
      });

      // Elasticsearch API 호출
      const response = await axios.get(`${baseURL}/es/questions`, {
        params: {
          query: searchQuery,
          page: currentPage,
          size: currentSize,
          // 다른 필터들도 전달
          ...searchParams
        },
      });

      console.log("📦 API 응답:", response.data);

      const rawResults: any[] = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      const apiResults: SearchResult[] = rawResults.map((r, index) => ({
        ...r,
        id: String(r.question_id ?? index),
        keywords: r.tags || [],
      }));

      console.log("🧩 apiResults:", apiResults);
      setResults(apiResults);
      setKnowledgePanel(response.data.knowledgePanel || null);

      // totalResults 설정
      const total = response.data.total || response.data.totalResults || apiResults.length;
      setTotalResults(total);


      console.log("🚩 totalResults:(실제 값)", total);
      console.log("🚩 results.length:", apiResults.length);
      console.log("🚩 MAX_PAGE:", Math.ceil(total / size));


      console.log("📊 검색 결과 통계:", {
        결과개수: apiResults.length,
        전체결과: total,
        현재페이지: currentPage,
        페이지크기: currentSize
      });

      const endTime = Date.now();
      setSearchTime((endTime - startTime) / 1000);
    } catch (err) {
      console.error("❌ 검색 오류:", err);
      setError("검색 중 오류가 발생했습니다.");
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [baseURL, size]);

  

  const clearSearch = useCallback(() => {
    setResults([])
    setQuery("")
    setError(null)
    setTotalResults(0)
    setSearchTime(0)
    setKnowledgePanel(null)
  }, [])

  return {
    results,
    knowledgePanel,
    loading,
    error,
    query,
    totalResults,
    searchTime,
    search,
    clearSearch,
    shouldShowPagination // 이거 추가!
  }
}