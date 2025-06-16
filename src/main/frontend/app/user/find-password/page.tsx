"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  FileText,
  Clock,
  Database,
  Mail,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Check,
} from "lucide-react"
import { pwdCheckEmail, changePassword, checkUserIdExists } from "@/lib/api/auth"
import axios from "axios"
import Header from "@/components/Header"

interface FormData {
  userEmail: string
  userId: string
  userName: string
  userPw: string
  pwdConfirm: string
  
}

export default function PasswordRecoveryPreview() {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1)
    const [userId, setUserId] = useState("")
    const [form, setForm] = useState<FormData>({
      userEmail: "",
      userId: "",
      userName: "",
      userPw: "",
      pwdConfirm: "",
    })

 



   // 이메일 인증 상태
    const [emailVerified, setEmailVerified] = useState(false)
    const [verificationCode, setVerificationCode] = useState("")
    const [serverCode, setServerCode] = useState("")
    const [showVerificationInput, setShowVerificationInput] = useState(false)
    const [emailLocked, setEmailLocked] = useState(false)
    const [verificationLocked, setVerificationLocked] = useState(false)

     // UI 상태
      const [showPassword, setShowPassword] = useState(false)
      const [passwordChanged, setPasswordChanged] = useState(false)
      const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
      const [loading, setLoading] = useState(false)
      const [emailLoading, setEmailLoading] = useState(false)
      const [idValid, setIdValid] = useState(false);

      
  // ID 관련 상태
  const [idLocked, setIdLocked] = useState(false)
  const [idLoading, setIdLoading] = useState(false)

      // 에러 및 성공 메시지
      const [emailError, setEmailError] = useState("")
      const [emailSuccess, setEmailSuccess] = useState("")
      const [passwordMatchError, setPasswordMatchError] = useState("")
      const [error, setError] = useState("")
      const [success, setSuccess] = useState("")

     const steps = [
    { id: 1, title: "정보 입력", icon: Mail },
    // { id: 2, title: "인증 확인", icon: CheckCircle },
    { id: 2, title: "새 비밀번호 설정", icon: Lock },
    { id: 3, title: "설정완료", icon: Check },
  ]

    const progress = (activeStep / steps.length) * 100

          // 이메일 인증번호 발송
    const handleSendCode = async () => {

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailPattern.test(form.userEmail)) {
          setEmailError("올바른 이메일 주소 형식으로 입력해주세요.")
          setEmailSuccess("")
          return
        }
    
        setEmailError("")
        setEmailSuccess("인증번호 발송 중...")
        setEmailLoading(true)
    


        try {
          const response = await pwdCheckEmail(form.userEmail)
    
          // 응답 구조 디버깅
          console.log("서버 응답:", response)
    
          if (response.success) {
            // 다양한 응답 구조에 대응
            const code = response.code
            console.log("추출된 인증번호:", code)
    
            setServerCode(String(code)) // 문자열로 변환하여 저장
            setShowVerificationInput(true)
            setEmailLocked(true) // 이메일 입력 잠금
            setEmailSuccess(`인증번호가 발송되었습니다. 이메일을 확인해주세요. (테스트용: ${code})`)
          } else {
            setEmailError(response.message || "인증번호 발송에 실패했습니다.")
            setEmailSuccess("")
          }
        } catch (err: any) {
          console.error("인증번호 발송 실패:", err.response?.data || err.message)
          setEmailError(err.response?.data?.message || "인증번호 발송에 실패했습니다. 다시 시도해주세요.")
          setEmailSuccess("")
        } finally {
          setEmailLoading(false)
        }
      }

        // 입력 핸들러
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target
          setForm((prevForm) => ({ ...prevForm, [name]: value }))
      
          // 비밀번호 확인 실시간 체크
          if (name === "pwdConfirm" || name === "userPw") {
            if (name === "pwdConfirm" && value !== form.userPw) {
              setPasswordMatchError("비밀번호가 일치하지 않습니다.")
            } else if (name === "userPw" && value !== form.pwdConfirm && form.pwdConfirm !== "") {
              setPasswordMatchError("비밀번호가 일치하지 않습니다.")
            } else {
              setPasswordMatchError("")
            }
          }
        }

