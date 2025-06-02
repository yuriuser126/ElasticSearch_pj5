"use client"

import type React from "react"
import { Database, Plus, Settings, Upload, Download, Trash2 } from "lucide-react"
import Navigation from "@/components/ui/Navigation"
import ErrorBoundary from "@/components/ErrorBoundary"

const ManagePage: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* 네비게이션 */}
        <Navigation />

        {/* 헤더 */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">데이터 관리</h1>
            <p className="text-gray-600">수집된 데이터를 관리하고 새로운 데이터 소스를 설정할 수 있습니다</p>
          </div>
        </header>

        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-6">
              {/* 데이터 소스 관리 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    데이터 소스 관리
                  </h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />새 소스 추가
                  </button>
                </div>
                <p className="text-gray-600 mb-6">새로운 데이터 소스를 추가하거나 기존 소스를 관리합니다.</p>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">공공데이터포털</div>
                      <div className="text-sm text-gray-500">data.go.kr - 정부 공공데이터</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">활성</span>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 수집 스케줄 관리 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">수집 스케줄 관리</h2>
                <p className="text-gray-600 mb-6">자동 수집 스케줄을 설정하고 관리합니다.</p>
                <div className="text-center py-8">
                  <p className="text-gray-500">스케줄 관리 기능은 개발 중입니다.</p>
                </div>
              </div>

              {/* 데이터 내보내기/가져오기 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">데이터 내보내기/가져오기</h2>
                <p className="text-gray-600 mb-6">수집된 데이터를 내보내거나 외부 데이터를 가져올 수 있습니다.</p>

                <div className="flex gap-4">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    데이터 내보내기
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    데이터 가져오기
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    전체 삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default ManagePage
