"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, History, Database, Settings } from "lucide-react"

const Navigation: React.FC = () => {
  const pathname = usePathname()

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
                      isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
