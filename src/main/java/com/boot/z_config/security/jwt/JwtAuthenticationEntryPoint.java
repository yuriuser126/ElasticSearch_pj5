package com.boot.z_config.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        
        // AJAX 요청인지 확인 (X-Requested-With 헤더로 판단)
        if ("XMLHttpRequest".equals(request.getHeader("X-Requested-With"))) {
            // AJAX 요청의 경우 401 상태 코드와 JSON 응답 반환 (기존 코드 유지)
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

            final Map<String, Object> body = new HashMap<>();
            body.put("status", HttpServletResponse.SC_UNAUTHORIZED);
            body.put("error", "Unauthorized");
            body.put("message", authException.getMessage());
            body.put("path", request.getServletPath());

            final ObjectMapper mapper = new ObjectMapper();
            mapper.writeValue(response.getOutputStream(), body);
        } else {
            // 일반 요청의 경우 로그인 페이지로 리다이렉트
            // 현재 요청 URL을 파라미터로 포함시켜 로그인 후 원래 페이지로 돌아갈 수 있게 함
            String redirectUrl = "/";
            String requestUri = request.getRequestURI();
            String queryString = request.getQueryString();
            
            // 현재 URL이 로그인 페이지가 아닌 경우에만 리다이렉트 URL 파라미터 추가
            if (requestUri != null && !requestUri.equals("/loginForm")) {
                redirectUrl += "?redirectUrl=" + requestUri;
                if (queryString != null) {
                    redirectUrl += "?" + queryString;
                }
            }
            
            response.sendRedirect(redirectUrl);
        }
    }
}