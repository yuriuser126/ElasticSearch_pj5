"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, ExternalLink, Download, Calendar, Tag, Globe, Star, Code, FileText, Shield } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Navigation from "@/components/ui/Navigation"
import ErrorBoundary from "@/components/ErrorBoundary"
import type { SearchResult } from "@/types"

// 더미 상세 데이터 (기존과 동일하지만 새로운 타입 적용)
const mockDetailData: Record<
  string,
  SearchResult & {
    fields: Array<{ name: string; type: string; description: string }>
  }
> = {
  "1": {
    id: "1",
    title: "공공데이터포털 API 목록",
    description:
      "정부에서 제공하는 다양한 공공데이터 API 정보를 제공합니다. 이 데이터셋은 중앙부처 및 지방자치단체에서 개방한 다양한 분야의 공공데이터 API 목록과 상세 정보를 포함하고 있습니다.",
    snippet:
      "중앙부처 및 지방자치단체에서 보유하고 있는 다양한 데이터를 국민들이 활용할 수 있도록 개방하는 대한민국 공공데이터 통합 제공 시스템입니다.",
    url: "https://www.data.go.kr",
    source: "data.go.kr",
    keywords: ["API", "공공데이터", "정부", "오픈데이터"],
    category: "정부",
    lastUpdated: "2024-01-15",
    dataFormat: "JSON, XML",
    rating: 4.5,
    downloadCount: 15234,
    license: "공공누리 제1유형",
    apiEndpoint: "https://www.data.go.kr/api/15000581/openapi.do",
    fields: [
      { name: "API_ID", type: "String", description: "API 고유 식별자" },
      { name: "API_NAME", type: "String", description: "API 명칭" },
      { name: "PROVIDER", type: "String", description: "제공기관" },
      { name: "CATEGORY", type: "String", description: "분야 구분" },
      { name: "UPDATE_DATE", type: "Date", description: "최종 수정일" },
    ],
  },
  "2": {
    id: "2",
    title: "서울시 실시간 교통정보",
    description: "서울시 내 실시간 교통 상황 및 도로 정보를 제공하는 데이터셋입니다.",
    snippet: "서울시 교통정보센터 (TOPIS)에서 제공하는 실시간 교통 정보 데이터입니다.",
    url: "http://topis.seoul.go.kr",
    source: "topis.seoul.go.kr",
    keywords: ["교통", "실시간", "서울시", "도로"],
    category: "교통",
    lastUpdated: "2024-01-14",
    dataFormat: "JSON",
    rating: 4.2,
    downloadCount: 48567,
    license: "CC BY",
    apiEndpoint: "http://topis.seoul.go.kr/api/traffic",
    fields: [
      { name: "ROAD_NAME", type: "String", description: "도로명" },
      { name: "TRAFFIC_SPEED", type: "Number", description: "평균 속도" },
      { name: "CONGESTION_LEVEL", type: "String", description: "혼잡도" },
    ],
  },
}

const DetailPage: React.FC = () => {
  const params = useParams()
  const id = params.id as string
  const [data, setData] = useState<
    (SearchResult & { fields: Array<{ name: string; type: string; description: string }> }) | null
  >(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const detailData = mockDetailData[id]
        setData(detailData || null)
      } catch (error) {
        console.error("데이터 로딩 오류:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleExternalLink = () => {
    if (data?.url) {
      window.open(data.url, "_blank", "noopener,noreferrer")
    }
  }

  if (loading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">데이터를 불러오는 중...</p>
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  if (!data) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">데이터를 찾을 수 없습니다</h2>
              <p className="text-gray-600 mb-4">요청하신 데이터가 존재하지 않습니다.</p>
              <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* 네비게이션 */}
        <Navigation />

        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* 뒤로가기 버튼 */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              검색으로 돌아가기
            </Link>
          </div>

          {/* 제목 및 기본 정보 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.title}</h1>
                <p className="text-gray-600 text-base leading-relaxed">{data.description}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={handleExternalLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  사이트 방문
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  다운로드
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {data.keywords.map((keyword, index) => (
                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {keyword}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">출처:</span>
                <span className="font-medium">{data.source}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">업데이트:</span>
                <span className="font-medium">{data.lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">카테고리:</span>
                <span className="font-medium">{data.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-600">평점:</span>
                <span className="font-medium">{data.rating}/5.0</span>
              </div>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* 데이터 정보 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                데이터 정보
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">라이선스:</span>
                  <span className="font-medium">{data.license}</span>
                </div>
                <div className="border-t border-gray-100"></div>
                <div className="flex justify-between">
                  <span className="text-gray-600">데이터 형식:</span>
                  <span className="font-medium">{data.dataFormat}</span>
                </div>
                <div className="border-t border-gray-100"></div>
                <div className="flex justify-between">
                  <span className="text-gray-600">다운로드 수:</span>
                  <span className="font-medium">{data.downloadCount.toLocaleString()}회</span>
                </div>
              </div>
            </div>

            {/* 데이터 필드 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                데이터 필드
              </h2>
              <div className="space-y-3">
                {data.fields?.map((field, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{field.name}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{field.type}</span>
                    </div>
                    <p className="text-sm text-gray-600">{field.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* API 정보 */}
          {data.apiEndpoint && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                API 정보
              </h2>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <div className="mb-2 text-sm text-gray-400">API 엔드포인트:</div>
                <code className="text-green-400 break-all">{data.apiEndpoint}</code>
              </div>
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default DetailPage
