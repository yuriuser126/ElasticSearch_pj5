"use client"

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

interface KeywordData {
  key: string;
  docCount: number;
}

const TopKeywordsChart: React.FC = () => {
  const [data, setData] = useState<KeywordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 백엔드에 새로 만든 API 경로로 요청
        const response = await fetch('/api/es/top-keywords');
        if (!response.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }
        const result = await response.json();

        // 디버깅용 로그
        console.log('백엔드에서 받은 실제 데이터:', JSON.stringify(result, null, 2));

        // docCount 기준으로 내림차순 정렬
        const sortedData = result.sort((a: any, b: any) => b.docCount - a.docCount);
        setData(sortedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-8">키워드 순위를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">오류: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Top 10 Stack Overflow 키워드</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="pr-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">키워드 순위</h3>
                <ol className="space-y-2">
                    {data.map((item: any, index) => (
                        <li key={item.key} className="flex justify-between items-center p-2 rounded-md transition-colors hover:bg-gray-50">
                            <div className="flex items-center">
                                <span className="text-sm font-bold text-gray-500 w-6">{index + 1}.</span>
                                <span className="font-medium text-gray-800">{item.key}</span>
                            </div>
                            <span className="text-sm font-semibold text-blue-600">{item.docCount?.toLocaleString()} 건</span>
                        </li>
                    ))}
                </ol>
            </div>
            <div>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data.slice().reverse()} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                        <XAxis type="number" stroke="#888" />
                        <YAxis dataKey="key" type="category" width={100} stroke="#888" tick={{ fontSize: 12 }} />
                        <Tooltip
                            cursor={{fill: 'rgba(240, 240, 240, 0.5)'}}
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                        />
                        <Legend />
                        <Bar dataKey="docCount" fill="#3b82f6" name="게시물 수" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

export default TopKeywordsChart;