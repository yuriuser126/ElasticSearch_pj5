"use client"

import type React from "react"
import { X, ExternalLink, Download, Star, Calendar, Database, Tag, Code, FileText, Shield } from "lucide-react"
import type { SearchResult } from "@/types"

interface SearchResultModalProps {
  result: SearchResult | null
  isOpen: boolean
  onClose: () => void
}

const SearchResultModal: React.FC<SearchResultModalProps> = ({ result, isOpen, onClose }) => {
  if (!isOpen || !result) return null

  const handleExternalLink = () => {
    window.open(result.url, "_blank", "noopener,noreferrer")
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 line-clamp-2">{result.title}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Database className="w-4 h-4" />
                {result.source}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {result.lastUpdated}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                {result.rating}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleExternalLink}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              사이트 방문
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6">
          {/* 설명 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              데이터셋 설명
            </h3>
            <p className="text-gray-700 leading-relaxed">{result.description}</p>
          </div>

          {/* 키워드 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              키워드
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.keywords.map((keyword, index) => (
                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* 상세 정보 그리드 */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* 기본 정보 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Database className="w-4 h-4" />
                기본 정보
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">카테고리:</span>
                  <span className="font-medium">{result.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">데이터 형식:</span>
                  <span className="font-medium">{result.dataFormat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">다운로드 수:</span>
                  <span className="font-medium">{result.downloadCount.toLocaleString()}회</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">평점:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {result.rating}/5.0
                  </span>
                </div>
              </div>
            </div>

            {/* 라이선스 정보 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                라이선스 정보
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">라이선스:</span>
                  <span className="font-medium">{result.license}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">상업적 이용:</span>
                  <span className="font-medium text-green-600">가능</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">재배포:</span>
                  <span className="font-medium text-green-600">가능</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">출처 표기:</span>
                  <span className="font-medium text-orange-600">필수</span>
                </div>
              </div>
            </div>
          </div>

          {/* API 정보 */}
          {result.apiEndpoint && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Code className="w-5 h-5" />
                API 정보
              </h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                <div className="mb-2 text-sm text-gray-400">API 엔드포인트:</div>
                <code className="text-green-400 break-all">{result.apiEndpoint}</code>
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleExternalLink}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              원본 사이트 방문
            </button>
            <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              다운로드
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResultModal
