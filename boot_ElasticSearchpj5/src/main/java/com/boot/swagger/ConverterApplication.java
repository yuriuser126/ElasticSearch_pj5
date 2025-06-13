package com.boot.swagger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
// @ComponentScan을 사용하여 다른 패키지의 컴포넌트를 스캔해야 할 경우 추가
// import org.springframework.context.annotation.ComponentScan;


@ComponentScan(basePackages = { "com.example.demo" })
@SpringBootApplication
// 만약 컨트롤러, 서비스 등이 다른 최상위 패키지에 있다면 @ComponentScan 사용
// 예: @ComponentScan(basePackages = {"com.boot.converter", "com.boot.anotherpackage"})
public class ConverterApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConverterApplication.class, args);
    }

}