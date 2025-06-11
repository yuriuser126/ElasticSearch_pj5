"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { Search, X, Mic, Camera } from "lucide-react"
import { useRouter } from "next/navigation"

interface GoogleStyleSearchProps {
  onSearch?: (query: string) => void
  initialQuery?: string
  showSuggestions?: boolean
  className?: string
}

const suggestions = [
  "공공데이터 API",
  "서울시 교통정보",
  "기상청 날씨 데이터",
  "인구 통계 데이터",
  "관광지 정보 API",
  "빅데이터 분석",
  "오픈데이터 포털",
  "정부 3.0 데이터",
]

const GoogleStyleSearch: React.FC<GoogleStyleSearchProps> = ({
  onSearch,
  initialQuery = "",
  showSuggestions = true,
  className = "",
}) => {
  const [query, setQuery] = useState(initialQuery)
  const [showSuggestionList, setShowSuggestionList] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (query.trim() && showSuggestions) {
      const filtered = suggestions.filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()))
      setFilteredSuggestions(filtered)
      setShowSuggestionList(filtered.length > 0)
    } else {
      setShowSuggestionList(false)
      setFilteredSuggestions([])
    }
    setSelectedSuggestion(-1)
  }, [query, showSuggestions])

  const handleSubmit = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) return

      setShowSuggestionList(false)

      if (onSearch) {
        onSearch(searchQuery)
      } else {
        // 검색 결과 페이지로 이동
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      }
    },
    [onSearch, router],
  )

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const searchQuery = selectedSuggestion >= 0 ? filteredSuggestions[selectedSuggestion] : query
      handleSubmit(searchQuery)
    },
    [query, selectedSuggestion, filteredSuggestions, handleSubmit],
  )

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setQuery(suggestion)
      handleSubmit(suggestion)
    },
    [handleSubmit],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestionList) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedSuggestion((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case "Escape":
          setShowSuggestionList(false)
          setSelectedSuggestion(-1)
          break
      }
    },
    [showSuggestionList, filteredSuggestions.length],
  )

  const handleClear = useCallback(() => {
    setQuery("")
    setShowSuggestionList(false)
    inputRef.current?.focus()
  }, [])

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleFormSubmit} className="relative">
        <div className="relative flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md focus-within:shadow-md transition-shadow duration-200">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && setShowSuggestionList(filteredSuggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestionList(false), 150)}
            placeholder="오픈 데이터를 검색하세요"
            className="w-full pl-12 pr-20 py-3 text-base bg-transparent border-none outline-none"
            autoComplete="off"
          />

          <div className="absolute right-3 flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="음성 검색">
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="이미지로 검색"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 검색 제안 */}
        {showSuggestionList && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 ${
                  index === selectedSuggestion ? "bg-gray-50" : ""
                }`}
              >
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-900">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* 검색 버튼들 (홈페이지에서만 표시) */}
      {!onSearch && (
        <div className="flex justify-center gap-3 mt-8">
          <button
            type="button"
            onClick={() => handleSubmit(query)}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded border border-gray-100 hover:shadow-sm hover:border-gray-300 transition-all duration-200 text-sm"
          >
            데이터 검색
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("인기 데이터")}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded border border-gray-100 hover:shadow-sm hover:border-gray-300 transition-all duration-200 text-sm"
          >
            인기 데이터
          </button>
        </div>
      )}
    </div>
  )
}

export default GoogleStyleSearch
