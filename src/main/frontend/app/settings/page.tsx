"use client"

import type React from "react"
import { useState } from "react"
import { Save, Bell, Shield, Database, Globe } from "lucide-react"
import Navigation from "@/components/ui/Navigation"
import ErrorBoundary from "@/components/ErrorBoundary"

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    apiKey: "",
    autoCollect: true,
    notifications: true,
    dataRetention: "30",
    language: "ko",
    theme: "light",
  })

  const handleSave = () => {
    // 실제로는 API 호출
    alert("설정이 저장되었습니다.")
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* 네비게이션 */}
        <Navigation />

        {/* 헤더 */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">설정</h1>
            <p className="text-gray-600">시스템 설정을 관리하고 개인화 옵션을 조정할 수 있습니다</p>
          </div>
        </header>

        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6">
              {/* API 설정 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  API 설정
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API 키</label>
                    <input
                      type="password"
                      value={settings.apiKey}
                      onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                      placeholder="API 키를 입력하세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">외부 API 연동을 위한 인증 키입니다.</p>
                  </div>
                </div>
              </div>

              {/* 수집 설정 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  수집 설정
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">자동 수집 활성화</label>
                      <p className="text-xs text-gray-500">정기적으로 데이터를 자동 수집합니다.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoCollect}
                      onChange={(e) => setSettings({ ...settings, autoCollect: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">데이터 보관 기간 (일)</label>
                    <select
                      value={settings.dataRetention}
                      onChange={(e) => setSettings({ ...settings, dataRetention: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="7">7일</option>
                      <option value="30">30일</option>
                      <option value="90">90일</option>
                      <option value="365">1년</option>
                      <option value="-1">무제한</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 알림 설정 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  알림 설정
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">알림 활성화</label>
                      <p className="text-xs text-gray-500">수집 완료 시 알림을 받습니다.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 일반 설정 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  일반 설정
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">언어</label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ko">한국어</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">테마</label>
                    <select
                      value={settings.theme}
                      onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">라이트</option>
                      <option value="dark">다크</option>
                      <option value="auto">시스템 설정</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 저장 버튼 */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  설정 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default SettingsPage
