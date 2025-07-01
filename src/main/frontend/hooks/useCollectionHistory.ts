"use client"

import { useState, useEffect } from "react"
import type { CollectionHistory } from "@/types"

const mockHistoryData: CollectionHistory[] = [
  {
    id: "1",
    datasetName: "공공데이터포털 API 목록11122",
    collectedAt: "2024-01-15 14:30:25",
    status: "success",
    recordCount: 15234,
    fileSize: "2.3MB",
    format: "JSON",
    source: "data.go.kr",
  },
  {
    id: "2",
    datasetName: "서울시 실시간 교통정보",
    collectedAt: "2024-01-15 14:25:10",
    status: "success",
    recordCount: 48567,
    fileSize: "5.1MB",
    format: "JSON",
    source: "topis.seoul.go.kr",
  },
  {
    id: "3",
    datasetName: "기상청 날씨 예보 데이터",
    collectedAt: "2024-01-15 14:20:45",
    status: "failed",
    recordCount: 0,
    fileSize: "0MB",
    format: "XML",
    source: "kma.go.kr",
    error: "API 인증 오류",
  },
  {
    id: "4",
    datasetName: "국가통계포털 인구 데이터",
    collectedAt: "2024-01-15 14:15:30",
    status: "success",
    recordCount: 12890,
    fileSize: "1.8MB",
    format: "CSV",
    source: "kosis.kr",
  },
  {
    id: "5",
    datasetName: "한국관광공사 관광지 정보",
    collectedAt: "2024-01-15 14:10:15",
    status: "in_progress",
    recordCount: 0,
    fileSize: "0MB",
    format: "JSON",
    source: "visitkorea.or.kr",
  },
]



export const useCollectionHistory = () => {
  const [history, setHistory] = useState<CollectionHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = async () => {
    setLoading(true)
    setError(null)

    try {
      // 사용자 정보 요청
      const userRes = await fetch("http://localhost:8485/user/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (!userRes.ok) {
        alert("로그인이 필요합니다.");
        return;
      }
      const user = await userRes.json();

      const res = await fetch("http://localhost:8485/api/favorite", {
        method: "GET",
        credentials: "include", // 인증 필요시
        headers: { "Content-Type": "application/json" }

      });
      const data = await res.json();
      setHistory(data);

      // 실제로는 React Query를 사용해 API 호출
      // await new Promise((resolve) => setTimeout(resolve, 500))
      // setHistory(mockHistoryData)
    } catch (err) {
      setError("수집 이력을 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return {
    history,
    loading,
    error,
    refetch: fetchHistory,
  }
}
