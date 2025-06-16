package com.boot.z_config.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boot.user.dto.UserDTO;
import com.boot.user.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserService userService;
    
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("사용자 인증 시도: {}", username);
        
        try {
            // 사용자 정보 조회
            HashMap<String, String> param = new HashMap<>();
            param.put("userId", username);
            
            ArrayList<UserDTO> users = userService.userLogin(param);
            
            // 사용자가 존재하지 않는 경우
            if (users == null || users.isEmpty()) {
                log.warn("사용자를 찾을 수 없음: {}", username);
                throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username);
            }
            
            UserDTO user = users.get(0);
            log.info("사용자 찾음: {}, 비밀번호: {}", user.getUserId(), user.getUserPw());
            
            // 비밀번호 형식 확인 (디버깅용)
            String passwordFormat = "알 수 없음";
            if (user.getUserPw() != null) {
                if (user.getUserPw().startsWith("$2a$") || user.getUserPw().startsWith("$2b$") || user.getUserPw().startsWith("$2y$")) {
                    passwordFormat = "BCrypt";
                } else {
                    passwordFormat = "평문 또는 다른 형식";
                }
            } else {
                passwordFormat = "null";
            }
            log.info("비밀번호 형식: {}", passwordFormat);
            
            // Spring Security User 객체 생성 및 반환
            UserDetails userDetails = createUserDetails(user);
//            log.info("생성된 UserDetails: {}", userDetails);
            return userDetails;
        } catch (Exception e) {
            log.error("인증 처리 중 오류 발생: {}", e.getMessage(), e);
            throw e;
        }
    }
    
//  리액트 프론트 버전 
    private UserDetails createUserDetails(UserDTO user) {
        return new PrincipalDetails(user);
    }
//    리액트 프론트 버전 바꾸기 위해 기본사용하던것 주석처리하였습니다 !!  
//    // UserDTO를 UserDetails로 변환
//    private UserDetails createUserDetails(UserDTO user) {
//        // 권한 목록 생성
//        Collection<GrantedAuthority> authorities = new ArrayList<>();
//        
//        // 관리자 여부에 따른 권한 부여
//        if (user.getUserAdmin() != 0 && user.getUserAdmin() == 1) {
//            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
//            log.info("관리자 권한 부여: {}", user.getUserId());
//        } else {
//            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
//            log.info("일반 사용자 권한 부여: {}", user.getUserId());
//        }
//        
//        // 비밀번호 처리 (중요: 이미 암호화된 비밀번호를 그대로 사용)
//        String password = user.getUserPw();
//        
//        // 비밀번호가 BCrypt 형식이 아닌 경우 (개발 환경에서만 사용)
//        // 주의: 실제 운영 환경에서는 모든 비밀번호가 이미 암호화되어 있어야 함
//        if (password != null && !password.startsWith("$2")) {
//            log.warn("비밀번호가 암호화되어 있지 않습니다. 개발 환경에서만 사용하세요.");
//            // 실제 운영 환경에서는 이 부분을 제거하고 모든 비밀번호를 미리 암호화해야 함
//            // password = passwordEncoder.encode(password);
//        }
//        
////        log.info("사용자 인증 정보 생성 완료: {}", user.getUserId());
//        
//        // Spring Security의 User 객체 생성
//        // 매개변수: username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities
//        return new User(
//            user.getUserId(),
//            password, // 이미 암호화된 비밀번호
//            true,     // 계정 활성화 여부
//            true,     // 계정 만료 여부
//            true,     // 자격 증명 만료 여부
//            true,     // 계정 잠금 여부
//            authorities
//        );
//    }
    
    // 테스트용 메서드: 비밀번호 인코딩 확인
//    public void checkPasswordEncoding(String rawPassword, String encodedPassword) {
//        boolean matches = passwordEncoder.matches(rawPassword, encodedPassword);
//        log.info("비밀번호 매칭 결과: {}", matches);
//    }

}