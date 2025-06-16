package com.boot.Reddit.Config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Data
@Configuration
@ConfigurationProperties(prefix = "reddit")
//application.properties 에서" reddit."으로 시작하는 설정 값을 이 클래스에 바인딩
public class RedditAuthConfig {
    private String clientId;
    private String clientSecret;
    private String userAgent;
    private String redirectUri;
}
