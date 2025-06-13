package com.boot.z_config.security.jwt;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.boot.user.dto.BasicUserDTO;
import com.boot.user.dto.UserDTO;

/**
 * 모든 요청에 대해 JWT 토큰에서 사용자 정보를 추출하여 request 속성으로 설정하는 필터
 * 이 필터는 JwtAuthenticationFilter보다 먼저 실행되어야 함
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10) // JwtAuthenticationFilter보다 높은 우선순위
public class UserAttributeFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(UserAttributeFilter.class);
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
//    @Autowired
//    private JwtTokenCache tokenCache;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        logger.info("UserAttributeFilter 초기화");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        
        try {
            // 정적 리소스 요청은 처리하지 않음
            String requestURI = httpRequest.getRequestURI();
            if (isStaticResource(requestURI)) {
                chain.doFilter(request, response);
                return;
            }
            
            // JWT 토큰에서 사용자 정보 추출
            String token = getJwtFromCookie(httpRequest);
            if (token != null && jwtTokenUtil.validateToken(token)) {
                // 토큰에서 사용자 정보 추출
                UserDTO user = jwtTokenUtil.getUserFromToken(token);
                
                if (user != null) {
                	BasicUserDTO safeUser = new BasicUserDTO(user);
                    // 사용자 정보를 request 속성으로 설정
                    httpRequest.setAttribute("user", safeUser);
                    logger.debug("사용자 정보를 request 속성으로 설정: {}", user.getUserId());
                }
            }
        } catch (Exception e) {
            logger.error("JWT 토큰에서 사용자 정보를 추출하는 중 오류 발생", e);
            // 오류가 발생해도 필터 체인은 계속 진행
        }
        
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        logger.info("UserAttributeFilter 종료");
    }
    
    /**
     * 쿠키에서 JWT 토큰 추출
     */
    private String getJwtFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
    
    /**
     * 정적 리소스 요청인지 확인
     */
    private boolean isStaticResource(String requestURI) {
        return requestURI.startsWith("/resources/") || 
               requestURI.startsWith("/css/") || 
               requestURI.startsWith("/js/") || 
               requestURI.startsWith("/images/") || 
               requestURI.startsWith("/fonts/") || 
               requestURI.startsWith("/favicon.ico");
    }
}