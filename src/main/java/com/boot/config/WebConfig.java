package com.boot.config;

import com.boot.z_config.UserAttributeInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // 이 클래스가 Spring 설정 클래스임을 명시
public class WebConfig implements WebMvcConfigurer {
    @Autowired
    private UserAttributeInterceptor userAttributeInterceptor;
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 모든 요청에 대해 사용자 정보를 모델에 추가하는 인터셉터 등록
        registry.addInterceptor(userAttributeInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(
                        "/resources/**",
                        "/css/**",
                        "/js/**",
                        "/images/**",
                        "/fonts/**",
                        "/favicon.ico",
                        "/error/**"
                );
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
    	/*
         * CORS 설정: 특정 경로(/api/**)에 대해 허용할 오리진(도메인)을 지정함
         * 로컬 React 개발 서버(예: localhost:3000)와 배포용 프론트 도메인을 추가
         * 필요에 따라 허용 메서드, 헤더 등을 세밀하게 조절 가능
         */
    	
        registry.addMapping("/api/**") // React 앱이 호출할 모든 API 경로에 대해 CORS 허용 (예: /api로 시작하는 모든 경로)
        		.allowedOrigins(
    				    "http://localhost:3000", // React 개발 서버의 주소 (정확한 포트 번호 확인)
                        "http://localhost:8485",
            		    "https://recall-final-front.onrender.com"	// 프론트 주소 (정확한 포트 번호 확인)
    				)

                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
                .allowedHeaders("*") // 모든 헤더 허용 (필요에 따라 구체화 가능)
//                .allowedHeaders("Authorization", "Content-Type") // JWT 인증을 위해 구체화
                .allowCredentials(true); // 자격 증명(쿠키, HTTP 인증 등) 허용
              
    }
    
    @Bean
    public RestTemplate restTemplate() {
    	// 외부 API 호출에 사용할 RestTemplate 빈 생성
        return new RestTemplate();
    }
    



    
}