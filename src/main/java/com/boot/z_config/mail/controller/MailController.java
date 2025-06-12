package com.boot.z_config.mail.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.boot.user.service.UserService;
import com.boot.z_config.mail.service.MailService;



@Controller
public class MailController {
    
    @Autowired
    private MailService mailService;
	@Autowired
	private UserService service;
	
	@RequestMapping("/mailConfirm")
	@ResponseBody
	public ResponseEntity<?> mailConfirm(@RequestParam("email") String email) throws Exception {
	    System.out.println("이메일 인증 요청: " + email);
	    
	    // 이메일 중복 체크
	    boolean isEmailExists = service.checkEmail(email);
	    
	    if (isEmailExists) {
	        // 이메일이 이미 존재하는 경우
	        Map<String, Object> response = new HashMap<>();
	        response.put("success", false);
	        response.put("message", "이미 사용 중인 이메일입니다.");
	        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
	    }
	    
	    // 이메일이 존재하지 않는 경우, 인증 코드 발송
	    String code = mailService.sendSimpleMessage(email);
	    System.out.println("인증코드 : " + code);
	    
	    Map<String, Object> response = new HashMap<>();
	    response.put("success", true);
	    response.put("code", code);
	    return ResponseEntity.ok(response);
	}
}