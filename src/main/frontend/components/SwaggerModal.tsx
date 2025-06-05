"use client"

import type React from "react"
import { useEffect, useState } from "react" 
import { X, ExternalLink, Code, FileText, Globe } from "lucide-react"
import type { SearchResult } from "@/types"

interface SwaggerModalProps {
  result: SearchResult | null
  isOpen: boolean
  onClose: () => void
}


const SwaggerModal: React.FC<SwaggerModalProps> = ({ result, isOpen, onClose }) => {
  // 상태: API 메서드 리스트
  const [apiMethods, setApiMethods] = useState<any[]>([])
  // 상태: 로딩 여부
  const [loading, setLoading] = useState(false)
  // 상태: 에러 메시지
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
  // Swagger API 문서 데이터를 비동기로 가져오는 함수
  const fetchSwaggerData = async () => {
    // swaggerUrl이 없으면 함수 종료
   if (!result?.swaggerUrl || !isOpen) return; // :흰색_확인_표시: 여기서 조건

    // 로딩 시작, 에러 초기화
    setLoading(true)
    setError(null)

    try {
      // swaggerUrl로부터 JSON 데이터 fetch
      const res = await fetch(result.swaggerUrl)
      result.swaggerUrl = "http://localhost:8485/v3/api-docs"
      // result.swaggerUrl = "http://13.209.74.214:8080/v3/api-docs"

      // HTTP 응답 상태가 OK가 아니면 에러 발생시키기
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

      const data = await res.json()
      const paths = data.paths

      const methods = []

      // paths 객체 안의 각 경로(path)와 HTTP 메서드(method)를 순회
      for (const path in paths) {
        for (const method in paths[path]) {
          const info = paths[path][method]
          methods.push({
            method: method.toUpperCase(),       // GET, POST 등 대문자 변환
            path,                                // API 경로
            summary: info.summary || "",         // 요약 정보 없으면 빈 문자열
            description: info.description || "", // 설명 정보 없으면 빈 문자열
          })
        }
      }

      // 상태에 API 메서드 목록 저장
      setApiMethods(methods)
    } catch (error) {
      // 에러 발생 시 에러 메시지 상태에 저장 및 apiMethods 초기화
      setError("API 문서 로드 실패")
      setApiMethods([])
      console.error("Swagger JSON fetch error:", error)
    } finally {
      // 로딩 종료
      setLoading(false);
    }
  };
   fetchSwaggerData(); // :흰색_확인_표시: 항상 호출되지만 내부에서 조건 체크함
}, [isOpen, result?.swaggerUrl]);


  /** 여기가 CORS 중계구조 장치.
   * 프록시 서버를 통해 외부 API 호출 예시 함수
   * - 실제 호출 시 외부 URL을 encodeURIComponent로 인코딩하여 전달
   * - 에러 처리 포함
   * - 이 함수는 UI 버튼에 연결하여 테스트 가능
   */
  const fetchDataViaProxy = async () => {
    try {
      const externalApiUrl = 'https://apis.data.go.kr/B551011/your-api-path?serviceKey=YOUR_SERVICE_KEY&param=value'

      // 프록시 서버에 외부 URL을 쿼리파라미터로 넘김 (URL 인코딩 필수)
      const proxyUrl = '/api/proxy/external?url=' + encodeURIComponent(externalApiUrl)

      const response = await fetch(proxyUrl)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()
      console.log('프록시 서버를 통해 받은 데이터:', data)
      alert("프록시 호출 성공, 콘솔 확인하세요.")
    } catch (err) {
      console.error('프록시 호출 에러:', err)
      alert("프록시 호출 실패")
    }
  }


  if (!isOpen || !result || !result.swaggerUrl) return null

  // Swagger UI 새 창으로 열기
  const handleExternalSwagger = () => {
    window.open(result.swaggerUrl, "_blank", "noopener,noreferrer")
  }

  // 모달 바깥 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

 

  // HTTP 메서드별로 색상 스타일 반환
  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800"
      case "POST":
        return "bg-blue-100 text-blue-800"
      case "PUT":
        return "bg-yellow-100 text-yellow-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }


  /** 
 * [프록시 API를 통해 swaggerUrl 데이터 불러오기 / 중계구조 CORS]
 * - 외부 API를 직접 호출하지 않고, Next.js API 라우트를 통해 우회 호출
 * - CORS 회피 목적 (서버 측에서 외부 API를 대신 호출)
 * - 실제 배포 시에도 보안과 통신 안전성을 위해 유용
 * - 테스트용 URL은 예시이며 실제로는 각 API마다 다르게 구성됨
 */
// const fetchSwaggerData = async () => {
//   if (!result?.swaggerUrl) return

//   try {
//     const proxyUrl = `/api/proxy?url=${encodeURIComponent(result.swaggerUrl)}`
//     const response = await fetch(proxyUrl)
//     const json = await response.json()

//     console.log('Swagger JSON:', json) // 확인용

//   } catch (err) {
//     console.error('Swagger fetch error:', err)
//   }
// }




  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-green-600" />
              API 문서
            </h2>
            <p className="text-gray-600 mt-1">{result.title}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleExternalSwagger}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Swagger UI 열기
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6">
          {/* API 기본 정보 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              기본 정보
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">API 엔드포인트:</span>
                  <div className="font-mono text-blue-600 mt-1 break-all">{result.apiEndpoint}</div>
                </div>
                <div>
                  <span className="text-gray-600">데이터 형식:</span>
                  <div className="font-medium mt-1">{result.dataFormat}</div>
                </div>
                <div>
                  <span className="text-gray-600">라이선스:</span>
                  <div className="font-medium mt-1">{result.license}</div>
                </div>
                <div>
                  <span className="text-gray-600">최종 업데이트:</span>
                  <div className="font-medium mt-1">{result.lastUpdated}</div>
                </div>
              </div>
            </div>
          </div>

          {/* API 메서드 목록 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              API 메서드
            </h3>

            {loading && <p className="text-center text-gray-500">로딩 중...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="space-y-3">
              {apiMethods.map((api, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getMethodColor(api.method)}`}>
                      {api.method}
                    </span>
                    <div className="flex-1">
                      <div className="font-mono text-sm text-gray-800 mb-1">{api.path}</div>
                      <div className="font-medium text-gray-900 mb-1">{api.summary}</div>
                      <div className="text-sm text-gray-600">{api.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 사용 예시 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">사용 예시</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                <code>{`// API 호출 예시
fetch('${result.apiEndpoint}/api/v1/data', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}</code>
              </pre>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={fetchDataViaProxy}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              🚀 프록시 호출 테스트 (콘솔 확인)
            </button>
            <button
              onClick={handleExternalSwagger}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              전체 Swagger 문서 보기
            </button>
            
            <button
              onClick={() => window.open(result.url, "_blank", "noopener,noreferrer")}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              공식 사이트
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwaggerModal
