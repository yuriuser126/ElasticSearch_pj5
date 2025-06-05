package com.boot.Elastic;

import java.io.IOException;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.GetRequest;
import co.elastic.clients.elasticsearch.core.GetResponse;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/es")
@Tag(name = "Elasticsearch API", description = "Elasticsearch와 연동된 CRUD 및 검색 기능 제공")
public class ElasticController {

    @Autowired
    private ElasticConfig elasticConfig;

    @Operation(summary = "문서 추가", description = "my_index 인덱스에 새 문서를 추가합니다.")
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
    
    @Operation(summary = "문서 추가", description = "my_index 인덱스에 새 문서를 추가합니다.")
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
    
    @Operation(summary = "모든 질문 조회", description = "mydb.stackoverflowquestions 인덱스에서 전체 질문을 조회합니다.")
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
/*
 *     @Operation(summary = "모든 질문 조회", description = "mydb.stackoverflowquestions 인덱스에서 전체 질문을 조회합니다.")
		컨트롤러 작성하실때 mapping 위에 operation해서 위 같은 방식으로 작성하시면 간결하게 설명까지 나오니까 해주세요.
		
		@Tag		Controller에 대한 설명을 명시하는 어노테이션
		@Tag	name	API 그룹의 이름을 지정하는 속성
		@Tag	description	API 그룹의 설명을 지정하는 속성
		@Operation		API 그룹 내에 각각의 API를 명시하는 어노테이션
		@Operation	summary	API에 대한 간략한 설명을 지정하는 속성
		@Operation	description	API에 대한 상세 설명을 지정하는 속성
		@Operation	response	API에 대한 응답을 지정하는 속성
		@Operation	parameter	API에 대한 파라미터를 지정하는 속성
		@Schema		모델에 대한 설명을 명시하는 어노테이션
		@Schema	description	모델 자체 혹은 컬럼에 대한 설명을 하는 속성
	
		이런 식으로 사용하시면 좋고 DTO도 해주시면 정말 깔끔해집니다.
		
		
		나머지는 제가 다 하겠습니다.
 * */