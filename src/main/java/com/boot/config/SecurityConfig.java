package com.boot.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
	 private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);
	 
	
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    	logger.info("securityConfig 적용됨");
    	System.out.println("✅ SecurityConfig 적용됨");
    	http
        
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/ping", "/api/proxy/**").permitAll() // api/ping 인증 없이 허용
                .anyRequest().authenticated() // 나머지 요청은 인증 필요
            )
            .httpBasic(Customizer.withDefaults()); // 기본 인증 방식 활성화

        return http.build();
    }
}
