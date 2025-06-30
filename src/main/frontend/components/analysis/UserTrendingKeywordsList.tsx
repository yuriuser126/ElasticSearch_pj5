"use client";

import React, { useEffect, useState } from 'react';
import { getMyTrendingKeywords } from '@/lib/api/analysis';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface TrendingKeyword {
  keyword: string;
  count: number;
}

const UserTrendingKeywordsList = () => {
    const [keywords, setKeywords] = useState<TrendingKeyword[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const rawData = await getMyTrendingKeywords();
                const formattedData = Object.entries(rawData)
                    .map(([keyword, count]) => ({ keyword, count }))
                    .sort((a, b) => b.count - a.count); // 횟수 순으로 정렬
                setKeywords(formattedData);
            } catch (error) {
                console.error("Failed to fetch user's trending keywords:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    
    if (loading) {
        return (
            <div className="space-y-3 pt-2">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                ))}
            </div>
        );
    }

    if (keywords.length === 0) {
      return <div className="flex items-center justify-center h-[300px] text-gray-500">검색 기록이 없습니다.</div>;
    }

    return (
        <div className="space-y-3 pt-2">
            {keywords.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="w-6 h-6 flex items-center justify-center">{index + 1}</Badge>
                      <span className="font-medium">{item.keyword}</span>
                    </div>
                    <span className="text-gray-500">{item.count.toLocaleString()} 회</span>
                </div>
            ))}
        </div>
    );
};

export default UserTrendingKeywordsList;
