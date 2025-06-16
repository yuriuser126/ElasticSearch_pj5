"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { login } from "@/lib/api/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import useAuthStore from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Card, CardContent } from "@/components/ui/card"
import { Search, FileText, Clock, Database, Mail, Loader2, ArrowRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Loader2, ArrowRight, Sparkles, Heart, Music, BookOpen } from "lucide-react"



export default function UserLoginPage() {
  const [userId, setUserId] = useState("")
  const [userPw, setUserPw] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const authLoading = useAuthStore((state) => state.loading)
  const loginSuccess = useAuthStore((state) => state.loginSuccess)

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.replace("/") // 로그인 상태라면 홈으로 리다이렉트
    }
  }, [isLoggedIn, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const userData = await login({ userId, userPw })
      loginSuccess(userData)
      router.push("/")
    } catch (err: any) {
      console.error("로그인 에러:", err)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else if (err.message) {
        setError(err.message)
      } else {
        setError("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
      }
    } finally {
      setLoading(false)
    }
  }

  // if (authLoading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex justify-center items-center">
  //       <Card className="w-full max-w-md mx-4 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
  //         <CardContent className="flex flex-col items-center justify-center p-8">
  //           <Loader2 className="h-8 w-8 animate-spin text-violet-600 mb-4" />
  //           <p className="text-lg text-gray-600 font-medium">로그인 상태 확인 중...</p>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  if (isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">OpenData API Search</h1>
                <p className="text-sm text-gray-600">기술 키워드 기반 오픈 데이터 API 검색 플랫폼</p>
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="#" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                <Search className="w-4 h-4" />
                <span>검색</span>
              </Link>
              <Link href="#" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                <FileText className="w-4 h-4" />
                <span>API 문서</span>
              </Link>
              <Link href="#" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                <Clock className="w-4 h-4" />
                <span>수집 이력</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pt-16 pb-12 px-4">
        {/* Login Form */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">로그인</h2>
        </div>

        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-sm font-medium text-gray-700">
                  아이디
                </Label>
                <Input
                  id="userId"
                  name="userId"
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="h-12 border-gray-200 focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 bg-white/50"
                  placeholder="아이디를 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userPw" className="text-sm font-medium text-gray-700">
                  비밀번호
                </Label>
                <Input
                  id="userPw"
                  name="userPw"
                  type="password"
                  required
                  value={userPw}
                  onChange={(e) => setUserPw(e.target.value)}
                  className="h-12 border-gray-200 focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 bg-white/50"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>

                 {error && (
                <Alert className="border-red-200 bg-red-50/80 animate-shake">
                  <AlertDescription className="text-red-600 font-medium">{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    로그인 상태 유지
                  </label>
                </div>
                <Link href="#" className="text-sm text-blue-600 hover:text-blue-500">
                  비밀번호 찾기
                </Link>
              </div>

               <Button
                type="submit"
               className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    로그인 중...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    로그인
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>



              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">또는</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-gray-300 hover:bg-gray-50 flex items-center justify-center space-x-2"
                  onClick={() => window.location.href = "http://localhost:8485/oauth2/authorization/google"}
                  >

                  <Mail className="w-5 h-5 text-red-500" />
                  <span>Google로 로그인</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-gray-300 hover:bg-gray-50 flex items-center justify-center space-x-2"
                  onClick={() => window.location.href = "http://localhost:8485/oauth2/authorization/naver"}
                >
                  <div className="w-5 h-5 bg-green-500 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">N</span>
                  </div>
                  <span>네이버로 로그인</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-gray-300 hover:bg-gray-50 flex items-center justify-center space-x-2"
                   onClick={() => window.location.href = "http://localhost:8485/oauth2/authorization/kakao"}
                >
                  <div className="w-5 h-5 bg-yellow-400 rounded-sm flex items-center justify-center">
                    <span className="text-black text-xs font-bold">K</span>
                  </div>
                  <span>카카오로 로그인</span>
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  계정이 없으신가요?{" "}
                  <Link href="/user/join" className="text-blue-600 hover:text-blue-500 font-medium">
                    회원가입
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            © 2024 OpenData API Search. 기술 키워드 기반 오픈 데이터 검색 플랫폼
          </div>
        </div>
      </footer>
    </div>
  )
}

