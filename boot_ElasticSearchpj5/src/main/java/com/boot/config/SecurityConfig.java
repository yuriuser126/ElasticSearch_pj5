package com.boot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String[] SWAGGER_PERMIT_ALL_URLS = {
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/swagger-resources/**",
            "/webjars/**"
    };

    // 추가: static 폴더 내의 모든 HTML 파일 또는 특정 HTML 파일 허용
    private static final String[] STATIC_HTML_PERMIT_ALL_URLS = {
            "/*.html",          // 루트 경로의 모든 HTML 파일 (예: /index.html, /openapi-converter.html)
            "/css/**",          // static/css 폴더의 모든 파일 (필요하다면)
            "/js/**"            // static/js 폴더의 모든 파일 (필요하다면)
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {


    	System.out.println("✅ SecurityConfig 적용됨 - Swagger 및 static HTML 경로 허용 시도");
    	 http
    	 .cors(Customizer.withDefaults())
         .csrf(csrf -> csrf.disable()) // CSRF 비활성화
//         .csrf(AbstractHttpConfigurer::disable)
         .authorizeHttpRequests(auth -> auth
        	 .requestMatchers(SWAGGER_PERMIT_ALL_URLS).permitAll() // Swagger 관련 경로
             .requestMatchers(STATIC_HTML_PERMIT_ALL_URLS).permitAll() // static HTML 및 리소스 경로
             .requestMatchers("/api/ping", "/favicon.ico",
//            		 "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html",
            		 "/api/es/**","/hackernews/**","/api/stackoverflow/**","/questions",
            	     "/api/convert/**",
                     "/test", "/reddit/**").permitAll() // 이 경로는 MainController를 통해 index.html을 반환
            	       // 인증 없이 허용
             .anyRequest().authenticated() // 그 외는 인증 필요
         )
         .httpBasic(Customizer.withDefaults()); // 기본 인증 방식 (Postman/curl 용)

    
     return http.build();
    }

}



