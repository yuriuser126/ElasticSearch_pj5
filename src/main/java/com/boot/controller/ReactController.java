package com.boot.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ReactController {
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
    
    @GetMapping("/secure")
    public String secure() {
        return "인증된 사용자만 접근 가능";
    }
}
