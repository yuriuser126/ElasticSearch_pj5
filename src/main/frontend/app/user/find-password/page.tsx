"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PasswordRecovery() {
  const [step, setStep] = useState(1)
  const [userId, setUserId] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [authMethod, setAuthMethod] = useState("email")
  const [verificationCode, setVerificationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // 인증번호 발송 처리
  const handleSendVerification = async () => {
    if (!userId) {
      setError("아이디를 입력해주세요.")
      return
    }

    if (authMethod === "email" && !email) {
      setError("이메일을 입력해주세요.")
      return
    }

    if (authMethod === "phone" && !phone) {
      setError("휴대폰 번호를 입력해주세요.")
      return
    }

    setLoading(true)
    setError("")

    try {
      // 실제 구현에서는 API 호출로 대체
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess(
        authMethod === "email" ? `${email}로 인증번호가 발송되었습니다.` : `${phone}로 인증번호가 발송되었습니다.`,
      )
      setStep(2)
    } catch (err) {
      setError("인증번호 발송에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setError("인증번호를 입력해주세요.")
      return
    }

    setLoading(true)
    setError("")

    try {
      // 실제 구현에서는 API 호출로 대체
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 테스트용 인증번호: 123456
      if (verificationCode === "123456") {
        setVerified(true)
        setSuccess("인증이 완료되었습니다.")
        setStep(3)
      } else {
        setError("인증번호가 일치하지 않습니다.")
      }
    } catch (err) {
      setError("인증에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  // 비밀번호 재설정
  const handleResetPassword = async () => {
    if (!newPassword) {
      setError("새 비밀번호를 입력해주세요.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    setLoading(true)
    setError("")

    try {
      // 실제 구현에서는 API 호출로 대체
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess("비밀번호가 성공적으로 변경되었습니다.")
      setStep(4)
    } catch (err) {
      setError("비밀번호 변경에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">비밀번호 찾기</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userId">아이디</Label>
                <Input
                  id="userId"
                  placeholder="아이디를 입력하세요"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>인증 방법 선택</Label>
                <Tabs value={authMethod} onValueChange={setAuthMethod} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email">이메일</TabsTrigger>
                    <TabsTrigger value="phone">휴대폰</TabsTrigger>
                  </TabsList>
                  <TabsContent value="email" className="mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">이메일</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="이메일을 입력하세요"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="phone" className="mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">휴대폰 번호</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="휴대폰 번호를 입력하세요"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleSendVerification}
                disabled={loading}
              >
                인증번호 받기 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="text-center text-sm">
                <Link href="/login" className="text-blue-600 hover:underline">
                  로그인 페이지로 돌아가기
                </Link>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-700">{success}</AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="verificationCode">인증번호</Label>
                <Input
                  id="verificationCode"
                  placeholder="인증번호 6자리를 입력하세요"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <p className="text-xs text-gray-500">테스트용 인증번호: 123456</p>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleVerifyCode} disabled={loading}>
                인증 확인 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="새 비밀번호를 입력하세요"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleResetPassword} disabled={loading}>
                비밀번호 변경 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>

              <div className="text-center text-sm">
                <Link href="/login" className="text-blue-600 hover:underline">
                  로그인 페이지로 돌아가기
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
