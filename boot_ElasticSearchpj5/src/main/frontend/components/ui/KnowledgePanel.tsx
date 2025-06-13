"use client"

import type React from "react"
import { ExternalLink, TrendingUp, Info } from "lucide-react"
import type { KnowledgePanel as KnowledgePanelType } from "@/types"

interface KnowledgePanelProps {
  data: KnowledgePanelType
}

const KnowledgePanel: React.FC<KnowledgePanelProps> = ({ data }) => {
  return (
    <div className="w-80 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* 제목 및 설명 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          {data.title}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">{data.description}</p>
      </div>

      {/* 통계 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">주요 통계</h3>
        <div className="grid grid-cols-2 gap-3">
          {data.statistics.map((stat, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 공식 링크 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">공식 링크</h3>
        <div className="space-y-2">
          {data.officialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
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

      {/* 관련 키워드 */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          관련 키워드
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.relatedKeywords.map((keyword, index) => (
            <button
              key={index}
              className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full hover:bg-blue-100 transition-colors"
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default KnowledgePanel
