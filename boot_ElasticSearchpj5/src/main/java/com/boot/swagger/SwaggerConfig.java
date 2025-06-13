package com.boot.swagger;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
    	log.info("@#$@# 여기까지 작동하는 중임");
        return new OpenAPI()
            .info(new Info()
                    .title("ElasticSearch API")
                    .description("Swagger UI ElasticSearch Demo")
                    .version("v1.0.0")); 
    }
}

///*
//	Swagger 작동 원리입니다. 읽어주시면 굳
//	
//	자동 분석: Spring Boot 애플리케이션에 API 코드(@RestController, @GetMapping 등)와 관련 DTO를 작성하면, SpringDoc-OpenAPI 라이브러리가 실행 시점에 이 코드들을 자동으로 분석
//	API 명세 생성: 분석된 정보를 바탕으로, API의 경로, 파라미터, 요청/응답 데이터 구조 등을 정의한 OpenAPI 3.0 표준 명세 파일(JSON 형식)을 내부적으로 생성 (기본적으로 /v3/api-docs 경로에서 이 JSON을 확인)
//	UI 렌더링: 사용자가 웹 브라우저에서 특정 URL(기본적으로 localhost:8485/swagger-ui.html)로 접속하면 SpringDoc-OpenAPI에 포함된 Swagger UI가 앞서 생성된 JSON 명세 파일을 읽어서 swagger 스타일로 보여줌.
//	모르시는게 있으시면 말씀해주세요~

//*/