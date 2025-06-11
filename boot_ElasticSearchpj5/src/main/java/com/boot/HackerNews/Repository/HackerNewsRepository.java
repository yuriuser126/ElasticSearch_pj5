package com.boot.HackerNews.Repository;


import com.boot.HackerNews.DTO.HackerNewsItem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HackerNewsRepository extends MongoRepository<HackerNewsItem, Long> {
}