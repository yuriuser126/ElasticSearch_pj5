"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Database, SearchIcon, Code, TrendingUp } from "lucide-react"
import SearchBar from "@/components/SearchBar"
import SearchResultCard from "@/components/SearchResultCard"
import SwaggerModal from "@/components/SwaggerModal"
// import PingTest from "@/components/PingTest";
import { useSearch } from "@/hooks/useSearch"
import { Button } from "@/components/ui/button"
import type { SearchResult } from "@/types"
import { History } from "lucide-react";


import useAuthStore from '@/store/authStore'; // Zustand 스토어 임포트
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaginationComponent from '@/components/PaginationComponent'; // PaginationComponent 임포트!


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const RESULTS_PER_PAGE = 10; // 한 페이지당 보여줄 결과 수 (이 값은 백엔드와 일치해야 합니다)

// async function pingServer() {
//   try {
//     const res = await fetch(`${apiUrl}/ping`);
//     const text = await res.text();
//     console.log('서버 응답:', text);
//   } catch (error) {
//     console.error('서버 연결 실패:', error);
//   }
// }


// export default function HomePage() {
  // ① 뷰 상태 선언



const HomePage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // searchParams 훅 사용

  // URL에서 초기 검색어와 페이지 추출
  const initialQuery = searchParams.get('q') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  // useSearch 훅으로부터 필요한 값들을 가져옵니다.
  // useSearch 훅이 query와 page를 인자로 받아 내부적으로 데이터 페칭을 수행한다고 가정합니다.
  const { results, loading, error, query, totalResults, searchTime, search } = useSearch(initialQuery);

  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [showSwaggerModal, setShowSwaggerModal] = useState(false)

  const currentPage = initialPage; // URL의 page 파라미터를 현재 페이지로 사용

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const logoutUser = useAuthStore((state) => state.logoutUser);

  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);


  React.useEffect(() => {
    checkAuthStatus(); // 앱이 마운트될 때 로그인 상태 확인
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.push('/user/login');
  };

  const handleSwaggerClick = (result: SearchResult) => {
    setSelectedResult(result)
    setShowSwaggerModal(true)
  }

  const popularKeywords = ["python", "hackernews", "stackoverflow", "react","java"]
  // const [results, setResults] = useState<HackerNewsItem[]>([]);

 // 총 페이지 수 계산
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((page: number) => {
    console.log("📄 페이지 변경 요청:", page, "범위:", `1-${totalPages}`);
  const [currentView, setCurrentView] = useState<"search"|"history">("search")


    if (page >= 1 && page <= totalPages && page !== currentPage) {
      console.log("✅ 페이지 변경 승인:", page);
      // URL 업데이트만 하고, useSearch 훅이 URL 변경을 감지하여 다시 검색하도록 합니다.
      const newUrl = `${pathname}?q=${encodeURIComponent(query)}&page=${page}`;
      router.push(newUrl); // push 대신 replace를 사용할 수도 있습니다. (뒤로가기 스택 관리 방식에 따라 선택)
    } else {
      console.log("❌ 페이지 변경 거부:", {
        page,
        valid: page >= 1 && page <= totalPages,
        different: page !== currentPage
      });
    }
  }, [currentPage, totalPages, query, pathname, router]);


  return (

    <div className="min-h-screen bg-gray-50">
    <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* {!query && <PingTest />} */}
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
                {results.map((result, index) => (
                  <SearchResultCard
                    key={`${result.source ?? 'unknown'}-${result.id ?? index}`}
                    result={result}
                    onSwaggerClick={handleSwaggerClick}
                  />
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

             {/* 검색 결과가 있거나, 총 결과가 0보다 클 때만 페이지네이션을 표시하는 조건 */}
            {query && !loading && !error && totalPages > 1 && (
              <div className="mt-8 flex justify-center flex-col items-center"> {/* 중앙 정렬을 위해 flex justify-center 추가 */}
                <div className="text-center mb-4 text-sm text-gray-600">
                  페이지 {currentPage} / {totalPages} (총 {totalResults.toLocaleString()}개 결과)
                </div>

                <PaginationComponent
                  currentPage={currentPage}
                  maxPage={totalPages} // MAX_PAGE 대신 계산된 totalPages 사용
                  onPageChange={handlePageChange}
                />
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

      <Footer />
    </div>
  )
}

export default HomePage
