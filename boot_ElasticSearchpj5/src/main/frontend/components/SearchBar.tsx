"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Search, X, Filter } from "lucide-react"
import type { SearchFilters } from "@/types"

interface SearchBarProps {
  onSearch: (query: string, filters?: SearchFilters) => void
  loading?: boolean
  className?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading = false, className = "" }) => {
  const [query, setQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({})

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onSearch(query, filters)
    },
    [query, filters, onSearch],
  )

  const handleClear = useCallback(() => {
    setQuery("")
    setFilters({})
    onSearch("", {})
  }, [onSearch])

  const handleFilterChange = useCallback(
    (key: keyof SearchFilters, value: any) => {
      const newFilters = { ...filters, [key]: value }
      setFilters(newFilters)
    },
    [filters],
  )

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* 메인 검색창 */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="기술 키워드로 오픈 데이터 API를 검색하세요... (예: 교통, 날씨, 인구)"
            className="w-full pl-12 pr-24 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 focus:outline-none shadow-lg transition-all duration-200"
            disabled={loading}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "검색중..." : "검색"}
            </button>
          </div>
        </div>
      </form>

      {/* 필터 옵션 */}
      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
              <select
                value={filters.category || ""}
                onChange={(e) => handleFilterChange("category", e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="정부">정부</option>
                <option value="교통">교통</option>
                <option value="기상">기상</option>
                <option value="통계">통계</option>
                <option value="관광">관광</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">데이터 형식</label>
              <select
                value={filters.format || ""}
                onChange={(e) => handleFilterChange("format", e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="JSON">JSON</option>
                <option value="XML">XML</option>
                <option value="CSV">CSV</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">정렬</label>
              <select
                value={filters.sortBy || "relevance"}
                onChange={(e) => handleFilterChange("sortBy", e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">관련도순</option>
                <option value="date">최신순</option>
                <option value="popularity">인기순</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
