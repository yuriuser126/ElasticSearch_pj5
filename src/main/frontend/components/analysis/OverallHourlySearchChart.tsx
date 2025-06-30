"use client";

import React, { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getOverallHourlySearchVolume } from '@/lib/api/analysis';
import { Skeleton } from "@/components/ui/skeleton";

interface ChartData {
  time: string;
  count: number;
}

const OverallHourlySearchChart = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const rawData = await getOverallHourlySearchVolume();
        const formattedData = Object.entries(rawData).map(([time, count]) => ({
          time: new Date(time).toLocaleTimeString('ko-KR', { hour: 'numeric', hour12: false }),
          count,
        })).sort((a,b) => parseInt(a.time) - parseInt(b.time));
        setData(formattedData);
      } catch (error) {
        console.error("Failed to fetch overall hourly search volume:", error);
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
    return <div className="flex items-center justify-center h-[300px] text-gray-500">분석할 데이터가 없습니다.</div>;
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
                <Line type="monotone" dataKey="count" stroke="#82ca9d" name="전체 검색 횟수" />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

export default OverallHourlySearchChart;