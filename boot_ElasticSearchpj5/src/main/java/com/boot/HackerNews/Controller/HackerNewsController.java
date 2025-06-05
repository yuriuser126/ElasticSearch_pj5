package com.boot.HackerNews.Controller;

import com.boot.HackerNews.DTO.HackerNewsItem;
import com.boot.HackerNews.Service.HackerNewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}