package com.boot.StackOverflow.Service;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.boot.Elastic.ElasticService;
import com.boot.Mongodb.Model.Question;
import com.boot.Mongodb.Repository.QuestionRepository;
import com.boot.StackOverflow.DTO.StackOverflowQuestion;
import com.boot.StackOverflow.Repository.StackOverflowQuestionRepository;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;


@Service
public class StackOverflowService {
    @Value("${stackoverflow.apiKey}")
    private String apiKey;
    
    @Autowired
    private ElasticService elasticService;
    
    @Autowired
    private QuestionRepository questionRepository;  // ✅ 통합 저장소

    @Autowired
    private StackOverflowQuestionRepository repository;

    private final RestTemplate restTemplate = new RestTemplate();

    // tag = 태그검색용
    public Map<String, Object> fetchLatestQuestions(String tag) {
        String url = "https://api.stackexchange.com/2.3/questions"
                + "?order=desc"
                + "&sort=activity"
                + "&site=stackoverflow"
                + "&pagesize=1"
                + "&key=" + apiKey
                + "&filter=withbody"
                + "&tagged=" + tag;
        return restTemplate.getForObject(url, Map.class);
    }

    public void saveQuestions() {
        String url = "https://api.stackexchange.com/2.3/questions"
                + "?order=desc"
                + "&sort=activity"
                + "&site=stackoverflow"
                + "&pagesize=1000"
                + "&key=" + apiKey
                + "&filter=withbody";
        Map<String, Object> result = restTemplate.getForObject(url, Map.class);

        List<Map<String, Object>> items = (List<Map<String, Object>>) result.get("items");
        if (items != null && items.size() > 0) {

                List<StackOverflowQuestion> questions = items.stream().map(item -> {
                    StackOverflowQuestion q = new StackOverflowQuestion();
                    q.setQuestion_id(((Number) item.get("question_id")).intValue());
                    q.setTitle((String) item.get("title"));
                    q.setBody((String) item.get("body"));
                    q.setTags((List<String>) item.get("tags"));
                    q.setLink((String) item.get("link"));
                    q.setScore(item.get("score") != null ? ((Number) item.get("score")).intValue() : null);
                    q.setAnswer_count(item.get("answer_count") != null ? ((Number) item.get("answer_count")).intValue() : null);
                    q.setView_count(item.get("view_count") != null ? ((Number) item.get("view_count")).intValue() : null);
                    return q;
                }).collect(Collectors.toList());

                repository.saveAll(questions);

        }
    }
    
    //    Elastic search 저장용
    //최신 인기 질문 10개를 가져오는 요청
    public void saveTenQuestionToElastic() {
        Map<String, Object> result = restTemplate.getForObject(
                "https://api.stackexchange.com/2.3/questions?order=desc&sort=activity&site=stackoverflow&pagesize=10&key=" + apiKey + "&filter=withbody",
                Map.class);

        List<Map<String, Object>> items = (List<Map<String, Object>>) result.get("items");

        if (items != null && !items.isEmpty()) {
        	List<StackOverflowQuestion> questions = new ArrayList<>();  // 리스트 선언
        	for (Map<String, Object> item : items) {
                StackOverflowQuestion q = new StackOverflowQuestion();
                q.setQuestion_id(((Number) item.get("question_id")).intValue());
                q.setTitle((String) item.get("title"));
                q.setBody((String) item.get("body"));
                q.setTags((List<String>) item.get("tags"));
                q.setLink((String) item.get("link"));
                q.setScore(item.get("score") != null ? ((Number) item.get("score")).intValue() : null);
                q.setAnswer_count(item.get("answer_count") != null ? ((Number) item.get("answer_count")).intValue() : null);
                q.setView_count(item.get("view_count") != null ? ((Number) item.get("view_count")).intValue() : null);
                q.setSource("StackOverflow");
                questions.add(q);  // 리스트에 추가

            }
        	
        	try {
            	elasticService.saveTen(questions);  // 리스트 한번에 저장
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    
    public void saveQuestionsToMongo() {
        String url = "https://api.stackexchange.com/2.3/questions"
                + "?order=desc"
                + "&sort=activity"
                + "&site=stackoverflow"
                + "&pagesize=10"
                + "&key=" + apiKey
                + "&filter=withbody";

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<Map<String, Object>>() {}
        );

        Map<String, Object> result = response.getBody();

        if (result == null) return;

        List<Map<String, Object>> items = (List<Map<String, Object>>) result.get("items");

        if (items != null && !items.isEmpty()) {
            List<Question> questions = items.stream().map(item -> {
                Question q = new Question();
                q.setTitle((String) item.get("title"));
                q.setBody((String) item.get("body"));
                Map<String, Object> owner = (Map<String, Object>) item.get("owner");
                q.setAuthor(owner != null ? (String) owner.get("display_name") : "StackOverflow");
                q.setLink((String) item.get("link"));
                q.setTags((List<String>) item.get("tags"));
                q.setSource("StackOverflow");
                return q;
            }).collect(Collectors.toList());

            questionRepository.saveAll(questions);
        }
    }
    

}
