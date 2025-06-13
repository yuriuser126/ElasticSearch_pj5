"use client"
import { Search, Database, History, Settings, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    icon: Search,
    label: "데이터 검색",
    href: "/",
  },
  {
    icon: History,
    label: "수집 이력",
    href: "/history",
  },
  {
    icon: Database,
    label: "데이터 관리",
    href: "/manage",
  },
  {
    icon: Settings,
    label: "설정",
    href: "/settings",
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* 로고/제목 */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">오픈데이터 검색</h1>
        <p className="text-sm text-gray-500 mt-1">기술 키워드 기반 플랫폼</p>
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 하단 정보 */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>버전 1.0.0</p>
          <p>프로토타입</p>
        </div>
      </div>
    </div>
  )
}
