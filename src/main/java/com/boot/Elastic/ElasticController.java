package com.boot.Elastic;


import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.Operator;
import co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType;
import co.elastic.clients.elasticsearch.core.*;

import com.boot.log.model.Logs;
import com.boot.log.service.LogService;
import com.boot.z_config.security.PrincipalDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


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
import org.springframework.web.client.RestTemplate;

@Slf4j
@RestController
@RequestMapping("/es")
@Tag(name = "Elasticsearch API", description = "Elasticsearch와 연동된 CRUD 및 검색 기능 제공")
public class ElasticController {

    @Autowired
    private ElasticConfig elasticConfig;

    @Autowired
    private ElasticService elasticService;
    @Autowired
    private LogService logService;


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

    @Operation(summary = "모든 질문 조회 또는 검색", description = "query 파라미터가 있으면 검색, 없으면 전체 조회합니다.")
    @GetMapping("/questions")
    public Object getOrSearchQuestions
    	(@RequestParam(name = "query", required = false) String query,
    	@RequestParam(name = "page", defaultValue = "1") int page,
    	@RequestParam(name = "size", defaultValue = "10") int size,
         @RequestParam(name = "category", required = false) String category,
         @RequestParam(name = "format", required = false) String format,
         @RequestParam(name = "sortBy", required = false) String sortBy,
         Authentication authentication
    	) throws Exception {
        Logs logs = new Logs();
        logs.setActivityType("SEARCH");
        logs.setAction("getOrSearchQuestions");
        logs.setTimestamp(LocalDateTime.now());

        // 인증 정보에서 유저 정보 추출
        if (authentication != null && authentication.isAuthenticated() &&
                authentication.getPrincipal() instanceof PrincipalDetails) {
            PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();
            logs.setActorType("USER");
            logs.setActorId(principal.getUser().getUserId());
            logs.setActorName(principal.getUser().getUserName());
        } else {
            logs.setActorType("ANONYMOUS");
            logs.setActorId("anonymous");
            logs.setActorName("anonymous");
        }

        try {
            ElasticsearchClient client = elasticConfig.getClient();

            int from = (page - 1) * size;

            String searchQuery;
            String searchCategory;
            if (query != null && !query.isEmpty()) {
                if (category != null && !category.isEmpty()) {
                    query = query + " " + category;
                } else {
                    query = query;
                }
                //String correctedQuery = correctKoreanTypo(query);
//            query = query + " " + category;
                // 서비스 단에서 번역 수행
                searchQuery = elasticService.translate(query);

                log.info("번역된 쿼리: {}", searchQuery);
                log.info("category: {}", category);
                log.info("format: {}", format);
                log.info("sortBy: {}", sortBy);
            } else {
                searchQuery = query;
            }
//        if(category != null && !category.isEmpty()) {
//            searchCategory = elasticService.translate(category);
//        }
//        else {
//            searchCategory = category;
//        }

            String indexName;
            if (format != null && !format.isEmpty()) {
                if ("stackoverflow".equals(format)) {
                    indexName = "mydb.stackoverflowquestions";
                } else if ("reddit".equals(format)) {
                    indexName = "mydb.redditquestions";
                } else if ("hackernews".equals(format)) {
                    indexName = "mydb.hackernews";
                } else {
                    indexName = "mydb.*";
                }
            } else {
                indexName = "mydb.*";
            }


            SearchRequest request = SearchRequest.of(s -> s
                            .index(indexName)  // 정확한 인덱스로 고정
                            .from(from) // 'from' 값으로 페이징 시작 위치 지정
                            .size(20)
                            .query(q -> {
                                if (searchQuery == null || searchQuery.isEmpty()) {
                                    log.info("elastic controller : " + searchQuery);
                                    return q.matchAll(m -> m);
                                } else {
                                    log.info("elastic controller2 : " + searchQuery);
                                    return q.bool(b -> b
                                                    .should(m -> m.multiMatch(mm -> mm
                                                            .fields("title^5", "body^2", "tags")
                                                            .query(searchQuery)
                                                            .type(TextQueryType.BestFields)
                                                            .fuzziness("AUTO")
                                                            .operator(Operator.Or)
                                                            .minimumShouldMatch("70%")

                                                    ))
                                            // 카테고리 필터링 추가 - 검색 정확도는 높아지지만 데이터셋 부족으로 사용 x
//                                .filter(f -> {
//                                    if (searchCategory != null && !searchCategory.isEmpty()) {
//
//                                        return f.term(t -> t.field("tag").value(searchCategory));
//                                    } else {
//                                        return null; // 필터 없음
//                                    }
//                                })
                                    );
                                }
                            })
                            // 하이라이트 <em> 태그 붙어서 나옴
                            .highlight(h -> h
                                    .fields("title", f -> f)
                                    .fields("body", f -> f)
                                    .fields("tags", f -> f)
                            )

                            // 정렬 조건
                            .sort(sortBuilder -> {
                                if ("date".equals(sortBy)) {
                                    return sortBuilder.field(f -> f.field("score").order(SortOrder.Desc));
                                } else if ("popularity".equals(sortBy)) {
                                    return sortBuilder.field(f -> f.field("view_count").order(SortOrder.Desc));
                                } else if ("relevance".equals(sortBy)) {
                                    return sortBuilder.field(f -> f.field("score").order(SortOrder.Desc));
                                } else {
                                    // 기본 정렬 조건 (예: _score 내림차순)
                                    return sortBuilder.field(f -> f.field("_score").order(SortOrder.Desc));
                                }
                            })
            );

            SearchResponse<Map> response = client.search(request, Map.class);

            // 총 검색 결과 개수
            long total = response.hits().total().value();

            // 검색 결과 리스트
            List<Map<String, Object>> hits = response.hits().hits().stream()
                    .map(hit -> (Map<String, Object>) hit.source())
                    .collect(Collectors.toList());
            logs.setActionStatus("SUCCESS");
            logs.setActionDetail("SUCCESS: query=" + query + ", category=" + category +
                    ", format=" + format + ", sortBy=" + sortBy +
                    ", 결과 개수=" + total);

            // 응답에 결과 + 전체 개수 같이 보내기 (Map)
            return Map.of(
                    "results", hits,
                    "total", total
            );
        }
        catch (Exception e) {
            logs.setActionStatus("FAIL");
            logs.setActionDetail("FAIL: query=" + query + ", category=" + category +
                    ", format=" + format + ", sortBy=" + sortBy + ", error=" + e.getMessage());
            throw e;
        }
        finally {
            // 로그 저장
            logs.setTimestamp(LocalDateTime.now());
            logService.saveLog(logs);
        }
    }

