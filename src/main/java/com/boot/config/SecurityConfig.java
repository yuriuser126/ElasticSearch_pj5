package com.boot.config;

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
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Swagger 및 정적 리소스 허용 경로
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

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        System.out.println("✅ SecurityConfig 적용됨 - 병합 설정");

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .authorizeHttpRequests(auth -> auth
                        // API 및 인증 없는 경로
                        .requestMatchers(
                                HttpMethod.POST, "/api/stackoverflow/fetch/elastic/one"
                        ).permitAll()
                        .requestMatchers(
                                HttpMethod.GET, "/api/stackoverflow/**"
                        ).permitAll()
                        .requestMatchers(
                                "/user/login", "/user/register", "/", "/auth/**", "/resources/**", "/js/**", "/css/**", "/images/**",
                                "/checkExistingSession", "/loginForm", "/joinForm", "/joinProc", "/mailConfirm", "/oauth2/**",
                                "/login/oauth2/**", "/oauth/naver", "/oauth/kakao", "/test/**", "/api/**", "/api/ping", "/es/**",
                                "/hackernews/**", "/api/stackoverflow/**", "/questions", "/api/trends"
                        ).permitAll()
                        .requestMatchers(SWAGGER_PERMIT_ALL_URLS).permitAll()
                        .requestMatchers(STATIC_HTML_PERMIT_ALL_URLS).permitAll()
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
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:3000");
        configuration.addAllowedOrigin("http://localhost:8485");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
