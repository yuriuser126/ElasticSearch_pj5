package com.boot.z_config.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.boot.user.dto.UserDTO;
import com.boot.user.service.UserService;
import com.boot.z_config.security.PrincipalDetails;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

import jakarta.annotation.PostConstruct;
import javax.crypto.SecretKey;

@Component
public class JwtTokenUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenUtil.class);

    // 캐시 관련 필드
    private Map<String, Boolean> tokenValidationCache = new ConcurrentHashMap<>();
    private Map<String, Long> tokenCacheExpiry = new ConcurrentHashMap<>();
    private static final long CACHE_DURATION_MS = 1000; // 1초 캐시
    
    @Autowired
    private UserService userService;

    // 시크릿 키 (실제 운영 환경에서는 환경 변수나 설정 파일에서 가져와야 함)
    private String secret = "metrohouse_jwt_secret_key_should_be_longer_than_32_bytes_for_security";

    // 토큰 유효 시간 (30분)
    private int jwtExpirationInMs = 30 * 60 * 1000;
//    private int jwtExpirationInMs = 10 * 1000;
    
    // 초기화 메서드
    @PostConstruct
    public void init() {
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.scheduleAtFixedRate(this::cleanupCache, 5, 5, TimeUnit.MINUTES);
    }
    
    // 캐시 정리 메서드
    private void cleanupCache() {
        try {
            long now = System.currentTimeMillis();
            tokenCacheExpiry.entrySet().removeIf(entry -> entry.getValue() < now);
            tokenValidationCache.keySet().removeIf(key -> !tokenCacheExpiry.containsKey(key));
            logger.debug("토큰 검증 캐시 정리 완료. 현재 캐시 크기: {}", tokenValidationCache.size());
        } catch (Exception e) {
            logger.error("캐시 정리 중 오류 발생: {}", e.getMessage());
        }
    }
    
    // 시크릿 키를 SecretKey 객체로 변환
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // 토큰에서 사용자명 추출
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    // 토큰에서 클레임 추출
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claims != null ? claimsResolver.apply(claims) : null;
    }

    // 만료시간 연장
    public String refreshToken(String token) {
        try {
            // 기존 토큰에서 클레임 추출
            Claims claims = getAllClaimsFromToken(token);
            if (claims == null) {
                return null;
            }
            
            // 새로운 만료 시간 설정
            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);
            
            // 새 토큰 생성
            return Jwts.builder()
                    .setClaims(claims)
                    .setIssuedAt(now)
                    .setExpiration(expiryDate)
                    .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                    .compact();
        } catch (Exception e) {
            logger.error("토큰 갱신 중 오류 발생: {}", e.getMessage());
            return null;
        }
    }
    
    // 토큰에서 모든 클레임 추출
    private Claims getAllClaimsFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .setAllowedClockSkewSeconds(5) // 5초 오차 허용
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            logger.debug("토큰이 만료되었습니다: {}", e.getMessage());
            return null;
        } catch (Exception e) {
            logger.error("토큰에서 클레임을 추출하는 중 오류 발생: {}", e.getMessage());
            return null;
        }
    }

    // 토큰 만료 여부 확인 - 개선된 버전
    private Boolean isTokenExpired(String token) {
        try {
            final Date expiration = getClaimFromToken(token, Claims::getExpiration);
            return expiration == null || expiration.before(new Date());
        } catch (ExpiredJwtException e) {
            logger.debug("토큰이 만료되었습니다: {}", e.getMessage());
            return true;
        }
    }

    // 인증 정보로부터 토큰 생성
    public String generateToken(Authentication authentication) {
        Map<String, Object> claims = new HashMap<>();
        
        if (authentication.getPrincipal() instanceof PrincipalDetails) {
            PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
            UserDTO user = principalDetails.getUser();
            
            // 필수 정보만 클레임에 추가
            claims.put("userNumber", user.getUserNumber());
            claims.put("userName", user.getUserName());
            claims.put("userAdmin", user.getUserAdmin());
        }
        
        return doGenerateToken(claims, authentication.getName());
    }

    // 토큰 생성
    private String doGenerateToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        // 만료 시간에 약간의 여유를 둠 (1초)
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs - 1000);
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // 토큰 검증 - 캐싱 적용 버전
    public Boolean validateToken(String token) {
        if (token == null) {
            return false;
        }
        
        // 캐시 확인
        if (tokenValidationCache.containsKey(token)) {
            Long expiry = tokenCacheExpiry.get(token);
            if (expiry != null && expiry > System.currentTimeMillis()) {
                return tokenValidationCache.get(token);
            }
        }
        
        try {
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .setAllowedClockSkewSeconds(5) // 5초 오차 허용
                .build()
                .parseClaimsJws(token)
                .getBody();
            
            // 만료 시간 직접 확인
            Date expiration = claims.getExpiration();
            boolean isValid = expiration != null && !expiration.before(new Date());
            
            // 결과 캐싱
            tokenValidationCache.put(token, isValid);
            tokenCacheExpiry.put(token, System.currentTimeMillis() + CACHE_DURATION_MS);
            
            return isValid;
        } catch (ExpiredJwtException ex) {
            logger.debug("JWT 토큰 만료: {}", ex.getMessage());
            tokenValidationCache.put(token, false);
            tokenCacheExpiry.put(token, System.currentTimeMillis() + CACHE_DURATION_MS);
            return false;
        } catch (MalformedJwtException ex) {
            logger.warn("잘못된 JWT 토큰: {}", ex.getMessage());
            tokenValidationCache.put(token, false);
            tokenCacheExpiry.put(token, System.currentTimeMillis() + CACHE_DURATION_MS);
            return false;
        } catch (UnsupportedJwtException ex) {
            logger.warn("지원되지 않는 JWT 토큰: {}", ex.getMessage());
            tokenValidationCache.put(token, false);
            tokenCacheExpiry.put(token, System.currentTimeMillis() + CACHE_DURATION_MS);
            return false;
        } catch (SignatureException ex) {
            logger.warn("JWT 서명 검증 실패: {}", ex.getMessage());
            tokenValidationCache.put(token, false);
            tokenCacheExpiry.put(token, System.currentTimeMillis() + CACHE_DURATION_MS);
            return false;
        } catch (Exception ex) {
            logger.error("JWT 토큰 검증 중 오류 발생: {}", ex.getMessage());
            tokenValidationCache.put(token, false);
            tokenCacheExpiry.put(token, System.currentTimeMillis() + CACHE_DURATION_MS);
            return false;
        }
    }
    
    // JWT 토큰에서 사용자 정보 추출
    public UserDTO getUserFromToken(String token) {
        if (token == null) {
            return null;
        }
        
        // 토큰 검증 결과 캐싱
        Boolean isValid = validateToken(token);
        if (!isValid) {
            return null;
        }
        
        try {
            Claims claims = getAllClaimsFromToken(token);
            if (claims == null) {
                return null;
            }
            
            String userId = claims.getSubject();

            // 데이터베이스에서 사용자 정보 조회
            HashMap<String, String> param = new HashMap<>();
            param.put("userId", userId);
            return userService.getUserInfo(param);
        } catch (Exception e) {
            logger.error("토큰에서 사용자 정보를 추출하는 중 오류 발생: {}", e.getMessage());
            return null;
        }
    }
}