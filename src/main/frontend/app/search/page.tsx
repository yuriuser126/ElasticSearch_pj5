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
import type { KnowledgePanelType } from "@/types"

// 코드 스플리팅
const KnowledgePanel = lazy(() => import("@/components/ui/KnowledgePanel"))
const SearchResultModal = lazy(() => import("@/components/ui/SearchResultModal"))
const Sidebar = lazy(() => import("@/components/layout/Sidebar"))

const MAX_PAGE = 3 // 페이지네이션 최대 페이지 수

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const query = searchParams.get("q") || ""
  const pageParam = searchParams.get("page")
  const initialPage = pageParam ? parseInt(pageParam, 10) : 1

  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(isNaN(initialPage) ? 1 : initialPage)

  const { results, knowledgePanel, loading, error, filters, totalResults, searchTime, search } = useSearch()

  // 검색 실행 함수 (query, filters, page 조합)
  const doSearch = useCallback(
    (searchQuery: string, appliedFilters: any = {}, page: number = 1) => {
      search(searchQuery, { ...appliedFilters, page })
    },
    [search]
  )

  // URL의 쿼리 및 페이지 변경 시 검색 실행
  useEffect(() => {
    if (query) {
      doSearch(query, filters || {}, currentPage)
    }
  }, [query, currentPage, filters, doSearch])

  // query 또는 page가 바뀌면 URL 동기화 (router.push)
  // useEffect 의존성 주의: currentPage, query 변경 시 URL도 변경
  useEffect(() => {
    const url = `/search?q=${encodeURIComponent(query)}&page=${currentPage}`
    router.replace(url) // replace로 기록 누적 방지
  }, [query, currentPage, router])

  useEffect(() => {
  console.log("검색 결과:", results);
  }, [results]);

  useEffect(() => {
  console.log({ loading, error, results });
  }, [loading, error, results]);

  // 필터 변경 핸들러 - 기존 필터 병합 후 검색
  const handleFiltersChange = (newFilters: any) => {
    doSearch(query, { ...(filters || {}), ...newFilters }, 1)
    setCurrentPage(1) // 필터 변경 시 페이지 초기화
  }

  const handleSearch = (newQuery: string) => {
    if (newQuery !== query) {
      setCurrentPage(1)
      router.push(`/search?q=${encodeURIComponent(newQuery)}&page=1`)
    }
  }

  const handleDetailClick = (result: SearchResult) => {
    setSelectedResult(result)
    setShowModal(true)
  }

  // 페이지 변경 핸들러 - 페이지 상태만 변경하면 useEffect에서 자동으로 검색 수행
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= MAX_PAGE && page !== currentPage) {
      setCurrentPage(page)
      // URL 및 검색은 useEffect에서 동기화
    }
  }

  console.log('test')
  console.log('loading:', loading);
  console.log('error:', error);
  console.log('results.length:', results.length);
  console.log('조건 전체:', !loading && !error && results.length > 0);


  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        {/* 네비게이션 */}
        <Navigation />

        {/* 헤더 */}
        <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-8">
              {/* 검색창 */}
              <div className="flex-1 max-w-2xl">
                <GoogleStyleSearch onSearch={handleSearch} initialQuery={query} showSuggestions={false} />
              </div>
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-8">
            {/* 검색 결과 영역 */}
            <div className="flex-1">
              {/* 필터 및 결과 정보 */}
              <SearchFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                totalResults={totalResults}
                searchTime={searchTime}
              />

              {/* 로딩 표시 */}
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

              {/* 에러 표시 */}
              {error && (
                <div className="text-center py-16" role="alert" aria-live="assertive">
                  <Database className="w-16 h-16 text-red-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">검색 중 오류가 발생했습니다</h3>
                  <p className="text-gray-500">{error}</p>
                </div>
              )}

              {/* 검색 결과 */}
              {!loading && !error && results.length > 0 && (
                <>
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

                  


                  {/* 페이지네이션 */}
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center gap-2">
                      {/* 이전 버튼 */}
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-disabled={currentPage === 1}
                        aria-label="이전 페이지"
                        className={`px-3 py-2 rounded transition-colors ${
                          currentPage === 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        이전
                      </button>

                      {/* 페이지 번호 버튼 */}
                      {[...Array(MAX_PAGE)].map((_, idx) => {
                        const pageNum = idx + 1
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            aria-current={currentPage === pageNum ? "page" : undefined}
                            className={`px-3 py-2 rounded ${
                              currentPage === pageNum
                                ? "bg-blue-600 text-white"
                                : "text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}

                      {/* 다음 버튼 */}
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === MAX_PAGE}
                        aria-disabled={currentPage === MAX_PAGE}
                        aria-label="다음 페이지"
                        className={`px-3 py-2 rounded transition-colors ${
                          currentPage === MAX_PAGE
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        다음
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* 검색 결과 없음 */}
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

            {/* 사이드바 영역 */}
            <div className="hidden lg:block">
              <div className="space-y-6">
                {/* 지식 패널 */}
                {knowledgePanel && (
                  <Suspense fallback={<div className="w-80 h-96 bg-gray-200 rounded-lg animate-pulse"></div>}>
                    <KnowledgePanel data={knowledgePanel} />
                  </Suspense>
                )}

                {/* 트렌드 사이드바 */}
                <Suspense fallback={<div className="w-80 h-96 bg-gray-200 rounded-lg animate-pulse"></div>}>
                  <Sidebar />
                </Suspense>
              </div>
            </div>
          </div>
        </main>

        {/* 검색 결과 모달 */}
        <Suspense fallback={null}>
          <SearchResultModal result={selectedResult} isOpen={showModal} onClose={() => setShowModal(false)} />
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default SearchPage
