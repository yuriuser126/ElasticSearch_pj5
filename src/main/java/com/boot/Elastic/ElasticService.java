package com.boot.Elastic;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.boot.StackOverflow.DTO.StackOverflowQuestion;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;

@Service
public class ElasticService {
    @Value("${translate.apikey}")
    private String apiKey;

    @Value("${translate.baseurl}")
    private String base;

    @Autowired
    private ElasticConfig elasticConfig;



    public void saveOne(StackOverflowQuestion question) throws IOException {
        ElasticsearchClient client = elasticConfig.getClient();

        IndexResponse response = client.index(IndexRequest.of(i -> i
                .index("stackoverflow")
                .id(String.valueOf(question.getQuestion_id()))
                .document(question)
        ));
        System.out.println("Elasticsearch 저장 완료: " + response.result());
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
