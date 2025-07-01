package com.boot.HackerNews.Controller;

import com.boot.HackerNews.DTO.HackerNewsItem;
import com.boot.HackerNews.Service.HackerNewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/hackernews")
public class HackerNewsController {

    @Autowired
    private HackerNewsService hackerNewsService;

    @GetMapping("/top")
    public List<HackerNewsItem> getTopStories(@RequestParam(value = "count", required = false) String countStr) {
        int count;
        try {
            count = (countStr == null || countStr.isBlank()) ? 10 : Integer.parseInt(countStr);
        } catch (NumberFormatException e) {
            count = 10;
        }
        return hackerNewsService.getTopStories(count);
    }


    @GetMapping("/save")
    public void saveTopStoriesToMongo(@RequestParam(value = "count", defaultValue = "10") int count) {
        hackerNewsService.saveTopStoriesToMongo(count);
    }
    
    
    //엘라스틱용 저장메서드
    //HackerNews 인기 글 10개를 가져와서 저장 - 성공메세지
    @GetMapping("/saveToElastic")
    public String saveTopStoriesToElastic(@RequestParam(value = "count", defaultValue = "10") int count) {
        try {
            hackerNewsService.saveTopStoriesToElastic(count);
            return "Elasticsearch hacker news 인기글 10개 저장 완료";
        } catch (IOException e) {
            e.printStackTrace();
            return "저장 실패: " + e.getMessage();
        }
    }

    @GetMapping("/health")
    public String healthCheck() {
        return hackerNewsService.healthHeackerNews();
    }
}