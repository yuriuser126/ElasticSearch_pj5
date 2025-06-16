package com.boot.Reddit.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.boot.Elastic.ElasticService;
import com.boot.Reddit.DTO.RedditItem;
import com.boot.Reddit.Repository.RedditRepository;
import com.boot.StackRedditQuestion.Model.StackRedditQuestion;
import com.boot.StackRedditQuestion.Repository.StackRedditQuestionRepository;
import com.boot.Mongodb.Model.Question;
import com.boot.Mongodb.Repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class RedditService {
	
	 @Autowired
    private ElasticService elasticService;
	 
   @Autowired
    private StackRedditQuestionRepository StackRedditQuestionRepository;  // ✅ 통합 저장소

	// 설정파일(application.properties)에서 Reddit API 인증정보 읽어옴
    @Value("${reddit.client.id}")
    private String clientId;

    @Value("${reddit.client.secret}")
    private String clientSecret;

    @Value("${reddit.user.agent}")
    private String userAgent;

    // MongoDB 저장소 의존성 주입
    @Autowired
    private RedditRepository redditRepository; 

    // 외부 API 요청 도구
    private final RestTemplate restTemplate = new RestTemplate();

    
    /**
     * 1. Reddit API에 OAuth2 방식으로 Access Token 요청
     * -> client_id, client_secret로 인증
     */
    public String getAccessToken() {
    	 try {
    	// 토큰 발급 URL
        String url = "https://www.reddit.com/api/v1/access_token";
        // Basic 인증 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(clientId, clientSecret);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        // Reddit 요구 사항: User-Agent 필수
        headers.set("User-Agent", userAgent);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        // 클라이언트 자격증명 방식
        body.add("grant_type", "client_credentials");  

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        
        // POST 요청
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        
        // 응답에서 access_token만 추출해서 반환
        Map<String, Object> responseBody = response.getBody();
        System.out.println("Access Token: " + responseBody.get("access_token"));
        return (String) responseBody.get("access_token");
    	 } catch (Exception e) {
			 System.out.println("❌ Token Error: " + e.getMessage());
		        e.printStackTrace();
		        return null;
		    }   	 
    }

    /**
     * 2. Subreddit의 핫 게시글 리스트 가져오기
     * -> 발급받은 토큰을 Authorization 헤더에 포함
     */
    public Map<String, Object> fetchHotPosts(String subreddit, int limit) {
    	// 토큰 발급받기
        String token = getAccessToken();
        //게시글 가져올 URL (limit: 몇 개까지)
//        String url = "https://outh.reddit.com/r/" + subreddit + "/hot.json?limit=" + limit;
        String url = "https://www.reddit.com/r/" + subreddit + "/hot.json?limit=" + limit;

        HttpHeaders headers = new HttpHeaders();
//        headers.set("Authorization", "Bearer " + token); // 토큰 포함
        headers.set("User-Agent", userAgent); // Reddit 필수 헤더

        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        //GET 방식
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        
        //응답 결과(JSON 형태)를 반환
        return response.getBody();
    }
    
    
    /**
     * 3. 가져온 게시글 데이터 → RedditItem 객체로 매핑 후 MongoDB에 저장
     * Reddit 데이터 저장 메서드는 기존과 동일
     */
    public void fetchAndSaveHotPosts(String subreddit, int limit) {
    	// 핫 게시글 요청
        Map<String, Object> response = fetchHotPosts(subreddit, limit);
        if (response == null) return;
        // 응답 없으면 종료
        
        // data 필드 꺼내기 + 게시글 목록
        Map<String, Object> data = (Map<String, Object>) response.get("data");
        List<Map<String, Object>> children = (List<Map<String, Object>>) data.get("children");
        if (children == null || children.isEmpty()) return;
        
        // 게시글 하나씩 RedditItem 객체로 변환
        List<RedditItem> items = children.stream().map(child -> {
            Map<String, Object> postData = (Map<String, Object>) child.get("data");
            RedditItem item = new RedditItem();
            item.setId((String) postData.get("id"));
            item.setTitle((String) postData.get("title"));
            item.setSubreddit(subreddit);
            item.setUrl((String) postData.get("url"));
            Object scoreObj = postData.get("score");
            if (scoreObj instanceof Number) {
            	// 정수로 변환해서 저장
                item.setScore(((Number) scoreObj).intValue());
            }
            return item;
        }).collect(Collectors.toList());
     // MongoDB에 저장
        redditRepository.saveAll(items);
    }

    // 4. DB에 저장된 전체 RedditItem 조회 메서드
    public List<RedditItem> getAllItems() {
        return redditRepository.findAll();
    }
    
    
    public void saveTenHotPostToElastic(String subreddit) throws IOException {
        Map<String, Object> response = fetchHotPosts(subreddit, 10);
        if (response == null) return;

        Map<String, Object> data = (Map<String, Object>) response.get("data");
        List<Map<String, Object>> children = (List<Map<String, Object>>) data.get("children");
        if (children == null || children.isEmpty()) return;
        
     // 1. RedditItem 객체들을 담을 리스트 생성
        List<RedditItem> items = new ArrayList<>();

        // 2. children 리스트 전체를 반복하면서 RedditItem 객체 생성 및 리스트에 추가
        for (Map<String, Object> child : children) {
            Map<String, Object> postData = (Map<String, Object>) child.get("data");
            RedditItem item = new RedditItem();
            item.setId((String) postData.get("id"));
            item.setTitle((String) postData.get("title"));
            item.setSubreddit(subreddit);
            item.setUrl((String) postData.get("url"));
            Object scoreObj = postData.get("score");
            if (scoreObj instanceof Number) {
                item.setScore(((Number) scoreObj).intValue());
            }
            items.add(item);
        }

        // 3. 10개를 저장하는 메서드 호출 (파라미터가 리스트여야 함)
        try {
            elasticService.saveTenRedditItem(items);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * Reddit API에서 핫 게시글 가져와 Question 객체로 변환 후 MongoDB에 저장
     */
    public void fetchAndSaveHotPostsAsQuestions(String keyword, int limit) {
        Map<String, Object> response = fetchHotPosts(keyword, limit);
        if (response == null) return;

        Map<String, Object> data = (Map<String, Object>) response.get("data");
        List<Map<String, Object>> children = (List<Map<String, Object>>) data.get("children");
        if (children == null || children.isEmpty()) return;

        List<StackRedditQuestion> questions = children.stream().map(child -> {
            Map<String, Object> postData = (Map<String, Object>) child.get("data");
            StackRedditQuestion q = new StackRedditQuestion();
            q.setTitle((String) postData.get("title"));
            
            // body 처리 및 길이 제한 적용
            String body = Optional.ofNullable((String) postData.get("selftext"))
                    .filter(s -> !s.trim().isEmpty())
                    .orElse("“자세한 내용은 원문 사이트에서 확인하세요”");
			if (body.length() > 1000) {
			  body = body.substring(0, 1000) + "...";
			}
            q.setBody(body);// Reddit 본문 필드명
            
            q.setAuthor((String) postData.get("author"));
            q.setLink("https://reddit.com" + postData.get("permalink"));
            q.setTags(null); // Reddit은 태그가 없으므로 null 처리하거나 다른 방법으로 설정 가능
            q.setSource("Reddit");
            return q;
        }).collect(Collectors.toList());

        StackRedditQuestionRepository.saveAll(questions);
    }
}

