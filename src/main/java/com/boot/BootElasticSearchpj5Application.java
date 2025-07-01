package com.boot;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@MapperScan(basePackages = "com.boot.z_config.socialLogin")
@EnableScheduling
public class BootElasticSearchpj5Application {

	public static void main(String[] args) {
		SpringApplication.run(BootElasticSearchpj5Application.class, args);
	}

}
