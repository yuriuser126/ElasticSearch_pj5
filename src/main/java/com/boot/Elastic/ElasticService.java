package com.boot.Elastic;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import co.elastic.clients.elasticsearch.core.IndexResponse;

import com.boot.HackerNews.DTO.HackerNewsItem;
import com.boot.Reddit.DTO.RedditItem;
import com.boot.StackOverflow.DTO.StackOverflowQuestion;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.List;

@Service
public class ElasticService {
    @Value("${translate.apikey}")
    private String apiKey;

    @Value("${translate.baseurl}")
    private String base;

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

    public String translate(String text) throws Exception {
        WebClient webClient = WebClient.create(base);

        String response_translate = webClient.post()
                .uri("/translate")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .bodyValue("auth_key=" + apiKey + "&text=" + text + "&target_lang=EN")
                .retrieve()
                .bodyToMono(String.class)
                .block();
        String translatedText = extractTranslatedText( response_translate);
        return translatedText;

    }
    public String extractTranslatedText(String json) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(json); // JSON 문자열을 트리 구조로 파싱

        // translations[0].text 값 추출
        String translatedText = root.path("translations").get(0).path("text").asText();

        // 로그로 전체 구조와 번역 결과 출력
        System.out.println("전체 JSON: " + root.toPrettyString());
        System.out.println("번역된 텍스트: " + translatedText);

        return translatedText;
    }
}
