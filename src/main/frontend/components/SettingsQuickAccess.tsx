// components/SettingsQuickAccess.tsx
'use client'; // 클라이언트 컴포넌트 선언 (Next.js 13+ App Router)

import { useState } from 'react';
import { Settings } from 'lucide-react'; // 설정 아이콘

// Props 타입 정의: 부모로부터 현재 설정 상태와 설정 변경 함수를 전달받음
type Props = {
  settings: {
    theme: string;     // 현재 테마(light/dark/auto)
    language: string;  // 현재 언어(ko/en)
  };
  setSettings: (settings: any) => void; // 설정 변경 함수
};

// 설정 빠른 접근 컴포넌트 정의
export default function SettingsQuickAccess({ settings, setSettings }: Props) {
  const [open, setOpen] = useState(false); // 설정창 열림/닫힘 상태

  return (
    // 화면 좌측 하단에 고정된 버튼
    <div className="fixed bottom-4 left-4 z-50">
      {/* 설정 열기/닫기 버튼 (동그란 회색 버튼) */}
      <button
        onClick={() => setOpen(!open)} // 클릭 시 open 상태 토글
        className="w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition"
      >
        <Settings className="w-5 h-5" /> {/* 설정 아이콘 */}
      </button>

      {/* 설정 패널 (언어/테마 선택), open 상태일 때만 표시 */}
      {open && (
        <div className="mt-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md w-64">
          {/* 언어 설정 */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">언어</label>
            <select
              value={settings.language} // 현재 선택된 언어
              onChange={(e) => setSettings({ ...settings, language: e.target.value })} // 변경 시 부모로 전달
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* 테마 설정 */}
          <div>
            <label className="block text-sm font-medium mb-1">테마</label>
            <select
              value={settings.theme} // 현재 선택된 테마
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })} // 변경 시 부모로 전달
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
            >
              <option value="light">라이트</option>
              <option value="dark">다크</option>
              <option value="auto">시스템 설정</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
