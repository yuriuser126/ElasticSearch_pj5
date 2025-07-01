package com.boot.Reddit.Controller;

import com.boot.Reddit.DTO.RedditItem;
import com.boot.Reddit.Service.RedditService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.util.List;

@RestController
@RequestMapping("/reddit")
public class RedditController {

    @Autowired
    private RedditService redditService;

    // 1) Reddit API 호출해서 핫포스트 데이터 저장 (Postman으로 테스트용)
    // URL: http://localhost:8485/reddit/fetch 
    // URL: http://localhost:8485/reddit/fetch?subreddit=java&limit=5
    @PostMapping("/fetch")
    public String fetchAndSave(@RequestParam("subreddit") String subreddit, @RequestParam(value = "limit" ,defaultValue = "10") int limit) {
    	//key : subreddit  value : news, java, funny 등 
    	//key : limit value : 정하는값 - 이거 안적으면 자동 10개로 지정 
        redditService.fetchAndSaveHotPosts(subreddit, limit);
        return "Saved Reddit posts from /r/" + subreddit;
    }

    // 2) 저장된 모든 Reddit 아이템 조회
    // URL: http://localhost:8485/reddit
    @GetMapping
    public List<RedditItem> getAllItems() {
        return redditService.getAllItems();
    }
    
    //엘라스틱쪽 저장 10 개 가지고와서 저장
    //subreddit은 Reddit에서 특정 주제별로 나눠진 커뮤니티
    // fetch/elastic?subreddit = java or memes or machinelearning
    @PostMapping("/fetch/elastic")
    public String fetchAndSaveTenToElastic(@RequestParam("subreddit") String subreddit) {
        try {
            redditService.saveTenHotPostToElastic(subreddit);
            return "Elasticsearch에 Reddit 게시글 10개 저장 완료";
        } catch (Exception e) {
            e.printStackTrace();
            return "오류 발생: " + e.getMessage();
        }
    }

    @GetMapping("/health")
    public String healthCheckReddit() throws MalformedURLException {
        return redditService.checkRedditHealth();
    }
}
