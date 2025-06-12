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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowRight, Sparkles, Heart, Music, BookOpen } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden">
    {/* <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 relative overflow-hidden">  */}
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container max-w-md mx-auto py-8 px-4 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
            </div>
            {/* <div className="relative bg-gradient-to-br from-violet-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <Train className="w-10 h-10 text-white" />
            </div> */}
          </div>

          <div className="space-y-2 mb-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              MoodSync
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Heart className="w-4 h-4 text-pink-500" />
              <Music className="w-4 h-4 text-blue-500" />
              <BookOpen className="w-4 h-4 text-green-500" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">환영합니다!</h2>
            <p className="text-gray-600 leading-relaxed">
              감정 기반 맞춤 추천 서비스로
              <br />
              당신만의 특별한 경험을 시작하세요
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm animate-slide-up">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-500" />
              로그인
            </CardTitle>
            <CardDescription className="text-gray-600">계정 정보를 입력해주세요</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-sm font-semibold text-gray-700">
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
                <Label htmlFor="userPw" className="text-sm font-semibold text-gray-700">
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

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <Card className="mt-6 shadow-lg border-0 bg-white/60 backdrop-blur-sm animate-slide-up delay-200">
          <CardContent className="text-center p-6">
            <p className="text-gray-600 mb-4 font-medium">MoodSync 회원이 아니신가요?</p>
            <Link
              href="/user/join"
              className="inline-flex items-center gap-2 text-violet-600 font-semibold hover:text-violet-700 transition-all duration-200 hover:gap-3 group"
            >
              회원가입하기
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </CardContent>
        </Card>

        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-3 gap-4 animate-fade-in delay-300">
          <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl">
            <Heart className="w-6 h-6 text-pink-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">감정 분석</p>
          </div>
          <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl">
            <Music className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">음악 추천</p>
          </div>
          <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl">
            <BookOpen className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">도서 추천</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  )
}