    public String stripHtmlTags(String html) {
        if (html == null) return null;
        // 기본적인 HTML 태그 제거 (단, <script>, <style> 등은 제거되지 않을 수 있음)
        return html.replaceAll("<[^>]*>", "");
    }

    // html 코드 <p> 같은거 없애는 코드인데 하이라이트 때문에 잠시 뺴둠
//    return response.hits().hits().stream()
//                .map(hit -> {
//        Map<String, Object> source = (Map<String, Object>) hit.source();
//        if (source.containsKey("body") && source.get("body") != null) {
//            Object bodyObj = source.get("body");
//            if (bodyObj instanceof String) {
//                String body = (String) bodyObj;
//                source.put("body", stripHtmlTags(body));
//            }
//        }
//        return source;
//    })
//            .collect(Collectors.toList());
//
//
//}
//
//public String stripHtmlTags(String html) {
//    if (html == null) return null;
//    // 기본적인 HTML 태그 제거
//    return html.replaceAll("<[^>]*>", "");
//}



// 한글 교정기 현재 사용 안됨
//    public String correctKoreanTypo(String text) {
//
//        String apiUrl = "http://localhost:5001/correct?text=" + URLEncoder.encode(text, StandardCharsets.UTF_8);
//        RestTemplate restTemplate = new RestTemplate();
//        Map<String, String> response = restTemplate.getForObject(apiUrl, Map.class);
//        return response.get("corrected");
//    }

}

		/*요청받은 페이지 번호와 페이지 크기를 기반으로
		Elasticsearch 검색에서 사용할 'from' 값을 계산합니다.
		'from'은 검색 결과에서 몇 번째 문서부터 가져올지를 의미합니다.
		예를 들어, page=2, size=10 이면 from = (2 - 1) * 10 = 10 이 되어
		11번째 문서부터 결과를 가져오게 됩니다.*/



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

