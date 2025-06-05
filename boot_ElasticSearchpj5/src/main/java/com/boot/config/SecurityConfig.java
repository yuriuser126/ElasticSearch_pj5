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
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(SWAGGER_PERMIT_ALL_URLS).permitAll() // Swagger 관련 경로
                .requestMatchers(STATIC_HTML_PERMIT_ALL_URLS).permitAll() // static HTML 및 리소스 경로
                .requestMatchers( // 기존에 허용했던 다른 API 경로들
                        "/api/ping",
                        "/es/**",
                        "/hackernews/**",
                        "/api/stackoverflow/**",
                        "/questions",
                        "/api/convert/**",
                        "/test" // 이 경로는 MainController를 통해 index.html을 반환
                ).permitAll()
                .anyRequest().authenticated() // 나머지 모든 요청은 인증 필요
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}