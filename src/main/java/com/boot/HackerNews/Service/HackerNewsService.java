package com.boot.HackerNews.Service;


import com.boot.HackerNews.DTO.HackerNewsItem;
import com.boot.HackerNews.Repository.HackerNewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.boot.Elastic.ElasticService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class HackerNewsService {
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String TOP_STORIES_URL = "https://hacker-news.firebaseio.com/v0/topstories.json";
    private static final String ITEM_URL = "https://hacker-news.firebaseio.com/v0/item/{id}.json";

    @Autowired
    private HackerNewsRepository hackerNewsRepository;
    
    // Elasticsearch 저장용 서비스 주입
    @Autowired
    private ElasticService elasticService;

    public List<HackerNewsItem> getTopStories(int count) {
        // 1. 인기글 ID 목록 조회
        Long[] ids = restTemplate.getForObject(TOP_STORIES_URL, Long[].class);
        List<HackerNewsItem> results = new ArrayList<>();
        // 2. 각 ID로 상세 정보 조회 (최대 count개)
        for (int i = 0; i < Math.min(count, ids.length); i++) {
            HackerNewsItem item = restTemplate.getForObject(ITEM_URL, HackerNewsItem.class, ids[i]);
            if (item != null) {
                results.add(item);
            }
        }
        return results;
    }

    public void saveTopStoriesToMongo(int count) {
        List<HackerNewsItem> topStories = getTopStories(count);
        hackerNewsRepository.saveAll(topStories);
    }
    
    
    /**
     * [추가] 인기 해커뉴스 글을 가져와서 Elasticsearch에 저장하는 메서드
     * @param count 저장할 인기 글 개수
     * @throws IOException Elasticsearch 저장 중 오류 발생 시 예외 throw
     */
    public void saveTopStoriesToElastic(int count) throws IOException {
        List<HackerNewsItem> topStories = getTopStories(count);
        for (HackerNewsItem item : topStories) {
            // ElasticService의 saveOneHackerNewsItem 메서드 호출하여 저장
            elasticService.saveOneHackerNewsItem(item);
        }
    }
}
