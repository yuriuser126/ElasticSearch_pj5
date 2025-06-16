"use client"

import type React from "react"
import { useEffect, useState, Suspense, lazy, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Database } from "lucide-react"
import GoogleStyleSearch from "@/components/ui/GoogleStyleSearch"
import SearchFilters from "@/components/ui/SearchFilters"
import SearchResultItem from "@/components/ui/SearchResultItem"
import Navigation from "@/components/ui/Navigation"
import ErrorBoundary from "@/components/ErrorBoundary"
import { useSearch } from "@/hooks/useSearch"

import type { SearchResult } from "@/types"
import PaginationComponent from '@/components/PaginationComponent'



const KnowledgePanel = lazy(() => import("@/components/ui/KnowledgePanel"))
const SearchResultModal = lazy(() => import("@/components/ui/SearchResultModal"))
const Sidebar = lazy(() => import("@/components/layout/Sidebar"))


const SearchPage: React.FC = () => {
  console.log("🛠️ SearchPage 렌더링")
  const shouldShowPagination = true;
  
  const searchParams = useSearchParams()
  const router = useRouter()

  const query = searchParams.get("q") || ""
  const pageParam = searchParams.get("page")
  const initialPage = pageParam ? parseInt(pageParam, 10) : 1

  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(isNaN(initialPage) ? 1 : initialPage)
  const [appliedFilters, setAppliedFilters] = useState<any>({})
  
  // const { results, knowledgePanel, loading, error, totalResults, searchTime, search, shouldShowPagination } = useSearch(query);
  const { results, knowledgePanel, loading, error, totalResults, searchTime, search } = useSearch(query);

  const resultsPerPage = 10 // 프론트에서도 동일하게 10으로 지정
  const MAX_PAGE = totalResults && totalResults > 0 ? Math.ceil(totalResults / resultsPerPage) : 1

    // 페이지네이션 표시 조건
  // const shouldShowPagination = !loading && !error && results.length > 0 && totalResults > resultsPerPage;

  // 🔥 통합된 검색 실행 함수
  const executeSearch = useCallback(
    (searchQuery: string, page: number = 1, filters: any = {}) => {
      if (!searchQuery.trim()) return;
      
      console.log("🚀 executeSearch 호출:", { searchQuery, page, filters })
      
      const searchParams = { 
        page, 
        size: resultsPerPage,
        ...filters
      }
      
      search(searchQuery, searchParams)
    },
    [search, resultsPerPage]
  )

  // URL 파라미터 변경 감지
  useEffect(() => {
    const pageParam = searchParams.get("page")
    const pageNum = pageParam ? parseInt(pageParam, 10) : 1
    const validPageNum = isNaN(pageNum) ? 1 : Math.max(1, pageNum)
    
    if (validPageNum !== currentPage) {
      console.log("📄 페이지 상태 동기화:", currentPage, "→", validPageNum)
      setCurrentPage(validPageNum)
    }
  }, [searchParams])

  // 🔥 쿼리나 페이지 변경 시 검색 실행 - 단순화
  useEffect(() => {
    if (query) {
      console.log("🔍 검색 트리거:", { query, currentPage })
      executeSearch(query, currentPage, appliedFilters)
    }
  }, [query, currentPage, executeSearch]) // appliedFilters는 의존성에서 제외

  // 디버그 로그
  useEffect(() => {
    console.log("📊 상태 업데이트:", {
      결과개수: results.length,
      전체결과: totalResults,
      현재페이지: currentPage,
      최대페이지: MAX_PAGE
    })
  }, [results.length, totalResults, currentPage, MAX_PAGE])

  useEffect(() => {
  console.log("SearchPage useEffect 호출됨 - currentPage:", currentPage)
  }, [currentPage])


  // 필터 변경 핸들러
  const handleFiltersChange = useCallback((newFilters: any) => {
    console.log("🔧 필터 변경:", newFilters)
    setAppliedFilters(newFilters)
    setCurrentPage(1)
    
    const url = `/search?q=${encodeURIComponent(query)}&page=1`
    router.replace(url)
    
    // 즉시 검색 실행
    executeSearch(query, 1, newFilters)
  }, [query, router, executeSearch])

  const handleSearch = useCallback((newQuery: string) => {
    if (newQuery !== query) {
      setCurrentPage(1)
      setAppliedFilters({})
      const url = `/search?q=${encodeURIComponent(newQuery)}&page=1`
      router.push(url)
    }
  }, [query, router])

  const handleDetailClick = useCallback((result: SearchResult) => {
    setSelectedResult(result)
    setShowModal(true)
  }, [])

  // 🔥 페이지 변경 핸들러 - 간소화
  const handlePageChange = useCallback((page: number) => {
    console.log("📄 페이지 변경 요청:", page, "범위:", `1-${MAX_PAGE}`)
    
    if (page >= 1 && page <= MAX_PAGE && page !== currentPage) {
      console.log("✅ 페이지 변경 승인:", page)
      
      // URL 즉시 업데이트 (검색은 useEffect에서 처리)
      const url = `/search?q=${encodeURIComponent(query)}&page=${page}`
      router.replace(url)
    } else {
      console.log("❌ 페이지 변경 거부:", { 
        page, 
        valid: page >= 1 && page <= MAX_PAGE, 
        different: page !== currentPage 
      })
    }
  }, [currentPage, MAX_PAGE, query, router])

  



  console.log('🔍 페이지네이션 상태:', {
    loading,
    error: !!error,
    resultsLength: results.length,
    totalResults,
    resultsPerPage,
    // shouldShow: shouldShowPagination,
    maxPage: MAX_PAGE
  })

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        <div style={{ padding: 20, backgroundColor: "#e3f2fd" }}>
          🚀 SearchPage - 페이지: {currentPage}/{MAX_PAGE}, 결과: {totalResults}개
        </div>

        <Navigation />

        <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-8">
              <div className="flex-1 max-w-2xl">
                <GoogleStyleSearch onSearch={handleSearch} initialQuery={query} showSuggestions={false} />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-8">
            <div className="flex-1">
              <SearchFilters
                filters={appliedFilters}
                onFiltersChange={handleFiltersChange}
                totalResults={totalResults}
                searchTime={searchTime}
              />

              {loading && (
                <div className="space-y-8">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="text-center py-16" role="alert" aria-live="assertive">
                  <Database className="w-16 h-16 text-red-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">검색 중 오류가 발생했습니다</h3>
                  <p className="text-gray-500">{error}</p>
                </div>
              )}

              {!loading && !error && results.length > 0 && (
                <div className="space-y-8">
                  {results.map((result) => (
                    <SearchResultItem
                      key={result.id}
                      result={result}
                      query={query}
                      onDetailClick={handleDetailClick}
                    />
                  ))}
                </div>
              )}

              



              {shouldShowPagination && (
                <div className="mt-8">
                  <div className="text-center mb-4 text-sm text-gray-600">
                    페이지 {currentPage} / {MAX_PAGE} (총 {totalResults.toLocaleString()}개 결과)
                  </div>
                  
                  <PaginationComponent
                    currentPage={currentPage}
                    maxPage={MAX_PAGE}
                    onPageChange={handlePageChange}
                  />
                </div>
               )}              

              {!shouldShowPagination && query && (
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
                  <h4 className="font-bold text-blue-800">🔍 페이지네이션 상태:</h4>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>loading: {loading ? '🔄 로딩 중' : '✅ 완료'}</li>
                    <li>error: {error ? `❌ ${error}` : '✅ 없음'}</li>
                    <li>results: {results.length > 0 ? `✅ ${results.length}개` : '❌ 0개'}</li>
                    <li>조건: {totalResults} {totalResults > resultsPerPage ? '>' : '<='} {resultsPerPage}</li>
                  </ul>
                </div>
               )} 

              {!loading && !error && results.length === 0 && query && (
                <div className="text-center py-16">
                  <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    "<span className="text-blue-600">{query}</span>"에 대한 검색 결과가 없습니다
                  </h3>
                  <p className="text-gray-500 mb-6">다른 키워드로 검색해보시거나 철자를 확인해보세요</p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p>검색 제안:</p>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {["공공데이터", "API", "교통정보", "날씨", "통계"].map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => handleSearch(suggestion)}
                          className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              <div className="space-y-6">
                {knowledgePanel && (
                  <Suspense fallback={<div className="w-80 h-96 bg-gray-200 rounded-lg animate-pulse"></div>}>
                    <KnowledgePanel data={knowledgePanel} />
                  </Suspense>
                )}

                <Suspense fallback={<div className="w-80 h-96 bg-gray-200 rounded-lg animate-pulse"></div>}>
                  <Sidebar />
                </Suspense>
              </div>
            </div>
          </div>
        </main>

        <Suspense fallback={null}>
          <SearchResultModal result={selectedResult} isOpen={showModal} onClose={() => setShowModal(false)} />
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default SearchPage