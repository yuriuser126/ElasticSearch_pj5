package com.boot.z_config.socialLogin;


import com.boot.user.dto.UserDTO;
import com.boot.z_config.security.PrincipalDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService
{
    @Autowired
    private SocialUserMapper socialUserMapper;
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException
    {
        // 부모 클래스에서 OAuth2User 객체를 받아옴 (Google, Naver, Kakao 공통)
        OAuth2User oAuth2User = super.loadUser(userRequest);
        // 어떤 소셜 로그인 제공자인지 확인 (google, naver, kakao)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        System.out.println("=== [" + registrationId + " 로그인 시도] ===");
        oAuth2User.getAttributes().forEach((k, v) -> System.out.println(k + " : " + v));
        // 공통 사용자 정보 변수
        String userId = null;
        String name = null;
        String email = null;
        // 제공자별 사용자 정보 파싱 처리
        switch (registrationId)
        {
            case "google":
                email = oAuth2User.getAttribute("email");
                name = oAuth2User.getAttribute("name");
                userId = oAuth2User.getAttribute("sub"); // Google의 고유 ID
                break;

            case "kakao":
                System.out.println("=== [카카오 로그인 응답 전체 attribute 확인] ===");

                oAuth2User.getAttributes().forEach((k, v) ->
                {
                    System.out.println("속성: " + k + " → 값: " + v + " (타입: " + v.getClass().getName() + ")");
                });

                // kakao_account 꺼내기
                Map<String, Object> kakaoAccount = (Map<String, Object>) oAuth2User.getAttribute("kakao_account");

                if (kakaoAccount != null) //kakaoAccount 값이 있으면?
                {
                    System.out.println("=== [kakao_account 내부] ===");
                    kakaoAccount.forEach((k, v) ->
                    {
                        System.out.println("속성: " + k + " → 값: " + v + " (타입: " + (v != null ? v.getClass().getName() : "null") + ")");
                    });
                }

                else
                {
                    System.out.println("kakao_account 없음");
                }

                // profile 꺼내기
                Map<String, Object> profile = kakaoAccount != null ? (Map<String, Object>) kakaoAccount.get("profile") : null;
                if (profile != null)
                {
                    System.out.println("=== [profile 내부] ===");
                    profile.forEach((k, v) ->
                    {
                        System.out.println("속성: " + k + " → 값: " + v + " (타입: " + (v != null ? v.getClass().getName() : "null") + ")");
                    });
                }
                else
                {
                    System.out.println("profile 없음");
                }

                // id 확인
                Object rawId = oAuth2User.getAttribute("id");

                System.out.println("raw id 값: " + rawId + ", 타입: " + (rawId != null ? rawId.getClass().getName() : "null"));

                // 캐스팅 없이 문자열로 변환 (kakao 에서 주는놈이 Long 타입을 반환함. DB에 넣을려면 여기서 String으로 치환해야댐)
                userId = String.valueOf(rawId);
                name = (profile != null && profile.get("nickname") != null) ? (String) profile.get("nickname") : "카카오사용자";
                email = (kakaoAccount != null && kakaoAccount.get("email") != null) ? (String) kakaoAccount.get("email") : "unknown@kakao.com";
                break;

            case "naver":
                Map<String, Object> response = (Map<String, Object>) oAuth2User.getAttribute("response");
                if (response != null)
                {
                    email = (String) response.get("email");
                    name = (String) response.get("name");
                    userId = (String) response.get("id");
                }
                break;
            default:
                throw new OAuth2AuthenticationException("지원하지 않는 로그인 방식입니다: " + registrationId);
        }

        // 사용자 정보가 DB에 있는지 조회
        UserDTO user = socialUserMapper.findByUserId(userId);
        //신규사용자라면?
        if (user == null)
        {
            // 신규 사용자 등록
            UserDTO newUser = new UserDTO();
            newUser.setUserId(userId);
            newUser.setUserName(name != null ? name : "소셜사용자"); //db에 이름이 null이 들어가면 사고나므로, 아무값이나 줌
            newUser.setUserEmail(email);
            socialUserMapper.insertSocialUser(newUser);

            // DB에 데이타 insert 후 DB에서 다시 조회해서 userNumber 포함된 객체로 덮기, 이거안해주면 첫로그인시 게시글안써짐
            user = socialUserMapper.findByUserId(userId);
        }

        // PrincipalDetails는 Spring Security에서 인증 객체로 사용됨
        PrincipalDetails principalDetails = new PrincipalDetails(user);

        // 수동으로 인증 정보 저장 (세션에 사용자 등록)
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(principalDetails, null, principalDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return principalDetails;
    }
}
