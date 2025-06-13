import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Database, Search, TrendingUp, CheckCircle, Clock, XCircle } from "lucide-react"

interface HistoryEntry {
  id: number
  keyword: string
  source: string
  collectedAt: string
  status: "완료" | "진행중" | "실패"
  resultCount: number
}

const mockHistory: HistoryEntry[] = [
  {
    id: 1,
    keyword: "React 18 새 기능",
    source: "개발자 블로그, 기술 매거진",
    collectedAt: "2024-01-15T10:30:00Z",
    status: "완료",
    resultCount: 12,
  },
  {
    id: 2,
    keyword: "Spring Boot 3.0 마이그레이션",
    source: "기술 블로그, 공식 문서",
    collectedAt: "2024-01-14T15:45:00Z",
    status: "완료",
    resultCount: 8,
  },
  {
    id: 3,
    keyword: "JavaScript ES2024",
    source: "웹 개발 매거진, MDN",
    collectedAt: "2024-01-13T09:15:00Z",
    status: "완료",
    resultCount: 15,
  },
  {
    id: 4,
    keyword: "Docker Kubernetes 배포",
    source: "클라우드 기술 블로그",
    collectedAt: "2024-01-12T14:20:00Z",
    status: "진행중",
    resultCount: 0,
  },
  {
    id: 5,
    keyword: "Python 머신러닝 라이브러리",
    source: "AI 기술 블로그, 논문",
    collectedAt: "2024-01-11T11:00:00Z",
    status: "실패",
    resultCount: 0,
  },
  {
    id: 6,
    keyword: "Vue.js 3 Composition API",
    source: "프론트엔드 블로그",
    collectedAt: "2024-01-10T16:30:00Z",
    status: "완료",
    resultCount: 6,
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "완료":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "진행중":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "실패":
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "완료":
      return "bg-green-100 text-green-800 border-green-200"
    case "진행중":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "실패":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function DataCollectionHistory() {
  const completedCount = mockHistory.filter((h) => h.status === "완료").length
  const totalResults = mockHistory.reduce((sum, h) => sum + h.resultCount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Database className="h-6 w-6 text-gray-700" />
        <h2 className="text-2xl font-medium text-gray-900">데이터 수집 이력</h2>
      </div>

      {/* 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">총 수집 건수</p>
                <p className="text-2xl font-bold text-blue-900">{mockHistory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">완료된 수집</p>
                <p className="text-2xl font-bold text-green-900">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-700 font-medium">총 결과 수</p>
                <p className="text-2xl font-bold text-purple-900">{totalResults}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 수집 이력 테이블 */}
      <Card className="shadow-lg border-0 shadow-gray-200/50">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg font-medium">최근 수집 이력</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b sticky top-0">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 border-r">키워드</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 border-r">출처</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 border-r">수집일시</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 border-r">상태</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">결과 수</th>
                </tr>
              </thead>
              <tbody>
                {mockHistory.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="py-4 px-6 border-r">
                      <div className="flex items-center gap-3">
                        <Search className="h-4 w-4 text-gray-400 shrink-0" />
                        <span className="font-medium text-gray-900">{entry.keyword}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 border-r">
                      <span className="text-gray-600 text-sm">{entry.source}</span>
                    </td>
                    <td className="py-4 px-6 border-r">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(entry.collectedAt).toLocaleString("ko-KR")}
                      </div>
                    </td>
                    <td className="py-4 px-6 border-r">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(entry.status)}
                        <Badge className={`${getStatusColor(entry.status)} border`} variant="outline">
                          {entry.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">
                        {entry.resultCount > 0 ? `${entry.resultCount}개` : "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
