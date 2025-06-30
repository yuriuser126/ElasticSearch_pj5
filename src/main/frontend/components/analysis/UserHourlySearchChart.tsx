"use client";

import React, { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getMyHourlySearchVolume } from '@/lib/api/analysis';
import { Skeleton } from "@/components/ui/skeleton";

interface ChartData {
  time: string;
  count: number;
}

const UserHourlySearchChart = () => {
  // 1. 컴포넌트 렌더링 시작 로그
  console.log("✅ [1/4] UserHourlySearchChart 컴포넌트가 렌더링되었습니다.");

  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. useEffect 훅 실행 로그
    console.log("✅ [2/4] useEffect 훅이 실행되어 데이터 가져오기를 시작합니다.");

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 3. API 호출 직전 로그
        console.log("✅ [3/4] getMyHourlySearchVolume API를 호출합니다.");
        const rawData = await getMyHourlySearchVolume();
        
        // 4. API 호출 성공 로그
        console.log("✅ [4/4] API로부터 데이터를 성공적으로 받아왔습니다:", rawData);

        const formattedData = Object.entries(rawData).map(([time, count]) => ({
          time: new Date(time).toLocaleTimeString('ko-KR', { hour: 'numeric', hour12: false }),
          count,
        })).sort((a,b) => parseInt(a.time) - parseInt(b.time));
        setData(formattedData);

      } catch (error) {
        // 4-E. API 호출 실패 로그
        console.error("❌ API 호출 중 오류가 발생했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Skeleton className="w-full h-[300px]" />;
  }

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-[300px] text-gray-500">검색 기록이 없습니다.</div>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" name="나의 검색 횟수" />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

export default UserHourlySearchChart;
