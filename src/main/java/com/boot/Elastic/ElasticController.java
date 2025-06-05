package com.boot.Elastic;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/es")
public class ElasticController {

    @Autowired
    private ElasticConfig elasticConfig;

    @PostMapping("/doc")
    public String addDoc(@RequestBody Map<String, Object> body) throws IOException {
        ElasticsearchClient client = elasticConfig.getClient();
        IndexRequest<Map<String, Object>> request = IndexRequest.of(b -> b
                .index("my_index")
                .document(body)
        );
        IndexResponse response = client.index(request);
        return "생성된 문서 ID: " + response.id();
    }

    @GetMapping("/doc/{id}")
    public Object getDoc(@PathVariable("id") String id) throws IOException {
        ElasticsearchClient client = elasticConfig.getClient();
        GetRequest getRequest = GetRequest.of(b -> b
                .index("my_index")
                .id(id)
        );
        GetResponse<Map> response = client.get(getRequest, Map.class);
        if (response.found()) {
            return response.source();
        } else {
            return "문서를 찾을 수 없습니다.";
        }
    }

    @GetMapping("/questions")
    public Object getQuestions() throws IOException {
        ElasticsearchClient client = elasticConfig.getClient();
        SearchRequest request = SearchRequest.of(s -> s
//                .index("mydb.stackoverflowquestions")
                        .index("mydb.*")
                        .size(1000)
//                .size(25)
                        .query(q -> q.matchAll(m -> m))
        );
        SearchResponse<Map> response = client.search(request, Map.class);
        return response.hits().hits().stream()
                .map(hit -> (Map<String, Object>) hit.source())
                .collect(Collectors.toList());
    }
}