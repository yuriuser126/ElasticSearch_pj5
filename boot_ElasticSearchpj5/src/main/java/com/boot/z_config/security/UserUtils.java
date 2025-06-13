package com.boot.z_config.security;

import java.util.HashMap;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.boot.user.dto.UserDTO;
import com.boot.user.service.UserService;
import com.boot.z_config.security.jwt.JwtTokenUtil;

/**
 * 사용자 정보 관련 유틸리티 클래스
 */
@Component
public class UserUtils {
    
    private static final Logger logger = LoggerFactory.getLogger(UserUtils.class);
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Autowired
    private UserService userService;
    
    /**
     * HttpServletRequest에서 사용자 정보를 추출
     * 
     * @param request HTTP 요청
     * @return 사용자 정보(UserDTO), 인증된 사용자가 없으면 null
     */
    public UserDTO extractUserFromRequest(HttpServletRequest request) {
        // 1. Request 속성에서 사용자 정보 확인 (JwtAuthenticationFilter에서 설정됨)
        UserDTO userFromRequest = (UserDTO) request.getAttribute("user");
        if (userFromRequest != null && isUserComplete(userFromRequest)) {
            logger.debug("Request 속성에서 사용자 정보 찾음: {}", userFromRequest.getUserId());
            return userFromRequest;
        }
        
        // 2. SecurityContext에서 인증 정보 확인
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && 
            authentication.getPrincipal() instanceof PrincipalDetails) {
            PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
            UserDTO user = principalDetails.getUser();
            if (isUserComplete(user)) {
                logger.debug("SecurityContext에서 사용자 정보 찾음: {}", user.getUserId());
                return user;
            }
        }
        
        // 3. JWT 토큰에서 사용자 정보 확인
        String jwtToken = getJwtFromCookie(request);
        if (jwtToken != null) {
            try {
                UserDTO userFromToken = jwtTokenUtil.getUserFromToken(jwtToken);
                if (userFromToken != null) {
                    logger.debug("JWT 토큰에서 사용자 정보 찾음: {}", userFromToken.getUserId());
                    
                    // 토큰에서 가져온 정보가 불완전하면 데이터베이스에서 조회
                    if (!isUserComplete(userFromToken)) {
                        try {
                            HashMap<String, String> param = new HashMap<>();
                            param.put("userId", userFromToken.getUserId());
                            UserDTO freshUser = userService.getUserInfo(param);
                            if (freshUser != null) {
                                logger.debug("데이터베이스에서 사용자 정보 조회 성공: {}", freshUser.getUserId());
                                return freshUser;
                            }
                        } catch (Exception e) {
                            logger.error("데이터베이스에서 사용자 정보를 조회하는 중 오류 발생: {}", e.getMessage());
                        }
                    }
                    
                    return userFromToken;
                }
            } catch (Exception e) {
                logger.error("JWT 토큰에서 사용자 정보를 추출하는 중 오류 발생: {}", e.getMessage());
            }
        }
        
        logger.debug("사용자 정보를 찾을 수 없음");
        return null;
    }
    
    /**
     * 사용자 정보가 완전한지 확인
     * 
     * @param user 사용자 정보
     * @return 사용자 정보가 완전하면 true, 아니면 false
     */
    private boolean isUserComplete(UserDTO user) {
        return user != null && 
               user.getUserId() != null && 
               user.getUserName() != null && 
               user.getUserEmail() != null;
    }
    
    /**
     * 쿠키에서 JWT 토큰 추출
     * 
     * @param request HTTP 요청
     * @return JWT 토큰, 없으면 null
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
}
