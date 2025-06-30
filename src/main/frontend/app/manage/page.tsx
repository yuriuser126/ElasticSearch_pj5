"use client"

import type React from "react"
import { useState } from "react"
import { Database, BarChart, Monitor, FileText, ChevronDown, ChevronRight } from "lucide-react"
import Navigation from "@/components/ui/Navigation"
import ErrorBoundary from "@/components/ErrorBoundary"
import { RefreshCw } from "lucide-react"


const ManagePage: React.FC = () => {

  const [apiOpen, setApiOpen] = useState(false)

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
                    서버 및 API 상태 점검
                  </h2>
                  {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />새 소스 추가
                  </button> */}
                </div>
                <p className="text-gray-600 mb-6">서버 및 데이터베이스 상태와 API 연결 상태를 실시간으로 확인합니다.</p>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">ㅇㅇ 서버</div>
                      <div className="text-sm text-gray-500">data.go.kr - 정부 공공데이터</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">활성</span>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <RefreshCw className="w-4 h-4" />
                        {/* 새로고침 아이콘 */}
                        {/* <Settings className="w-4 h-4" /> */}

                      </button>
                    </div>
                  </div>

                  {/* API 연결 상태 (토글) */}
                  <div className="border-t border-gray-200 pt-4">
                    <button
                      onClick={() => setApiOpen(!apiOpen)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <span className="text-md font-medium text-gray-800 flex items-center gap-2">
                        {apiOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        API 연결 상태
                      </span>
                      <span className="text-sm text-gray-500">{apiOpen ? "접기" : "펼치기"}</span>
                    </button>

                    {apiOpen && (
                      <div className="mt-4 grid gap-4">
                        {[
                          { name: "StackOverflow API", desc: "stackoverflow.com API 연결 상태" },
                          { name: "Reddit API", desc: "reddit.com API 연결 상태" },
                          { name: "HackerNews API", desc: "hackernews API 연결 상태" },
                          { name: "Google Trend API", desc: "google trends API 연결 상태" },
                        ].map((api) => (
                          <div key={api.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium">{api.name}</div>
                              <div className="text-sm text-gray-500">{api.desc}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">활성</span>
                              <button className="p-2 text-gray-400 hover:text-gray-600">
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>


                  {/* API 연결 상태 */}
                  {/*
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">stackoverflow API</div>
                      <div className="text-sm text-gray-500">data.go.kr API 연결 상태</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">활성</span>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  */}


                </div>
              </div>
              

                  {/* 수집 스케줄 관리 */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">수집 스케줄 관리</h2>
                    <p className="text-gray-600 mb-6">자동 수집 스케줄을 설정하고 관리합니다.</p>
                    <div className="text-center py-8">
                      <p className="text-gray-500">스케줄 관리 기능은 개발중</p>
                    </div>
                  </div>

                  {/* 데이터 수집 현황 및 관리 */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">데이터 수집 현황 및 관리</h2>

                    <p className="text-gray-600 mb-6">
                      전체 수집 로그를 확인하고, 성공/실패 내역을 필터링할 수 있습니다.
                      <br />
                      실패 로그는 상세 원인을 확인할 수 있는 게시글 형태 페이지로 이동합니다.
                    </p>

                    <div className="flex gap-4">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                        {/* <Download className="w-4 h-4" /> */}
                        <FileText className="w-4 h-4" />
                        전체 수집 로그
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        {/* <Upload className="w-4 h-4" /> */}
                        <Monitor className="w-4 h-4" />
                        전체 사이트 로그
                      </button>
                      {/* <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    소스별 수집 통계
                  </button> */}
                      <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2">
                        <BarChart className="w-4 h-4" />
                        소스별 수집 통계
                      </button>
                    </div>
                    <br />
                    <div className="text-sm text-gray-500 flex justify-end gap-2 italic">
                      <span>실행 주체:</span>
                      <span className="font-medium">시스템 자동수집</span> | <span className="font-medium">관리자(DDD) 수동 실행</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/* </div>
      </div> */}
    </ErrorBoundary>
  )
}

export default ManagePage
