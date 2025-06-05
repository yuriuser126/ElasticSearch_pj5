import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OpenData API Search - 기술 키워드 기반 오픈 데이터 검색",
  description: "정부, 공공기관에서 제공하는 다양한 오픈 데이터 API와 Swagger 문서를 쉽게 검색할 수 있는 플랫폼",
  keywords: ["오픈데이터", "공공데이터", "API", "Swagger", "검색", "기술키워드"],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
