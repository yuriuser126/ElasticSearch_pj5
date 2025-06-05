package com.boot.HackerNews.DTO;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "hackernews")
@Data
public class HackerNewsItem {
    private Long id;
    private String by;
    private Long time;
    private String title;
    private String url;
    private Integer score;
    private Integer descendants; // 댓글 수
    private String type;
}