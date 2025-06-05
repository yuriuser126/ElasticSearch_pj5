"use client"

import type React from "react"
import { ExternalLink, Star, Calendar, Database } from "lucide-react"
import type { SearchResult } from "@/types"

interface SearchResultItemProps {
  result: SearchResult
  query: string
  onDetailClick?: (result: SearchResult) => void
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ result, query, onDetailClick }) => {
  const handleExternalClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(result.url, "_blank", "noopener,noreferrer")
  }

  const handleDetailClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onDetailClick) {
      onDetailClick(result)
    }
  }

  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text

    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 font-medium">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <div className="mb-8 max-w-2xl">
      {/* URL 표시 */}
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Database className="w-4 h-4" />
          <span>{result.source}</span>
        </div>
        <button
          onClick={handleExternalClick}
          className="text-gray-400 hover:text-blue-600 transition-colors"
          title="새 탭에서 열기"
        >
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* 제목 */}
      <h3 className="mb-1">
        <button
          onClick={handleDetailClick}
          className="text-xl text-blue-600 hover:text-blue-800 hover:underline transition-colors text-left"
        >
          {highlightText(result.title, query)}
        </button>
      </h3>

      {/* 메타 정보 */}
      <div className="flex items-center gap-4 mb-2 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {result.lastUpdated}
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500" />
          {result.rating}
        </span>
        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{result.category}</span>
      </div>

      {/* 설명 */}
      <p className="text-gray-700 leading-relaxed mb-2">{highlightText(result.snippet, query)}</p>

      {/* 키워드 태그 */}
      <div className="flex flex-wrap gap-1">
        {result.keywords.slice(0, 4).map((keyword, index) => (
          <span
            key={index}
            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200 transition-colors cursor-pointer"
          >
            {keyword}
          </span>
        ))}
        {result.keywords.length > 4 && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
            +{result.keywords.length - 4}개 더
          </span>
        )}
      </div>

      {/* 추가 정보 */}
      <div className="mt-2 text-sm text-gray-500">
        <span>다운로드 {result.downloadCount.toLocaleString()}회</span>
        <span className="mx-2">•</span>
        <span>{result.dataFormat}</span>
        <span className="mx-2">•</span>
        <span>{result.license}</span>
      </div>
    </div>
  )
}

export default SearchResultItem
