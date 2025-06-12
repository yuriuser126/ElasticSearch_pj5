package com.boot.StackOverflow.Service;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.boot.StackOverflow.DTO.StackOverflowQuestion;
import com.boot.StackOverflow.Repository.StackOverflowQuestionRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class StackOverflowService {
    @Value("${stackoverflow.apiKey}")
    private String apiKey;

    @Autowired
	public StackOverflowQuestionRepository repository;

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
        // 여러 페이지의 결과를 모두 담을 최종 리스트 초기화
        List<StackOverflowQuestion> allQuestions = new ArrayList<>();
        final int TOTAL_PAGES_TO_FETCH = 5; // 5 페이지 = 500개 데이터

        System.out.println("Fetching " + (TOTAL_PAGES_TO_FETCH * 100) + " questions from Stack Overflow...");

        // 1페이지부터 5페이지까지 반복해서 API 호출
        for (int page = 1; page <= TOTAL_PAGES_TO_FETCH; page++) {
            
            System.out.println("Fetching page " + page + "/" + TOTAL_PAGES_TO_FETCH + "...");

            String url = "https://api.stackexchange.com/2.3/questions"
                    + "?order=desc"
                    + "&sort=activity"
                    + "&site=stackoverflow"
                    + "&pagesize=100"      // 한 번에 100개씩
                    + "&page=" + page      // 현재 반복문의 페이지 번호를 사용
                    + "&key=" + apiKey
                    + "&filter=withbody";
            
            // API 호출 및 결과 파싱
            Map<String, Object> result = restTemplate.getForObject(url, Map.class);
            List<Map<String, Object>> items = (List<Map<String, Object>>) result.get("items");

            if (items != null && !items.isEmpty()) {
            	// JSON 데이터를 DTO 객체로 변환
                List<StackOverflowQuestion> questionsFromThisPage = items.stream().map(item -> {
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

                // 현재 페이지 결과를 최종 리스트에 누적
                allQuestions.addAll(questionsFromThisPage);
            }

            // API 과호출 방지를 위한 약간의 딜레이
            try {
                Thread.sleep(100); // 0.1초 딜레이
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.err.println("Thread interrupted during sleep");
            }
        }

        // 모든 데이터를 DB에 한 번에 저장
        if (!allQuestions.isEmpty()) {
            repository.deleteAll();
            repository.saveAll(allQuestions);
            System.out.println("[SUCCESS] Total " + allQuestions.size() + " questions saved.");
        } else {
            System.out.println("[INFO] No questions found to save.");
        }
    }
    
    
/*
    public void saveQuestions() {
    	
        String url = "https://api.stackexchange.com/2.3/questions"
                + "?order=desc"
                + "&sort=activity"
                + "&site=stackoverflow"
                + "&pagesize=100"
//                + "&page=" + 5
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
    public void deleteAllQuestions() {
    	repository.deleteAll();
    }
    */
    /**
     * Top 10 키워드 테스트를 위한 더미 데이터를 생성하여 저장합니다.
     */
//    public void addDummyData() {
//    	System.out.println("==================================================");
//        System.out.println("[START] addDummyData: 더미 데이터 생성을 시작합니다.");
//        
//        repository.deleteAll(); // 기존 데이터 모두 삭제
//
//        Random random = new Random();
//        List<String> sampleTags = Arrays.asList(
//            "java", "python", "javascript", "react", "spring", "spring-boot",
//            "elasticsearch", "mongodb", "docker", "kubernetes", "aws", "nodejs"
//        );
//
//        List<StackOverflowQuestion> dummyQuestions = new ArrayList<>();
//        for (int i = 0; i < 1000; i++) {
//            StackOverflowQuestion q = new StackOverflowQuestion();
//            
//            // DTO의 모든 필드에 맞춰 데이터를 채웁니다.
//            q.setQuestion_id(i + 1); // @Id 필드
//            q.setTitle("Dummy Title " + (i + 1));
//            q.setBody("This is the body content for dummy question #" + (i + 1) + " about various technologies.");
//            q.setLink("http://stackoverflow.com/questions/" + (i + 1));
//            q.setScore(random.nextInt(500));
//            q.setAnswer_count(random.nextInt(50));
//            q.setView_count(random.nextInt(10000));
//            
//            // 태그를 무작위로 1~3개 선택하여 추가
//            List<String> tags = new ArrayList<>();
//            int tagCount = random.nextInt(3) + 1;
//            for(int j = 0; j < tagCount; j++) {
//                String randomTag = sampleTags.get(random.nextInt(sampleTags.size()));
//                if (!tags.contains(randomTag)) {
//                    tags.add(randomTag);
//                }
//            }
//            q.setTags(tags);
//
//            dummyQuestions.add(q);
//        }
//
//        repository.saveAll(dummyQuestions); // 생성된 더미 데이터를 MongoDB에 저장
//        System.out.println("[SUCCESS] addDummyData: 더미 데이터 " + dummyQuestions.size() + "개를 MongoDB에 성공적으로 저장했습니다.");
//        System.out.println("==================================================");
//    }
}
