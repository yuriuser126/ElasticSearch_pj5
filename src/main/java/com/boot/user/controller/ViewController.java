package com.boot.user.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import com.boot.user.dto.BasicUserDTO;
import com.boot.user.dto.UserDTO;
import com.boot.z_config.security.OAuth2AuthenticationSuccessHandler;
import com.boot.z_config.security.PrincipalDetails;
import com.boot.z_config.security.UserUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ViewController {

	private final OAuth2AuthenticationSuccessHandler OAuth2AuthenticationSuccessHandler;

	ViewController(OAuth2AuthenticationSuccessHandler OAuth2AuthenticationSuccessHandler) {
		this.OAuth2AuthenticationSuccessHandler = OAuth2AuthenticationSuccessHandler;
	}

	@RequestMapping("/")
	public String getMainBookInfo(Model model, HttpServletRequest request, HttpServletResponse response) {

		BasicUserDTO user = (BasicUserDTO) request.getAttribute("user");

		return "OK";
	}

	@RequestMapping("/loginForm")
	public String loginPage(HttpServletRequest request, Model model) {

		return "user/login";
	}

	@RequestMapping("/joinForm")
	public String join(HttpServletRequest request, Model model) {

		return "user/join";
	}

}