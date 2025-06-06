package com.boot.Reddit.Service;

import java.util.List;
import java.util.Map;
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

import com.boot.Reddit.DTO.RedditItem;
import com.boot.Reddit.Repository.RedditRepository;

@Service
public class RedditService {

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
}
