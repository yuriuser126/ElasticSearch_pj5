"use client"

import type React from "react"
import { TrendingUp, ExternalLink, Tag, Calendar, Database } from "lucide-react"
import type { TrendKeyword } from "@/types"

// 더미 트렌드 데이터
const trendKeywords: TrendKeyword[] = [
  { keyword: "AI", count: 1250, trend: "up", percentage: 15.2 },
  { keyword: "빅데이터", count: 980, trend: "up", percentage: 8.7 },
  { keyword: "IoT", count: 750, trend: "stable", percentage: 0.5 },
  { keyword: "블록체인", count: 620, trend: "down", percentage: -3.2 },
  { keyword: "클라우드", count: 580, trend: "up", percentage: 12.1 },
]

const officialLinks = [
  { name: "공공데이터포털", url: "https://www.data.go.kr", description: "정부 공공데이터 통합 포털" },
  { name: "서울 열린데이터 광장", url: "https://data.seoul.go.kr", description: "서울시 공공데이터" },
  { name: "경기데이터드림", url: "https://data.gg.go.kr", description: "경기도 공공데이터" },
  { name: "AI Hub", url: "https://aihub.or.kr", description: "AI 학습용 데이터셋" },
]

const Sidebar: React.FC = () => {
  const getTrendIcon = (trend: TrendKeyword["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-500" />
      case "down":
        return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full" />
    }
  }

  const getTrendColor = (trend: TrendKeyword["trend"]) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      {/* 트렌드 키워드 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-blue-600" />
          트렌드 키워드
        </h3>
        <div className="space-y-3">
          {trendKeywords.map((item, index) => (
            <div key={item.keyword} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                <div>
                  <div className="font-medium text-gray-900">{item.keyword}</div>
                  <div className="text-xs text-gray-500">{item.count.toLocaleString()}건</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(item.trend)}
                <span className={`text-xs font-medium ${getTrendColor(item.trend)}`}>
                  {item.percentage > 0 ? "+" : ""}
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 공식 링크 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          공식 데이터 포털
        </h3>
        <div className="space-y-3">
          {officialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {link.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{link.description}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 최근 업데이트 */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          최근 업데이트
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-900">새로운 API 추가</div>
            <div className="text-xs text-blue-700 mt-1">기상청 실시간 날씨 API</div>
            <div className="text-xs text-blue-600 mt-2">2시간 전</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm font-medium text-green-900">데이터 업데이트</div>
            <div className="text-xs text-green-700 mt-1">교통정보 데이터 갱신</div>
            <div className="text-xs text-green-600 mt-2">4시간 전</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-sm font-medium text-orange-900">시스템 점검</div>
            <div className="text-xs text-orange-700 mt-1">1/20 02:00-04:00 예정</div>
            <div className="text-xs text-orange-600 mt-2">1일 전</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
