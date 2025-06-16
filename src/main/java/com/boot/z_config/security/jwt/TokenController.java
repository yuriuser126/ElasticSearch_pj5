package com.boot.z_config.security.jwt;

import com.boot.z_config.security.jwt.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

// 프론트 표현용임
@Controller
public class TokenController {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * 토큰 정보를 가져오는 API
     */
    @GetMapping("/api/token/info")
    @ResponseBody
    public ResponseEntity<?> getTokenInfo(HttpServletRequest request) {
        try {
            // 쿠키에서 토큰 추출
            String token = extractTokenFromCookie(request);
            if (token == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "토큰을 찾을 수 없습니다.");
                return ResponseEntity.ok(response);
            }

            // 토큰 만료 시간 추출
            long expirationTime = jwtTokenUtil.getClaimFromToken(token, claims -> claims.getExpiration().getTime());
            
            // 토큰 생성 시간 추출
            long issuedAt = jwtTokenUtil.getClaimFromToken(token, claims -> claims.getIssuedAt().getTime());
            
            // 총 유효 시간 (밀리초)
            long totalValidTime = expirationTime - issuedAt;
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("expiryTime", expirationTime);
            response.put("issuedAt", issuedAt);
            response.put("totalValidTime", totalValidTime);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "토큰 정보를 가져오는 중 오류가 발생했습니다.");
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 토큰 연장 API
     */
    @PostMapping("/api/token/extend")
    @ResponseBody
    public ResponseEntity<?> extendToken(HttpServletRequest request, HttpServletResponse response) {
        try {
            // 현재 인증 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null) {
                Map<String, Object> result = new HashMap<>();
                result.put("success", false);
                result.put("message", "인증 정보를 찾을 수 없습니다.");
                return ResponseEntity.ok(result);
            }

            // 새 토큰 생성
            String newToken = jwtTokenUtil.generateToken(authentication);
            
            // 토큰 만료 시간 추출
            long expirationTime = jwtTokenUtil.getClaimFromToken(newToken, claims -> claims.getExpiration().getTime());
            
            // 토큰 생성 시간 추출
            long issuedAt = jwtTokenUtil.getClaimFromToken(newToken, claims -> claims.getIssuedAt().getTime());
            
            // 총 유효 시간 (밀리초)
            long totalValidTime = expirationTime - issuedAt;

            // 쿠키에 새 토큰 저장
            Cookie jwtCookie = new Cookie("jwt_token", newToken);
            jwtCookie.setPath("/");
            jwtCookie.setHttpOnly(true);
            jwtCookie.setMaxAge(30 * 60);
            
            // HTTPS 환경에서는 Secure 플래그 추가
            if (request.isSecure()) {
                jwtCookie.setSecure(true);
            }
            
            response.addCookie(jwtCookie);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("newExpiryTime", expirationTime);
            result.put("issuedAt", issuedAt);
            result.put("totalValidTime", totalValidTime);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "토큰 연장 중 오류가 발생했습니다.");
            return ResponseEntity.ok(result);
        }
    }

    /**
     * 쿠키에서 토큰 추출
     */
    private String extractTokenFromCookie(HttpServletRequest request) {
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