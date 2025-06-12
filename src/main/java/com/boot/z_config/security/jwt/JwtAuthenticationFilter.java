package com.boot.z_config.security.jwt;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.boot.user.dto.UserDTO;
import com.boot.z_config.security.CustomUserDetailsService;
import com.boot.z_config.security.PrincipalDetails;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
//        logger.info("[JwtAuthenticationFilter] shouldNotFilter path: {}", path);
        // REACT_|| path.equals("/user/login") || path.equals("/user/register") 추가 했습니다
        return path.equals("/login") || path.equals("/loginForm") || path.equals("/joinForm")
            || path.startsWith("/resources/") || path.startsWith("/js/") || path.startsWith("/css/")
            || path.startsWith("/images/") || path.equals("/user/login") || path.equals("/user/register");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        logger.info("JwtFilter"+request);
//        logger.info("[JwtAuthenticationFilter] 실행: {}", request.getRequestURI());
        try {
            // 쿠키에서 JWT 토큰 가져오기
            String jwt = getJwtFromCookie(request);
//            logger.info("[JwtAuthenticationFilter] 추출된 JWT: {}", jwt);
            if (StringUtils.hasText(jwt) && jwtTokenUtil.validateToken(jwt)) {
                String username = jwtTokenUtil.getUsernameFromToken(jwt);
                // 이미 인증된 사용자가 아닌 경우에만 인증 처리
                if (SecurityContextHolder.getContext().getAuthentication() == null) {

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//                    logger.info("[JwtAuthenticationFilter] UserDetails 로드 완료: {}", userDetails.getUsername());
                    // 인증 정보 설정
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    // 사용자 정보를 request 속성에 저장
                    if (userDetails instanceof PrincipalDetails) {
                        UserDTO user = ((PrincipalDetails) userDetails).getUser();
                        request.setAttribute("user", user);
                    }
                }
            } else {
                // REACT_ JWT가 없거나 유효하지 않으면 인증정보 완전 초기화하도록
                SecurityContextHolder.clearContext(); 
            }
        } catch (Exception ex) {
        }
        filterChain.doFilter(request, response);
    }
    
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
}
