package com.boot.Elastic;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import co.elastic.clients.elasticsearch.core.IndexResponse;

import com.boot.HackerNews.DTO.HackerNewsItem;
import com.boot.Reddit.DTO.RedditItem;
import com.boot.StackOverflow.DTO.StackOverflowQuestion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class ElasticService {

    @Autowired
    private ElasticConfig elasticConfig;

    //StackOverflow 저장 메서드
    public void saveTen(List<StackOverflowQuestion> questions) throws IOException {
        ElasticsearchClient client = elasticConfig.getClient();

        for (StackOverflowQuestion question : questions) {
            IndexResponse response = client.index(IndexRequest.of(i -> i
                    .index("stackoverflow")
                    .id(String.valueOf(question.getQuestion_id()))
                    .document(question)
            ));
        System.out.println("Elasticsearch 저장 완료: " + response.result());
        }
    }
    //RedditItem 저장 메서드
    public void saveTenRedditItem(List<RedditItem> items) throws IOException {
        ElasticsearchClient client = elasticConfig.getClient();

        for (RedditItem item : items) {
            IndexResponse response = client.index(IndexRequest.of(i -> i
                .index("reddit_items")
                .id(item.getId())
                .document(item)
            ));
        System.out.println("Elasticsearch 저장 완료: " + response.result());
        }
    }
    
    //hackernews' 저장 메서드
    public void saveOneHackerNewsItem(HackerNewsItem item) throws IOException {
        ElasticsearchClient client = elasticConfig.getClient();

        IndexResponse response = client.index(IndexRequest.of(i -> i
                .index("hackernews")  // 인덱스명은 'hackernews'로 지정
                .id(String.valueOf(item.getId()))  // id 필드를 문자열로 변환하여 사용
                .document(item)
        ));
        System.out.println("Elasticsearch 저장 완료 (HackerNews): " + response.result());
    }
}
