package com.boot.analysis.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boot.analysis.service.SearchAnalysisService;
import com.boot.z_config.security.UserUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class SearchAnalysisController {

    private final SearchAnalysisService searchAnalysisService;

    /**
     * 프론트엔드에서 검색 시 호출되어 검색어를 기록하는 API
     * @param keyword 검색어
     * @return 성공 시 200 OK
     */
    @PostMapping("/log")
    public ResponseEntity<Void> logSearch(@RequestParam("keyword") String keyword) { // ★★★ 이 부분이 수정되었습니다! ★★★
        // 현재 로그인한 사용자의 ID를 가져옴. 없으면 "anonymous"로 기록.
        String userId = UserUtils.getCurrentUserId().orElse("anonymous");
        log.info("✔️ 검색어 저장 요청: keyword='{}', userId='{}', 서버 현재 시각='{}'", keyword, userId, LocalDateTime.now());
        searchAnalysisService.saveSearchLog(keyword, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 현재 로그인된 사용자의 시간대별 검색량 데이터를 요청하는 API
     * @return 시간대별 검색량 데이터
     * @throws IOException
     */
    @GetMapping("/stats/user/hourly")
    public ResponseEntity<Map<String, Long>> getMyHourlySearchVolume() throws IOException {
        String userId = UserUtils.getCurrentUserId().orElseThrow(() -> new IllegalStateException("User not authenticated"));
        return ResponseEntity.ok(searchAnalysisService.getHourlySearchVolumeForUser(userId));
    }

    /**
     * 현재 로그인된 사용자의 인기 검색어 데이터를 요청하는 API
     * @return 인기 검색어 데이터
     * @throws IOException
     */
    @GetMapping("/stats/user/trending")
    public ResponseEntity<Map<String, Long>> getMyTrendingKeywords() throws IOException {
        String userId = UserUtils.getCurrentUserId().orElseThrow(() -> new IllegalStateException("User not authenticated"));
        return ResponseEntity.ok(searchAnalysisService.getTrendingKeywordsForUser(userId));
    }
    
    /**
     * [신규] 전체 사용자의 시간대별 검색량 데이터를 요청하는 API
     */
    @GetMapping("/stats/overall/hourly")
    public ResponseEntity<Map<String, Long>> getOverallHourlySearchVolume() throws IOException {
        log.info("✔️ 전체 시간대별 검색량 조회 API 호출 (관리자용)");
        return ResponseEntity.ok(searchAnalysisService.getOverallHourlySearchVolume());
    }

    /**
     * [신규] 전체 사용자의 인기 검색어 데이터를 요청하는 API
     */
    @GetMapping("/stats/overall/trending")
    public ResponseEntity<Map<String, Long>> getOverallTrendingKeywords() throws IOException {
        log.info("✔️ 전체 인기 검색어 조회 API 호출 (관리자용)");
        return ResponseEntity.ok(searchAnalysisService.getOverallTrendingKeywords());
    }
}
