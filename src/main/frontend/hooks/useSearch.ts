"use client"

import { useState, useCallback } from "react"
import type { SearchResult, SearchFilters } from "@/types"

// 더미 검색 결과 데이터
const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "공공데이터포털 - 정부 3.0 공공데이터 개방",
    description:
      "정부에서 제공하는 다양한 공공데이터 API 정보를 제공합니다. 중앙부처 및 지방자치단체에서 보유하고 있는 다양한 데이터를 국민들이 활용할 수 있도록 개방하는 대한민국 공공데이터 통합 제공 시스템입니다.",
    url: "https://www.data.go.kr",
    source: "data.go.kr",
    keywords: ["API", "공공데이터", "정부", "오픈데이터", "통계"],
    category: "정부",
    lastUpdated: "2024-01-15",
    dataFormat: "JSON, XML",
    swaggerUrl: "https://www.data.go.kr/swagger-ui.html",
    apiEndpoint: "https://apis.data.go.kr",
    license: "공공누리 제1유형",
    downloadCount: 15234,
    rating: 4.5,
  },
  {
    id: "2",
    title: "서울 교통정보 시스템(TOPIS) - 실시간 교통정보 API",
    description:
      "서울시 내 실시간 교통 상황 및 도로 정보를 제공하는 RESTful API입니다. 도로별 평균속도, 혼잡도, 소통상황 등의 정보를 실시간으로 확인할 수 있습니다.",
    url: "http://topis.seoul.go.kr",
    source: "topis.seoul.go.kr",
    keywords: ["교통", "실시간", "서울시", "도로", "TOPIS", "API"],
    category: "교통",
    lastUpdated: "2024-01-14",
    dataFormat: "JSON",
    swaggerUrl: "http://topis.seoul.go.kr/api/swagger-ui.html",
    apiEndpoint: "http://topis.seoul.go.kr/api",
    license: "CC BY",
    downloadCount: 48567,
    rating: 4.2,
  },
  {
    id: "3",
    title: "기상청 날씨누리 - 기상예보 및 관측자료 API",
    description:
      "전국 지역별 날씨 예보 및 기상 관측 데이터를 제공하는 공식 API입니다. 동네예보, 중기예보, 특보 정보와 전국 관측소의 실시간 관측자료를 제공합니다.",
    url: "https://www.weather.go.kr",
    source: "kma.go.kr",
    keywords: ["날씨", "기상", "예보", "관측", "기상청", "API"],
    category: "기상",
    lastUpdated: "2024-01-13",
    dataFormat: "XML, JSON",
    swaggerUrl: "https://apis.data.go.kr/1360000/swagger-ui.html",
    apiEndpoint: "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0",
    license: "공공누리 제1유형",
    downloadCount: 32890,
    rating: 4.7,
  },
  {
    id: "4",
    title: "국가통계포털(KOSIS) - 통계 데이터 API",
    description:
      "대한민국 인구 통계 및 인구 변화 추이 데이터를 제공하는 API입니다. 통계청에서 제공하는 국가승인통계, 국제통계, 북한통계 등 다양한 통계정보를 제공합니다.",
    url: "https://kosis.kr",
    source: "kosis.kr",
    keywords: ["인구", "통계", "인구조사", "인구변화", "KOSIS", "API"],
    category: "통계",
    lastUpdated: "2024-01-12",
    dataFormat: "CSV, JSON",
    swaggerUrl: "https://kosis.kr/openapi/swagger-ui.html",
    apiEndpoint: "https://kosis.kr/openapi",
    license: "공공누리 제1유형",
    downloadCount: 12890,
    rating: 4.3,
  },
  {
    id: "5",
    title: "한국관광공사 Tour API - 관광정보 서비스",
    description:
      "전국 관광지, 숙박, 음식점 등 관광 관련 정보를 제공하는 RESTful API입니다. 관광지, 문화시설, 축제공연행사, 여행코스, 레포츠, 숙박, 쇼핑, 음식점 정보를 제공합니다.",
    url: "https://visitkorea.or.kr",
    source: "visitkorea.or.kr",
    keywords: ["관광", "여행", "관광지", "숙박", "음식점", "API"],
    category: "관광",
    lastUpdated: "2024-01-11",
    dataFormat: "JSON, XML",
    swaggerUrl: "https://apis.data.go.kr/B551011/swagger-ui.html",
    apiEndpoint: "http://apis.data.go.kr/B551011/KorService1",
    license: "공공누리 제1유형",
    downloadCount: 25670,
    rating: 4.1,
  },
]

export const useSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({})
  const [totalResults, setTotalResults] = useState(0)
  const [searchTime, setSearchTime] = useState(0)

  const search = useCallback(async (searchQuery: string, searchFilters?: SearchFilters) => {
    if (!searchQuery.trim()) {
      setResults([])
      setQuery("")
      return
    }

    setLoading(true)
    setError(null)
    setQuery(searchQuery)
    setFilters(searchFilters || {})

    try {
      const startTime = Date.now()

      // 실제로는 Elasticsearch API 호출
      await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))

      let filteredResults = mockSearchResults

      // 검색어 필터링
      if (searchQuery.trim()) {
        filteredResults = mockSearchResults.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase())),
        )
      }

      // 추가 필터 적용
      if (searchFilters?.category) {
        filteredResults = filteredResults.filter((item) => item.category === searchFilters.category)
      }

      if (searchFilters?.format) {
        filteredResults = filteredResults.filter((item) =>
          item.dataFormat.toLowerCase().includes(searchFilters.format!.toLowerCase()),
        )
      }

      // 정렬
      if (searchFilters?.sortBy === "date") {
        filteredResults.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      } else if (searchFilters?.sortBy === "popularity") {
        filteredResults.sort((a, b) => b.downloadCount - a.downloadCount)
      }

      const endTime = Date.now()
      setSearchTime((endTime - startTime) / 1000)
      setResults(filteredResults)
      setTotalResults(filteredResults.length)
    } catch (err) {
      setError("검색 중 오류가 발생했습니다.")
      setResults([])
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