//아이디 확인
const handleCheckId = async () => {
  try {
    const res = await checkUserIdExists(form.userId) // 이렇게 사용
    if (res.success) {
      setIdValid(true)
      setIdLocked(true)
      setEmailError("")
    } else {
      setIdValid(false)
      setEmailError("존재하지 않는 아이디입니다.")
    }
  } catch (err) {
    console.error("아이디 확인 중 오류:", err)
    setIdValid(false)
    setEmailError("아이디 확인 중 오류 발생")
  }
}

      
  // 인증번호 확인
    const handleVerifyCode = () => {
    // 디버깅을 위한 콘솔 로그 추가
    console.log("입력한 인증번호:", verificationCode)
    console.log("서버 인증번호:", serverCode)
    console.log("타입 확인 - 입력:", typeof verificationCode, "서버:", typeof serverCode)

    // 공백 제거 및 문자열로 변환하여 비교
    const inputCode = String(verificationCode).trim()
    const serverCodeStr = String(serverCode).trim()

    console.log("정제된 비교 - 입력:", inputCode, "서버:", serverCodeStr)

    if (inputCode === serverCodeStr && inputCode !== "") {
      setEmailVerified(true)
      setVerificationLocked(true) // 인증번호 입력 잠금
      setEmailError("")
      setEmailSuccess("이메일 인증이 완료되었습니다!")
      setShowVerificationInput(false)
    } else {
      setEmailVerified(false)
      setEmailError(`인증번호가 일치하지 않습니다. (입력: ${inputCode}, 예상: ${serverCodeStr})`)
      setEmailSuccess("")
    }
  }
    
  
  // // 다음 단계로
  // const handleNext = () => {
  //   if (activeStep < steps.length) {
  //     setActiveStep(activeStep + 1)
  //   }
  // }

  // // 이전 단계로
  // const handlePrev = () => {
  //   if (activeStep > 1) {
  //     setActiveStep(activeStep - 1)
  //   }
  // }
  

  return (
     <div className="min-h-screen bg-gray-50">
    <Header />

      {/* 미리보기 탭 선택 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id as 1 | 2 | 3)}
                className={`py-4 px-4 font-medium text-sm transition-colors relative ${
                  activeStep === step.id ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {step.title}
                {activeStep === step.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-2xl mx-auto pt-8 pb-12 px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => {
              const Icon = step.icon
              const isActive = activeStep === step.id
              const isCompleted = activeStep > step.id

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      isCompleted
                        ? "bg-blue-600 text-white"
                        : isActive
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isActive ? "text-blue-600" : isCompleted ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>

          {/* 프로그레스 바 */}
          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold text-gray-800">비밀번호 찾기</CardTitle>
            <CardDescription className="text-gray-600">
              {activeStep === 1 && "아이디와 이메일을 입력하여 인증을 진행해주세요"}
              {activeStep === 2 && "새 비밀번호를 설정해주세요"}
              {activeStep === 3 && "새 비밀번호를 설정 완료"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: 정보 입력 */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId" className="text-sm font-semibold text-gray-700">
                    아이디 <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                  <div className="relative flex-1">
                  <Input
                      id="userId"
                      name="userId"
                      type="text"
                      required
                      value={form.userId}
                      // onChange={(e) => setUserId(e.target.value)}
                      onChange={handleChange}
                      className="h-12 border-gray-200 focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 bg-white/50"
                      placeholder="아이디를 입력하세요"
                       disabled={idLocked}
                    />
                    {idLocked && (
                      <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    )}
                  </div>
                   <Button
                    type="button"
                    onClick={handleCheckId}
                    disabled={idLoading || idLocked || !form.userId}
                    className="h-12 w-32 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {idLoading ? "확인 중..." : "아이디 확인"}
                  </Button>
                </div>
                   {/* <Button type="button" onClick={handleCheckId} className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white">
                    아이디 확인
                  </Button> */}
                  {/* <Input id="userId" placeholder="아이디를 입력하세요" className="h-12" required /> */}
                </div>


                <div className="space-y-2">
                  <Label htmlFor="userEmail" className="text-sm font-semibold text-gray-700">
                    이메일 주소 <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                            <Input
                                   id="userEmail"
                                   name="userEmail"
                                   type="email"
                                   value={form.userEmail}
                                   onChange={handleChange}
                                   placeholder="example@email.com"
                                   className="h-12 pr-10 border-gray-200 focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 bg-white/50"
                                  //  disabled={emailLocked}
                                   disabled={!idValid || emailLocked}
                                 />
                                 {emailLocked ? (
                                   <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                 ) : (
                                   <Unlock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                 )}
                               </div>
                               <Button
                                 type="button"
                                 onClick={handleSendCode}
                                 disabled={emailLoading || emailLocked || !form.userEmail}
                                 className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white"
                               >
                                 {emailLoading ? "발송 중..." : "인증번호 발송"}
                               </Button>
                  </div>
                </div>
        

                {showVerificationInput && !verificationLocked && (
                <div className="space-y-2">
                  <Label htmlFor="verificationCode" className="text-sm font-semibold text-gray-700">
                    인증번호
                  </Label>
                  <div className="flex gap-2">
                    <Input
                          id="verificationCode"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="인증번호 8자리 입력"
                          className="h-12"
                          maxLength={8}
                      />
                    <Button
                          type="button"
                          onClick={handleVerifyCode}
                          disabled={verificationCode.length === 0} className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                      인증 확인
                    </Button>
                  </div>
                </div>
                )}
 

 {/* {emailVerified && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-600 font-medium">
                      이메일 인증이 완료되었습니다!222
                    </AlertDescription>
                  </Alert>
                )} */}

                {emailError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-600">{emailError}</AlertDescription>
                  </Alert>
                )}

                {emailSuccess && !emailError && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertDescription className="text-blue-600">{emailSuccess}</AlertDescription>
                  </Alert>
                )}
                
              </div>
            )}



{activeStep === 2 && (
  <div className="space-y-6">
    {!passwordChanged ? (
      <>
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600 font-medium">
            인증이 완료되었습니다. 새 비밀번호를 설정해주세요.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="userPw" className="text-sm font-semibold text-gray-700">
            새 비밀번호 <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="userPw"
              name="userPw"
              type={showPassword ? "text" : "password"}
              value={form.userPw}
              onChange={handleChange}
              placeholder="영문, 숫자, 특수문자 포함 8~16자"
              className="h-12 pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pwdConfirm" className="text-sm font-semibold text-gray-700">
            비밀번호 확인 <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="pwdConfirm"
              name="pwdConfirm"
              type={showPasswordConfirm ? "text" : "password"}
              value={form.pwdConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력"
              className="h-12 pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            >
              {showPasswordConfirm ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        {passwordMatchError && (
          <p className="text-sm text-red-500">{passwordMatchError}</p>
        )}

<Button
  type="button"
  onClick={async () => {
    if (form.userPw === form.pwdConfirm && form.userPw.length >= 8) {
      try {
        const res = await changePassword(form.userId, form.userPw);
        console.log("🔐 전송된 userId:", form.userId);
        console.log("🔐 전송된 userPw:", form.userPw);
        if (res.success) {
          setPasswordChanged(true);
          setActiveStep(3); // 성공하면 다음 단계로 이동
        } else {
          alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
        }
      } catch (err: any) {
        console.error("비밀번호 변경 에러:", err);
        alert("서버 오류로 인해 비밀번호를 변경할 수 없습니다.");
      }
    } else {
      alert("비밀번호가 일치하지 않거나 형식이 잘못되었습니다.");
    }
  }}
  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
>
  비밀번호 변경
</Button>
        {/* <Button
          type="button"
          onClick={() => {
            if (form.userPw === form.pwdConfirm && form.userPw.length >= 8) {
              setPasswordChanged(true)
              setActiveStep(3) // 다음 단계로
            } else {
              alert("비밀번호가 일치하지 않거나 형식이 잘못되었습니다.")
            }
          }}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
        >
          비밀번호 변경
        </Button> */}
      </>
    ) : null}
  </div>
)}

{activeStep === 3 && (
  <div className="space-y-6">
    <Alert className="border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-600 font-medium">
        비밀번호가 성공적으로 변경되었습니다.
      </AlertDescription>
    </Alert>

    <div className="text-center">
      <Link href="/user/login">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 h-12">
          로그인 페이지로 이동
        </Button>
      </Link>
    </div>
  </div>
)}

            {/* Navigation Buttons */}
            {activeStep < 3 && (
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => activeStep > 1 && setActiveStep((prev) => (prev - 1) as 1 | 2)}
                  disabled={activeStep === 1}
                  className="h-12 px-6 border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  이전
                </Button>

             {activeStep === 1 && (
                  <Button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    disabled={!emailVerified} // 이메일 인증되지 않으면 비활성화
                    className={`h-12 px-6 ${
                      emailVerified
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    다음
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            )}


          </CardContent>
        </Card>

        {/* Login Link */}
        {activeStep < 3 && (
          <div className="text-center mt-6">
            <p className="text-gray-600">
              계정이 기억나셨나요?{" "}
              <Link href="/user/login" className="text-blue-600 font-semibold hover:text-blue-700">
                로그인하기
              </Link>
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            © 2024 OpenData API Search. 기술 키워드 기반 오픈 데이터 API 검색 플랫폼
          </div>
        </div>
      </footer>
    </div>
  )
}
