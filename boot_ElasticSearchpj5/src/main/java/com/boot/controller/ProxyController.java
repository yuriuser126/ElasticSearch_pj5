package com.boot.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/proxy")  // 프록시 관련 API 경로 기본 prefix 지정
public class ProxyController {

    @Autowired
    private RestTemplate restTemplate; // 외부 API 호출을 위한 RestTemplate 빈 주입

 // GET 요청으로 외부 API를 호출하고 결과를 반환하는 메서드
    @GetMapping("/external")
    public ResponseEntity<String> proxyExternalApi(@RequestParam String url) {
    	/*
         * 클라이언트에서 쿼리 파라미터 'url'로 호출하고자 하는 외부 API 주소를 받음
         * 서버가 이 URL로 직접 요청하여 응답을 받아 클라이언트에 다시 전달함
         * 이를 통해 브라우저 CORS 제한을 우회할 수 있음
         */
        try {
        	 // 외부 API 호출 (GET)
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
         // 받은 응답을 상태 코드와 함께 그대로 클라이언트에 전달
            return ResponseEntity
                    .status(response.getStatusCode())
                    .body(response.getBody());
        } catch (Exception e) {
        	// 호출 실패 시 500 에러와 메시지 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error proxying request: " + e.getMessage());
        }
    }
}
