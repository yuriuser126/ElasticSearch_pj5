"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  Download,
  Eye,
  Trash2,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
} from "lucide-react"
import Navigation from "@/components/ui/Navigation"
import ErrorBoundary from "@/components/ErrorBoundary"
import { useCollectionHistory } from "@/hooks/useCollectionHistory"
import type { CollectionHistory } from "@/types"

const HistoryPage: React.FC = () => {
  const { history, loading, error, refetch } = useCollectionHistory()
  const [filter, setFilter] = useState<"all" | "success" | "failed" | "in_progress">("all")
  const [sortBy, setSortBy] = useState<"date" | "name" | "status">("date")

  const filteredHistory = history
    .filter((item) => filter === "all" || item.status === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime()
        case "name":
          return a.datasetName.localeCompare(b.datasetName)
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

  const getStatusIcon = (status: CollectionHistory["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "in_progress":
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusText = (status: CollectionHistory["status"]) => {
    switch (status) {
      case "success":
        return "성공"
      case "failed":
        return "실패"
      case "in_progress":
        return "진행중"
    }
  }

  const getStatusBadgeClass = (status: CollectionHistory["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const stats = {
    total: history.length,
    success: history.filter((item) => item.status === "success").length,
    failed: history.filter((item) => item.status === "failed").length,
    inProgress: history.filter((item) => item.status === "in_progress").length,
    totalRecords: history.reduce((sum, item) => sum + item.recordCount, 0),
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">데이터 로딩 오류</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              다시 시도
            </button>
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

        {/* 헤더 */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  홈으로
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">수집 이력</h1>
                  <p className="text-gray-600">데이터 수집 작업의 이력을 확인하고 관리할 수 있습니다</p>
                </div>
              </div>
              <button
                onClick={refetch}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                새로고침
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">전체</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-3xl font-bold text-green-600">{stats.success}</div>
              <div className="text-sm text-gray-600">성공</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-3xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-gray-600">실패</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">진행중</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-3xl font-bold text-blue-600">{stats.totalRecords.toLocaleString()}</div>
              <div className="text-sm text-gray-600">총 레코드</div>
            </div>
          </div>

          {/* 필터 및 정렬 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">필터:</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">전체</option>
                    <option value="success">성공</option>
                    <option value="failed">실패</option>
                    <option value="in_progress">진행중</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">정렬:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">날짜순</option>
                    <option value="name">이름순</option>
                    <option value="status">상태순</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-gray-600">{filteredHistory.length}개 항목</div>
            </div>
          </div>

          {/* 로딩 표시 */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">로딩 중...</span>
            </div>
          )}

          {/* 이력 테이블 */}
          {!loading && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        데이터셋
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        수집 시간
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        레코드 수
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        파일 크기
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        액션
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.datasetName}</div>
                            <div className="text-sm text-gray-500">{item.source}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(item.status)}`}
                          >
                            {getStatusIcon(item.status)}
                            {getStatusText(item.status)}
                          </span>
                          {item.error && <div className="text-xs text-red-600 mt-1">{item.error}</div>}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {item.collectedAt}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.recordCount.toLocaleString()}건</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.fileSize}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="상세 보기"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {item.status === "success" && (
                              <button
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                title="다운로드"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="삭제">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredHistory.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">수집 이력이 없습니다</h3>
                  <p className="text-gray-500">데이터 수집을 시작하면 이곳에 이력이 표시됩니다</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default HistoryPage
