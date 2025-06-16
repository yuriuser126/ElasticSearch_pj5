"use client";

import React, { useEffect, useState } from 'react';
import { getOverallTrendingKeywords } from '@/lib/api/analysis';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface TrendingKeyword {
  keyword: string;
  count: number;
}

const OverallTrendingKeywordsList = () => {
    const [keywords, setKeywords] = useState<TrendingKeyword[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const rawData = await getOverallTrendingKeywords();
                const formattedData = Object.entries(rawData)
                    .map(([keyword, count]) => ({ keyword, count }))
                    .sort((a, b) => b.count - a.count);
                setKeywords(formattedData);
            } catch (error) {
                console.error("Failed to fetch overall trending keywords:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-3 pt-2">
                {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                ))}
            </div>
        );
    }

    if (keywords.length === 0) {
      return <div className="flex items-center justify-center h-[300px] text-gray-500">분석할 데이터가 없습니다.</div>;
    }

    return (
        <div className="space-y-3 pt-2">
            {keywords.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="w-6 h-6 flex items-center justify-center bg-blue-500 text-white">{index + 1}</Badge>
                      <span className="font-medium">{item.keyword}</span>
                    </div>
                    <span className="text-gray-500">{item.count.toLocaleString()} 회</span>
                </div>
            ))}
        </div>
    );
};

export default OverallTrendingKeywordsList;