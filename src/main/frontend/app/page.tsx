"use client"

import React from "react"
import { useState } from "react"
import { Database, SearchIcon, Code, TrendingUp } from "lucide-react"
import SearchBar from "@/components/SearchBar"
import SearchResultCard from "@/components/SearchResultCard"
import SwaggerModal from "@/components/SwaggerModal"
import PingTest from "@/components/PingTest";
import { useSearch } from "@/hooks/useSearch"
import { Button } from "@/components/ui/button"
import type { SearchResult } from "@/types"
import { History } from "lucide-react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function pingServer() {
  try {
    const res = await fetch(`${apiUrl}/ping`);
    const text = await res.text();
    console.log('서버 응답:', text);
  } catch (error) {
    console.error('서버 연결 실패:', error);
  }
}

const HomePage: React.FC = () => {
  const { results, loading, error, query, totalResults, searchTime, search } = useSearch()
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [showSwaggerModal, setShowSwaggerModal] = useState(false)

  const handleSwaggerClick = (result: SearchResult) => {
    setSelectedResult(result)
    setShowSwaggerModal(true)
  }

  const popularKeywords = ["교통", "날씨", "인구", "관광", "공공데이터", "API"]

  const [currentView, setCurrentView] = useState<"default" | "history">("default")
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">OpenData API Search</h1>
                <p className="text-sm text-gray-600">기술 키워드 기반 오픈 데이터 API 검색 플랫폼</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <SearchIcon className="w-4 h-4" />
                <span>검색</span>
              </div>
              <div className="flex items-center gap-1">
                <Code className="w-4 h-4" />
                <span>API 문서</span>
              </div>
              
               
                <Button
                    variant={currentView === "history" ? "default" : "ghost"}
                    onClick={() => setCurrentView("history")}
                    className="flex items-center gap-2"
                  >
                    <History className="h-4 w-4" />
                    수집 이력
                  </Button>

                  
              
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!query && <PingTest />}
        {/* 검색 영역 */}
        <div className="text-center mb-12">
          {!query && (
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">오픈 데이터 API를 쉽게 찾아보세요</h2>
              <p className="text-lg text-gray-600 mb-6">
                정부, 공공기관에서 제공하는 다양한 API와 Swagger 문서를 한 곳에서 검색할 수 있습니다
              </p>
            </div>
          )}

          <SearchBar onSearch={search} loading={loading} />

          {/* 인기 키워드 */}
          {!query && (
            <div className="mt-8">
              <p className="text-sm text-gray-600 mb-3">인기 검색어:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularKeywords.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => search(keyword)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 검색 결과 */}
        {query && (
          <div className="mb-8">
            {/* 검색 결과 정보 */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                "<span className="font-medium text-gray-900">{query}</span>"에 대한 검색 결과{" "}
                {!loading && (
                  <>
                    약 <span className="font-medium">{totalResults.toLocaleString()}</span>개 (
                    <span className="font-medium">{searchTime.toFixed(2)}</span>초)
                  </>
                )}
              </div>
              {results.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>API 문서 포함</span>
                </div>
              )}
            </div>

            {/* 로딩 표시 */}
            {loading && (
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 에러 표시 */}
            {error && (
              <div className="text-center py-12">
                <Database className="w-16 h-16 text-red-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">검색 중 오류가 발생했습니다</h3>
                <p className="text-gray-500">{error}</p>
              </div>
            )}

            {/* 검색 결과 목록 */}
            {!loading && !error && results.length > 0 && (
              <div className="space-y-6">
                {results.map((result) => (
                  <SearchResultCard key={result.id} result={result} onSwaggerClick={handleSwaggerClick} />
                ))}
              </div>
            )}

            {/* 검색 결과 없음 */}
            {!loading && !error && results.length === 0 && (
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-500 mb-6">다른 키워드로 검색해보시거나 철자를 확인해보세요</p>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>검색 제안:</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {popularKeywords.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => search(suggestion)}
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
        )}

        {/* 서비스 소개 (검색 전에만 표시) */}
        {!query && (
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">통합 검색</h3>
              <p className="text-gray-600">
                정부, 공공기관의 다양한 오픈 데이터 API를 키워드로 쉽게 검색할 수 있습니다
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">API 문서</h3>
              <p className="text-gray-600">각 API의 Swagger 문서를 바로 확인하고 사용법을 쉽게 파악할 수 있습니다</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">실시간 정보</h3>
              <p className="text-gray-600">최신 업데이트된 API 정보와 사용 통계를 실시간으로 제공합니다</p>
            </div>
          </div>
        )}
      </main>

      {/* Swagger 모달 */}
      <SwaggerModal result={selectedResult} isOpen={showSwaggerModal} onClose={() => setShowSwaggerModal(false)} />

      {/* 푸터 */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 OpenData API Search. 기술 키워드 기반 오픈 데이터 검색 플랫폼</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
