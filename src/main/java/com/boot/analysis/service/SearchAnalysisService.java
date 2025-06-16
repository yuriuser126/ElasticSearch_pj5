package com.boot.analysis.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.aggregations.CalendarInterval;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.boot.analysis.dto.SearchLog;
import com.boot.analysis.repository.SearchLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchAnalysisService {

    private final SearchLogRepository searchLogRepository;
    private final ElasticsearchClient elasticsearchClient;

    /**
     * 검색어와 사용자 ID를 받아 Elasticsearch에 로그를 저장합니다.
     * @param keyword 검색어
     * @param userId 사용자 ID
     */
    public void saveSearchLog(String keyword, String userId) {
        // ★★★ 이 부분이 수정되었습니다! ★★★
        // LocalDateTime.now() 대신 Instant.now()를 사용하여 UTC 시간을 저장합니다.
        SearchLog searchLog = new SearchLog(keyword, Instant.now(), userId);
        searchLogRepository.save(searchLog);
    }

    /**
     * 특정 사용자의 시간대별 검색량을 집계하여 반환합니다.
     * @param userId 분석할 사용자 ID
     * @return 시간대별 검색 횟수 맵
     * @throws IOException Elasticsearch 통신 중 예외 발생 가능
     */
    public Map<String, Long> getHourlySearchVolumeForUser(String userId) throws IOException {
        SearchResponse<Void> response = elasticsearchClient.search(s -> s
                        .index("search_logs")
                        .size(0)
                        .query(q -> q
                                .term(t -> t
                                        .field("userId.keyword")
                                        .value(userId)
                                )
                        )
                        .aggregations("hourly_searches", a -> a
                                .dateHistogram(h -> h
                                        .field("search_time")
                                        .calendarInterval(CalendarInterval.Hour)
                                        .timeZone("Asia/Seoul")
                                )
                        ),
                Void.class
        );

        if (response.aggregations().isEmpty() || !response.aggregations().containsKey("hourly_searches")) {
            return Collections.emptyMap();
        }

        Map<String, Long> result = new HashMap<>();
        response.aggregations()
                .get("hourly_searches")
                .dateHistogram()
                .buckets()
                .array()
                .forEach(bucket -> result.put(bucket.keyAsString(), bucket.docCount()));
        log.info("시간대별 검색량 결과 from Elasticsearch: {}", result);

        return result;
    }

    /**
     * 특정 사용자가 가장 많이 검색한 키워드 10개를 집계하여 반환합니다.
     * @param userId 분석할 사용자 ID
     * @return 검색어별 검색 횟수 맵
     * @throws IOException Elasticsearch 통신 중 예외 발생 가능
     */
    public Map<String, Long> getTrendingKeywordsForUser(String userId) throws IOException {
        SearchResponse<Void> response = elasticsearchClient.search(s -> s
                        .index("search_logs")
                        .size(0)
                        .query(q -> q
                                .term(t -> t
                                        .field("userId.keyword")
                                        .value(userId)
                                )
                        )
                        .aggregations("trending_keywords", a -> a
                                .terms(t -> t
                                        .field("keyword.keyword")
                                        .size(10)
                                )
                        ),
                Void.class
                
        );

        if (response.aggregations().isEmpty() || !response.aggregations().containsKey("trending_keywords")) {
            return Collections.emptyMap();
        }

        Map<String, Long> result = new HashMap<>();
        response.aggregations()
                .get("trending_keywords")
                // ★★★ 이 부분이 수정되었습니다! .terms() -> .sterms() ★★★
                .sterms()
                .buckets()
                .array()
                // .key()는 FieldValue 타입이므로, .stringValue()로 실제 문자열 값을 가져옵니다.
                .forEach(bucket -> result.put(bucket.key().stringValue(), bucket.docCount()));
        log.info("인기 검색어 결과 from Elasticsearch: {}", result);
        return result;
    }
    
    /**
     * [신규] 전체 사용자의 시간대별 검색량을 집계하여 반환합니다.
     */
    public Map<String, Long> getOverallHourlySearchVolume() throws IOException {
        SearchResponse<Void> response = elasticsearchClient.search(s -> s
                        .index("search_logs")
                        .size(0)
                        // userId 필터링 쿼리가 없습니다.
                        .aggregations("hourly_searches", a -> a
                                .dateHistogram(h -> h
                                        .field("search_time")
                                        .calendarInterval(CalendarInterval.Hour)
                                        .timeZone("Asia/Seoul")
                                )
                        ),
                Void.class
        );

        Map<String, Long> result = new HashMap<>();
        if (response.aggregations().containsKey("hourly_searches")) {
            response.aggregations()
                    .get("hourly_searches")
                    .dateHistogram()
                    .buckets()
                    .array()
                    .forEach(bucket -> result.put(bucket.keyAsString(), bucket.docCount()));
        }
        
        log.info("전체 시간대별 검색량 결과 from Elasticsearch: {}", result);
        return result;
    }

    /**
     * [신규] 전체 사용자의 인기 검색어 Top 10을 집계하여 반환합니다.
     */
    public Map<String, Long> getOverallTrendingKeywords() throws IOException {
        SearchResponse<Void> response = elasticsearchClient.search(s -> s
                        .index("search_logs")
                        .size(0)
                        // userId 필터링 쿼리가 없습니다.
                        .aggregations("trending_keywords", a -> a
                                .terms(t -> t
                                        .field("keyword.keyword")
                                        .size(10)
                                )
                        ),
                Void.class
        );

        Map<String, Long> result = new HashMap<>();
        if (response.aggregations().containsKey("trending_keywords")) {
            response.aggregations()
                    .get("trending_keywords")
                    .sterms()
                    .buckets()
                    .array()
                    .forEach(bucket -> result.put(bucket.key().stringValue(), bucket.docCount()));
        }

        log.info("전체 인기 검색어 결과 from Elasticsearch: {}", result);
        return result;
    }
}
