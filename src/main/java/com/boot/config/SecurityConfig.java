package com.boot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    	System.out.println("✅ SecurityConfig 적용됨");
    	http
        
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
            		.requestMatchers("/api/ping","/es/**","/hackernews/**","/api/stackoverflow/**","/questions","/reddit/**").permitAll() // api/ping 인증 없이 허용
                .anyRequest().authenticated() // 나머지 요청은 인증 필요
            )
            .httpBasic(Customizer.withDefaults()); // 기본 인증 방식 활성화

        return http.build();
    }
}
