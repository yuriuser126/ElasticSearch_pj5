package com.boot.user.controller;

import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.boot.user.dto.UserDTO;
import com.boot.user.service.UserService;


import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class UserController {

	@Autowired
	private UserService service;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	@RequestMapping("/joinProc")
	public ResponseEntity<String> join(HttpServletRequest request, @RequestParam HashMap<String, String> param) {

		System.out.println("@#param => " + param);
		if (service.checkId(param) != null) {

		} else {
			int re = service.userJoin(param);
			if (re == 1) {
				return ResponseEntity.ok("available");
			}
		}
		return ResponseEntity.status(HttpStatus.CONFLICT).body("duplicate");

	}

	@RequestMapping("/user_info")
	public String getUserInfo(int u_number) {
		return "user/user_info";
	}

	@RequestMapping("/logout")
	public String logout(HttpServletRequest request) {
		return "redirect:loginForm";
	}
	
	@PostMapping("/changePassword")
	@ResponseBody
	public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
	    String userId = request.get("userId");
	    String userPw = request.get("userPw");
	    System.out.println("@#userId => " + userId);
	    System.out.println("@#userPw => " + userPw);

	    // 1. 필수 입력값 확인
	    if (userId == null || userPw == null || userId.isBlank() || userPw.isBlank()) {
	        return ResponseEntity.badRequest().body(Map.of(
	            "success", false,
	            "message", "아이디 또는 비밀번호가 누락되었습니다."
	        ));
	    }

	   
	    HashMap<String, String> param = new HashMap<>();
	    param.put("userId", userId);
	    param.put("userNewPw", userPw); // 비밀번호는 서비스단에서 암호화 처리됨

	    // 3. 서비스 호출
	    int result = service.updateUserPwInfo(param);

	    // 4. 응답 반환
	    if (result > 0) {
	        return ResponseEntity.ok(Map.of("success", true));
	    } else {
	        return ResponseEntity.status(500).body(Map.of(
	            "success", false,
	            "message", "비밀번호 변경 실패"
	        ));
	    }
	}

	@PostMapping("/checkId")
	@ResponseBody
	public ResponseEntity<?> checkId(@RequestBody Map<String, String> param) {
	    String userId = param.get("userId");
	    System.out.println("@#userId => " + userId);
	    if (userId == null || userId.isBlank()) {
	        return ResponseEntity.ok(Map.of(
	            "success", false,
	            "message", "아이디를 입력해주세요."
	        ));
	    }


	    HashMap<String, String> map = new HashMap<>();
	    map.put("userId", userId); // ⚠️ 반드시 키 이름은 "userId"여야 함

	    UserDTO user = service.checkId(map);
	    if (user != null) {
	        return ResponseEntity.ok(Map.of("success", true));
	    } else {
	    	 return ResponseEntity.ok(Map.of(
	    	            "success", false,
	    	            "message", "존재하지 않는 아이디입니다."
	    	        ));
	    }
	}

}