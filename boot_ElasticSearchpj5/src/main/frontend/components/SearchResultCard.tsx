"use client"

import type React from "react"
import { ExternalLink, Download, Star, Calendar, Database, Tag, FileText, Code } from "lucide-react"
import type { SearchResult } from "@/types"
import { HackerNewsItem } from "@/types"; // `@/types/index.ts`는 index라 생략 가능

interface SearchResultCardProps {
  result: SearchResult
  onSwaggerClick: (result: SearchResult) => void
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ result, onSwaggerClick }) => {
  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(result.url, "_blank", "noopener,noreferrer")
  }

  const handleSwaggerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSwaggerClick(result)
  }

  // 키워드 배열 준비
  const keywords = (Array.isArray(result.tags) ? result.tags : result.title?.split(" ") || [])
  .filter(keyword => typeof keyword === "string" && keyword.trim() !== "");

  // 디버깅용 출력
  console.log("keywords for tags:", keywords);

    type Props = {
    result: HackerNewsItem;
    onSwaggerClick: () => void;
    };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 p-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors line-clamp-2 mb-2">
            {result.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-500">
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
      </div>

      {/* 설명 */}
      <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">{result.description}</p>

      {/* 키워드 태그 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(Array.isArray(result.tags) ? result.tags : result.title?.split(" ") || [])
        
          .filter(keyword => typeof keyword === "string" && keyword.trim() !== "")  // 빈값 및 undefined 제거
          .slice(0, 5)
          .map((keyword, index) => (
            <span
              key={`${keyword}-${index}`}   // 키워드는 keyword + index로 고유 키
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium"
            >
              <Tag className="w-3 h-3" />
              {keyword}
            </span>
          ))
        }
      </div>


        {/* 5개 초과 키워드 처리 */}
        {(Array.isArray(result.tags) ? result.tags : result.title?.split(" ") || []).length > 5 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">
            +{(Array.isArray(result.tags) ? result.tags : result.title?.split(" ") || []).length - 5}개 더
          </span>
        )}
      

      {/* API 정보 */}
      {result.apiEndpoint && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">API 엔드포인트</span>
          </div>
          <code className="text-sm text-gray-800 bg-white px-2 py-1 rounded border break-all">
            {result.apiEndpoint}
          </code>
        </div>
      )}

      {/* 하단 정보 및 액션 버튼 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">{result.category}</span>
          <span>{result.dataFormat}</span>
          <span>{result.license}</span>
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            {/* {result.downloadCount.toLocaleString()}회 */}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Swagger 문서 버튼 */}
          {result.swaggerUrl && (
            <button
              onClick={handleSwaggerClick}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              API 문서
            </button>
          )}

          {/* 외부 링크 버튼 */}
          <button
            onClick={handleExternalLink}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            사이트 방문
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchResultCard
