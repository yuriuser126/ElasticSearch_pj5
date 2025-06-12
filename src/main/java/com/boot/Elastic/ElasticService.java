package com.boot.Elastic;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.boot.StackOverflow.DTO.StackOverflowQuestion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ElasticService {

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
}
