"use client"


import Link from "next/link"
import { useRouter, usePathname } from 'next/navigation';
import { Database, SearchIcon, Code, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import useAuthStore from "@/store/authStore";
import { useState } from "react";


 const Header = () => {
    
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const loading = useAuthStore((state) => state.loading);
    const logoutUser = useAuthStore((state) => state.logoutUser);
    const router = useRouter();
     const pathname = usePathname();

    const [searchValue, setSearchValue] = useState("");
    // const [currentView, setCurrentView] = useState<"default" | "history">("default")

    const handleLogout = async () => {
      await logoutUser();
      router.push('/user/login');
    };



  return (
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
             {/* <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
               */}
              <div
                  onClick={() => {
                    router.push("/")             // 홈으로 이동
                    setTimeout(() => {
                      window.location.reload()  // 상태 초기화를 위해 새로고침
                    }, 50)
                  }}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                >
              <div className="p-2 bg-blue-600 rounded-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">OpenData API Search</h1>
                <p className="text-sm text-gray-600">기술 키워드 기반 오픈 데이터 API 검색 플랫폼</p>
              </div>
            </div>

            {/* 오른쪽 영역 - 가로 정렬 수정 */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  로그아웃
                </button>
              ) : (
                <
                 Link href="/user/login"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  로그인
                </Link>
              )}

              <Button asChild variant="ghost" size="sm" className="flex items-center gap-2">
                <Link href="/history">
                  <History className="h-4 w-4" />
                  수집 이력
                </Link>
              </Button>


            {/* <Button
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
            </Button> */}
            </div>
          </div>
        </div>
      </header>
   );
  };



export default Header;
