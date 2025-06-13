package com.boot.z_config.security.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        // JWT 토큰 생성
        String token = jwtTokenUtil.generateToken(authentication);
        
//        System.out.println("token : " + token);
        
        // JWT 토큰을 쿠키에 저장
        Cookie jwtCookie = new Cookie("jwt_token", token);
        jwtCookie.setPath("/"); // 모든 경로에서 접근 가능
        jwtCookie.setHttpOnly(true); // JavaScript에서 접근 불가능하게 설정
        
        // 브라우저에 토큰 저장 - 초 단위로 수정
        // 30분 = 30 * 60초
        jwtCookie.setMaxAge(30 * 60); // 올바른 설정 (30분, 초 단위)
//        jwtCookie.setMaxAge(10); // 올바른 설정 (30분, 초 단위)

        // HTTPS 환경에서는 Secure 플래그 추가
        if (request.isSecure()) {
            jwtCookie.setSecure(true);
        }

        // 최신 서블릿 컨테이너에서 지원하는 경우 SameSite 속성 추가
        try {
            ((ServletRequest) jwtCookie).setAttribute("SameSite", "Lax");
        } catch (Exception e) {
            // SameSite 속성을 지원하지 않는 서블릿 컨테이너에서는 무시
        }

        response.addCookie(jwtCookie);

        // 홈 페이지로 리다이렉트
        getRedirectStrategy().sendRedirect(request, response, "/");
    }
}