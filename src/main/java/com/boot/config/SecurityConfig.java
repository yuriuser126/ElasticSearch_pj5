//package com.boot.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//    	System.out.println("✅ SecurityConfig 적용됨");
//    	http
//
//            .csrf(csrf -> csrf.disable())
//            .authorizeHttpRequests(auth -> auth
//                .requestMatchers("/api/ping","/es/**","/hackernews/**","/api/stackoverflow/**","/questions","/api/trends").permitAll() // api/ping 인증 없이 허용
//                .anyRequest().authenticated() // 나머지 요청은 인증 필요
//            )
//            .httpBasic(Customizer.withDefaults()); // 기본 인증 방식 활성화
//
//        return http.build();
//    }
//}
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

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/user/login", "/user/register", "/", "/auth/**", "/resources/**", "/js/**", "/css/**", "/images/**",
                                "/checkExistingSession", "/loginForm", "/joinForm", "/joinProc", "/mailConfirm", "/oauth2/**",
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

        return http.build();


    }
}
