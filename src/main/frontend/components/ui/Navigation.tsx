"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, History, Database, Settings } from "lucide-react"
import useAuthStore from "@/store/authStore"
import { useRouter } from "next/navigation"

const Navigation: React.FC = () => {
  const pathname = usePathname()
  const { isLoggedIn,  logoutUser, checkAuthStatus } = useAuthStore()
  const router = useRouter()

  // 예시용 로그인 상태 (추후 실제 인증 로직으로 대체)
// const [isLoggedIn, setIsLoggedIn] = useState(false)
const [isReady, setIsReady] = useState(false)

React.useEffect(() => {
    checkAuthStatus() // ✅ 페이지 진입 시 상태 확인
    setIsReady(true)
  }, [])



if (!isReady) return null 

// const handleLogout = () => {
//   localStorage.removeItem("token")
//   setIsLoggedIn(false)
//   // redirect or toast if needed
// }

  // const handleLogout = () => {
  //   // 실제 로그아웃 처리
  //   setIsLoggedIn(false)
  //   alert("로그아웃되었습니다.")
  // }

    const handleLogout = async () => {
    await logoutUser();
    router.push('/user/login');
  };

  const navItems = [
    { href: "/", label: "검색", icon: Search },
    { href: "/history", label: "수집 이력", icon: History },
    { href: "/manage", label: "데이터 관리", icon: Database },
    { href: "/settings", label: "설정", icon: Settings },
  ]

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* 왼쪽: 로고 + 메뉴 */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              OpenData Search
            </Link>
            <div className="flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* 오른쪽: 로그인/로그아웃 버튼 */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer"
              >
                로그아웃
              </button>
            ) : (
              <Link
                href="/user/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation