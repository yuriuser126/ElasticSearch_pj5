package com.boot.z_config.security;

import java.util.HashMap;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.boot.user.dto.UserDTO;
import com.boot.user.service.UserService;
import com.boot.z_config.security.jwt.JwtTokenUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

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
     * Spring Security 컨텍스트에서 현재 인증된 사용자의 ID(일반적으로 username)를 가져옵니다.
     * 이 메소드는 static이므로 어디서든 직접 호출할 수 있습니다.
     * @return 인증된 사용자의 ID를 포함하는 Optional 객체. 사용자가 인증되지 않은 경우 empty.
     */
    public static Optional<String> getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return Optional.empty();
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails) {
            // UserDetails의 username을 반환합니다. PrincipalDetails가 UserDetails를 구현하므로 여기에 해당합니다.
            // PrincipalDetails에서 getUsername()이 user_email을 반환하도록 설정되어 있으므로, 사용자의 이메일이 ID가 됩니다.
            return Optional.of(((UserDetails) principal).getUsername());
        } else {
            // UserDetails가 아닌 다른 타입의 Principal(예: 소셜 로그인 후 처리 전)인 경우, toString()을 사용합니다.
            return Optional.of(principal.toString());
        }
    }

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
