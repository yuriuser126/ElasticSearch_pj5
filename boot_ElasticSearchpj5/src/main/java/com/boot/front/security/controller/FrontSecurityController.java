package com.boot.front.security.controller;

import com.boot.user.dto.UserDTO;
import com.boot.user.service.UserService;
import com.boot.z_config.security.PrincipalDetails;
import com.boot.z_config.security.jwt.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
public class FrontSecurityController {

    private static final Logger log = LoggerFactory.getLogger(FrontSecurityController.class);

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private UserService userService;

    // 로그인 (JWT 토큰 발급)
    @PostMapping("/user/login")
    public ResponseEntity<?> login(@RequestBody HashMap<String, String> loginRequest, HttpServletResponse response) {
        log.info("!@#1  23123124123");
        String userId = loginRequest.get("userId");
        String userPw = loginRequest.get("userPw");
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userId, userPw)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenUtil.generateToken(authentication);
        // 크로스도메인 쿠키 저장을 위해 SameSite=None; Secure 명시적으로 추가
        String cookieValue = "jwt_token=" + token + "; Path=/; HttpOnly; Max-Age=1800; SameSite=None; Secure";
        response.addHeader("Set-Cookie", cookieValue);
        return ResponseEntity.ok().body(new HashMap<String, Object>() {{
            put("token", token);
        }});
    }

    // 회원가입
    @PostMapping("/user/register")
    public ResponseEntity<?> register(@RequestBody HashMap<String, String> joinRequest) {
        int result = userService.userJoin(joinRequest);
        if (result > 0) {
            return ResponseEntity.ok().body("회원가입 성공");
        } else {
            return ResponseEntity.badRequest().body("회원가입 실패");
        }
    }

    // JWT 기반 사용자 정보 반환
    @GetMapping("/user/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        // 인증이 없거나, 인증이 anonymousUser이거나, PrincipalDetails가 아니면 401 반환
        if (authentication == null || !authentication.isAuthenticated() ||
            authentication.getPrincipal() == null ||
            "anonymousUser".equals(authentication.getPrincipal()) ||
            !(authentication.getPrincipal() instanceof PrincipalDetails)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();
        UserDTO user = principal.getUser();
        // DB에서 최신 사용자 정보 조회
        HashMap<String, String> param = new HashMap<>();
        param.put("userId", user.getUserId());
        UserDTO fullUser = userService.getUserInfo(param);
        return ResponseEntity.ok(fullUser);
    }
    
    @PostMapping("/user/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // JWT 쿠키 만료
        String cookieValue = "jwt_token=; Path=/; HttpOnly; Max-Age=0; SameSite=None; Secure";
        response.addHeader("Set-Cookie", cookieValue);
        return ResponseEntity.ok().body("로그아웃 성공");
    }
}
