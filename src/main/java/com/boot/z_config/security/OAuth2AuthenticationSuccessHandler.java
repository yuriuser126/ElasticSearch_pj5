package com.boot.z_config.security;

import com.boot.z_config.security.jwt.JwtTokenUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.ServletException;
import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler
{
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {
        // 토큰생성
        String token = jwtTokenUtil.generateToken(authentication);
        System.out.println("✅ JWT 생성 완료: " + token);

        Cookie jwtCookie = new Cookie("jwt_token", token);
        jwtCookie.setPath("/");
        jwtCookie.setHttpOnly(true);
        jwtCookie.setMaxAge(1 * 24 * 60 * 60);

        
        if (request.isSecure()) {
            jwtCookie.setSecure(true);
        }

        response.addCookie(jwtCookie);
//        response.sendRedirect("/");
        response.sendRedirect("http://localhost:3000");
        
       
    }
        
   
    }
