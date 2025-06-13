"use client"

import type React from "react"
import { useState } from "react"
import { Filter } from "lucide-react"
import type { SearchFilters as SearchFiltersType } from "@/types"

interface SearchFiltersProps {
  filters: SearchFiltersType
  onFiltersChange: (filters: SearchFiltersType) => void
  totalResults: number
  searchTime: number
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange, totalResults, searchTime }) => {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: keyof SearchFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined }
    onFiltersChange(newFilters)
  }

  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      {/* 검색 결과 정보 */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          약 <span className="font-medium">{totalResults.toLocaleString()}</span>개 결과 (
          <span className="font-medium">{searchTime.toFixed(2)}</span>초)
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Filter className="w-4 h-4" />
          필터
        </button>
      </div>

      {/* 빠른 필터 */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">카테고리:</span>
          <select
            value={filters.category || ""}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체</option>
            <option value="정부">정부</option>
            <option value="교통">교통</option>
            <option value="기상">기상</option>
            <option value="통계">통계</option>
            <option value="관광">관광</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">형식:</span>
          <select
            value={filters.format || ""}
            onChange={(e) => handleFilterChange("format", e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체</option>
            <option value="JSON">JSON</option>
            <option value="XML">XML</option>
            <option value="CSV">CSV</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">정렬:</span>
          <select
            value={filters.sortBy || "relevance"}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="relevance">관련도순</option>
            <option value="date">최신순</option>
            <option value="popularity">인기순</option>
          </select>
        </div>
      </div>

      {/* 고급 필터 */}
      {showAdvanced && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">고급 필터</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">시작 날짜</label>
              <input
                type="date"
                value={filters.dateRange?.start || ""}
                onChange={(e) =>
                  handleFilterChange("dateRange", {
                    ...filters.dateRange,
                    start: e.target.value,
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">종료 날짜</label>
              <input
                type="date"
                value={filters.dateRange?.end || ""}
                onChange={(e) =>
                  handleFilterChange("dateRange", {
                    ...filters.dateRange,
                    end: e.target.value,
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchFilters
