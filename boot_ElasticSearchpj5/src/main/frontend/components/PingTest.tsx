"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const PingTest: React.FC = () => {
  const [status, setStatus] = useState<"idle" | "success" | "error" | "loading">("idle")
  const [message, setMessage] = useState<string>("")

  const pingServer = async () => {
    setStatus("loading")
    try {
      const res = await fetch(`${apiUrl}/ping`)
      const text = await res.text()
      setMessage(text)
      setStatus("success")
    } catch (error) {
      setMessage("서버 연결 실패")
      setStatus("error")
    }
  }

  return (
    <div className="mb-8 text-center">
      <Button onClick={pingServer} variant="outline">
        서버 연결 테스트 (Ping)
      </Button>
      <div className="mt-4 text-sm">
        {status === "loading" && <p className="text-gray-500">서버에 연결 중...</p>}
        {status === "success" && <p className="text-green-600">✅ 응답: {message}</p>}
        {status === "error" && <p className="text-red-600">❌ {message}</p>}
      </div>
    </div>
  )
}

export default PingTest
