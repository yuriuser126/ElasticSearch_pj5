"use client"

import type React from "react"
import { useEffect, useState, Suspense, lazy } from "react"
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

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [showModal, setShowModal] = useState(false)
  


  const { results, knowledgePanel, loading, error, filters, totalResults, searchTime, search } = useSearch()

  useEffect(() => {
    if (query) {
      search(query)
    }
  }, [query, search])

  useEffect(() => {
  if (knowledgePanel) {
    console.log("📌 지식 패널 데이터:", knowledgePanel)
  }
}, [knowledgePanel])

  const handleSearch = (newQuery: string) => {
    if (newQuery !== query) {
      router.push(`/search?q=${encodeURIComponent(newQuery)}`)
    }
  }

  const handleFiltersChange = (newFilters: any) => {
    search(query, newFilters)
  }

  const handleDetailClick = (result: SearchResult) => {
    setSelectedResult(result)
    setShowModal(true)
  }

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
                <div className="text-center py-16">
                  <Database className="w-16 h-16 text-red-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">검색 중 오류가 발생했습니다</h3>
                  <p className="text-gray-500">{error}</p>
                </div>
              )}

              {/* 검색 결과 */}
              {!loading && !error && results.length > 0 && (
                <div className="space-y-8">
                  {results.map((result) => (
                    <SearchResultItem key={result.id} result={result} query={query} onDetailClick={handleDetailClick} />
                  ))}

                  {/* 페이지네이션 */}
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        이전
                      </button>
                      <button className="px-3 py-2 bg-blue-600 text-white rounded">1</button>
                      <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">2</button>
                      <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">3</button>
                      <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        다음
                      </button>
                    </div>
                  </div>
                </div>
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
