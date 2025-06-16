"use client"

import type React from "react"
import { ExternalLink, Download, Star, Calendar, Database, Tag } from "lucide-react"
import type { SearchResult } from "@/types"

interface SearchResultCardProps {
  result: SearchResult
  onDetailClick: (result: SearchResult) => void
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ result, onDetailClick }) => {
  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(result.url, "_blank", "noopener,noreferrer")
  }

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => onDetailClick(result)}
    >
      <div className="p-6">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-600 group-hover:text-blue-800 transition-colors line-clamp-2">
              {result.title}
            </h3>
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
          <button
            onClick={handleExternalLink}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="외부 링크로 이동"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>

        {/* 설명 */}
        <p className="text-gray-600 mb-4 line-clamp-3">{result.description}</p>

        {/* 키워드 태그 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {result.keywords.slice(0, 5).map((keyword, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              <Tag className="w-3 h-3" />
              {keyword}
            </span>
          ))}
          {result.keywords.length > 5 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
              +{result.keywords.length - 5}개 더
            </span>
          )}
        </div>

        {/* 하단 정보 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">{result.category}</span>
            <span>{result.dataFormat}</span>
            <span>{result.license}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Download className="w-4 h-4" />
            <span>{result.downloadCount.toLocaleString()}회</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResultCard
