
package com.boot.config;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.boot.z_config.security.jwt.JwtAuthenticationFilter;
import com.boot.z_config.security.jwt.JwtAuthenticationEntryPoint;
import com.boot.z_config.security.jwt.JwtAuthenticationSuccessHandler;
import com.boot.z_config.security.OAuth2AuthenticationSuccessHandler;
import com.boot.z_config.security.CustomUserDetailsService;
import com.boot.z_config.socialLogin.CustomOAuth2UserService;
import com.boot.z_config.security.CustomAuthenticationFailureHandler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {


    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private JwtAuthenticationSuccessHandler jwtAuthenticationSuccessHandler;

    @Autowired
    private OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private CustomAuthenticationFailureHandler failureHandler;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
    

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
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .authorizeHttpRequests(auth -> auth
                		.requestMatchers(SWAGGER_PERMIT_ALL_URLS).permitAll() // Swagger 관련 경로
                        .requestMatchers(STATIC_HTML_PERMIT_ALL_URLS).permitAll() // static HTML 및 리소스 경로
                        .requestMatchers(
                                "/user/login", "/user/register", "/", "/auth/**", "/resources/**", "/js/**", "/css/**", "/images/**",
                                "/checkExistingSession", "/loginForm", "/joinForm", "/joinProc", "/mailConfirm", "/oauth2/**",
                                "/favicon.ico", "/reddit/**", "/api/convert/**", 
                                "/login/oauth2/**", "/oauth/naver", "/oauth/kakao", "/test/**", "/api/**", "/api/ping","/es/**","/hackernews/**","/api/stackoverflow/**","/questions","/api/trends"

                        ).permitAll()
                        .requestMatchers("/user/me").authenticated()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/loginForm")
                        .loginProcessingUrl("/user/login")
                        .usernameParameter("userId")
                        .passwordParameter("userPw")
                        .successHandler(jwtAuthenticationSuccessHandler)
                        .failureHandler(failureHandler)
                )
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/loginForm")
                        .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                        .successHandler(oAuth2AuthenticationSuccessHandler)
                )
                .logout(logout -> logout
                        .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                        .logoutSuccessUrl("/loginForm")
                        .deleteCookies("jwt_token")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                )
                .userDetailsService(userDetailsService)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
//    	 		.httpBasic(Customizer.withDefaults()); // 기본 인증 방식 (Postman/curl 용)

        return http.build();



    }

}



