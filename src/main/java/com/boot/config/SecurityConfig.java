package com.boot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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

    private static final String[] STATIC_HTML_PERMIT_ALL_URLS = {
        "/*.html", 
        "/css/**", 
        "/js/**",
        "/favicon.ico"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    	System.out.println("✅ SecurityConfig 적용됨 - API 경로 허용 시도");

        return http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable()) // CSRF 비활성화
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/stackoverflow/fetch/elastic/one").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/stackoverflow/**").permitAll()
                .requestMatchers(SWAGGER_PERMIT_ALL_URLS).permitAll()
                .requestMatchers(STATIC_HTML_PERMIT_ALL_URLS).permitAll()
                .anyRequest().permitAll()
//                .anyRequest().authenticated() // ✅ 이것만 남기세요!
            )
            .httpBasic(Customizer.withDefaults())
            .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:3000"); // React origin
        configuration.addAllowedOrigin("http://localhost:8485"); // 현재 서버 포트도 추가
        configuration.addAllowedMethod("*"); // 모든 HTTP 메서드 허용
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}