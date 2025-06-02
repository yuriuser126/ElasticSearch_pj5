package com.boot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // 이 클래스가 Spring 설정 클래스임을 명시
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // React 앱이 호출할 모든 API 경로에 대해 CORS 허용 (예: /api로 시작하는 모든 경로)
//        registry.addMapping("/**") // React 앱이 호출할 모든 API 경로 + db 불러오는 경로(recall_list 등)

        		.allowedOrigins(
        				"http://localhost:3000" // React 개발 서버의 주소 (정확한 포트 번호 확인)
                		, "https://recall-final-front.onrender.com"	// 프론트 주소 (정확한 포트 번호 확인)
        				)

                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
//                .allowedHeaders("*") // 모든 헤더 허용 (필요에 따라 구체화 가능)
                .allowedHeaders("Authorization", "Content-Type") // JWT 인증을 위해 구체화
                .allowCredentials(true); // 자격 증명(쿠키, HTTP 인증 등) 허용
              
    }
    



    
}