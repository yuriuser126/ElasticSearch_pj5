package com.boot.z_config.security;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;


// 인증 실패 핸들러
@Component
@Slf4j
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException {
        
        log.error("로그인 실패: {}", exception.getMessage());
        
        // 로그인 실패 시 리다이렉트 (기존 코드와 유사하게 error 파라미터 추가)
        response.sendRedirect("/loginForm?error=invalid");
    }
}