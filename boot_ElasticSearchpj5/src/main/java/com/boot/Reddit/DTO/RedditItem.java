package com.boot.Reddit.DTO;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "reddit_items")
//MongoDB의 "reddit_items" 컬렉션에 저장될 도큐먼트임을 명시

public class RedditItem {
    @Id
    private String id; // Reddit 게시물 ID (예: "1l3c9nw")
    private String title; // 게시물 제목
    private String subreddit; // 게시물이 올라온 서브레딧 이름 (예: "news")
    private String url; // 게시물 원본 링크 URL
    private int score; // 게시물 추천 수 (업보트 - 다운보트 합산 점수)
}
