"use client"


import Link from "next/link"
import { useRouter, usePathname } from 'next/navigation';
import { Database, SearchIcon, Code, History } from "lucide-react"
import { Button } from "@/components/ui/button"

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* 로고 영역 */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">OpenData API Search</h1>
                <p className="text-sm text-gray-600">기술 키워드 기반 오픈 데이터 API 검색 플랫폼</p>
              </div>
            </div>
          </Link>

          {/* 버튼 그룹 */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <Button
              variant={pathname === '/' ? 'default' : 'ghost'}
              onClick={() => router.push('/')}
              className="flex items-center gap-1"
            >
              <SearchIcon className="w-4 h-4" />
              검색
            </Button>

            <Button
              variant="ghost"
              className="flex items-center gap-1"
              onClick={() => {
                // API 문서 이동이나 모달 함수 추가
              }}
            >
              <Code className="w-4 h-4" />
              API 문서
            </Button>

            <Button
              variant={pathname === '/history' ? 'default' : 'ghost'}
              onClick={() => router.push('/history')}
              className="flex items-center gap-1"
            >
              <History className="w-4 h-4" />
              수집 이력
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
