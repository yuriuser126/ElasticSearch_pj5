package com.example.demo.Reddit.Controller;

import com.example.demo.Reddit.DTO.RedditItem;
import com.example.demo.Reddit.Service.RedditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
}
