package com.boot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    	System.out.println("✅ SecurityConfig 적용됨");
    	 http
    	 .cors(Customizer.withDefaults())
         .csrf(csrf -> csrf.disable()) // CSRF 비활성화
         .authorizeHttpRequests(auth -> auth
             .requestMatchers("/api/ping", "/favicon.ico",
            		 "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html",
            	     "/es/**","/hackernews/**","/api/stackoverflow/**","/questions").permitAll()  // 인증 없이 허용
             .anyRequest().authenticated() // 그 외는 인증 필요
         )
         .httpBasic(Customizer.withDefaults()); // 기본 인증 방식 (Postman/curl 용)


     return http.build();
    }
}





