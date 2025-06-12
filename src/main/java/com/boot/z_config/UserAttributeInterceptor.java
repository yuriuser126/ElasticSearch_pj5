package com.boot.z_config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.boot.user.dto.UserDTO;
import com.boot.z_config.security.UserUtils;
import com.boot.user.dto.BasicUserDTO;

/**
 * 모든 요청에 대해 request 속성에 설정된 사용자 정보를 모델에 추가하는 인터셉터
 */
@Component
public class UserAttributeInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(UserAttributeInterceptor.class);
    
    @Autowired
    private UserUtils userUtils;

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
            ModelAndView modelAndView) throws Exception {
        
        if (modelAndView != null) {
            try {
                // request 속성에서 사용자 정보 가져오기
                Object userObj = request.getAttribute("user");
                
                // 사용자 정보가 있으면 모델에 추가
                if (userObj != null) {
                    // SafeUserDTO 또는 UserDTO 모두 처리 가능하도록 수정
                    modelAndView.addObject("user", userObj);
                    
                    // 로깅을 위한 사용자 ID 추출
                    String userId = null;
                    if (userObj instanceof BasicUserDTO) {
                        userId = ((BasicUserDTO) userObj).getUserId();
                    } else if (userObj instanceof UserDTO) {
                        userId = ((UserDTO) userObj).getUserId();
                    }
                    
                    logger.debug("사용자 정보를 모델에 추가: {}", userId);
                } else {
                    // 사용자 정보가 없으면 UserUtils를 통해 다시 시도
                    UserDTO user = userUtils.extractUserFromRequest(request);
                    if (user != null) {
                        modelAndView.addObject("user", user);
                        logger.debug("UserUtils를 통해 사용자 정보를 모델에 추가: {}", user.getUserId());
                    }
                }
            } catch (Exception e) {
                logger.error("사용자 정보를 모델에 추가하는 중 오류 발생", e);
            }
        }
    }
}