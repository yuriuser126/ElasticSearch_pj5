package com.boot.docker.controller;

import com.boot.docker.service.HealthService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @Autowired
    private HealthService healthService;

    @Operation(summary = "서버 상태 점검", description = "Docker 서버 상태를 점검할 수 있습니다.")
    @GetMapping("/health/docker")
    public Map<String, String> healthCheckDocker() {
        Map<String, String> status = new HashMap<>();
        status.put("elasticsearch", healthService.checkElasticHealth("https://localhost:9200/_cluster/health"));
        status.put("kibana", healthService.checkHealth("http://localhost:5601/api/status"));
        status.put("mongodb", healthService.checkMongoHealth("mongodb://localhost:27017"));
        status.put("monstache", healthService.checkHealth("http://localhost:8787/healthz"));
        System.out.println("Docker "+status);
        return status;
    }


    @Operation(summary = "Elastic 서버 상태 점검", description = "Docker Elastic search 상태를 점검할 수 있습니다.")
    @GetMapping("/health/elasticsearch")
    public Map<String, String> healthCheckElastic() {
        Map<String, String> status = new HashMap<>();
        status.put("elasticsearch", healthService.checkElasticHealth("https://localhost:9200/_cluster/health"));
        System.out.println("Elastic "+status);
        return status;
    }

    @Operation(summary = "Kibana 서버 상태 점검", description = "Docker Kibana 상태를 점검할 수 있습니다.")
    @GetMapping("/health/kibana")
    public Map<String, String> healthCheckKibana() {
        Map<String, String> status = new HashMap<>();
        status.put("kibana", healthService.checkHealth("http://localhost:5601/api/status"));
        System.out.println("Kibana "+status);
        return status;
    }

    @Operation(summary = "MongoDB 서버 상태 점검", description = "Docker MongoDB 상태를 점검할 수 있습니다.")
    @GetMapping("/health/mongodb")
    public Map<String, String> healthCheckMongodb() {
        Map<String, String> status = new HashMap<>();
        status.put("mongodb", healthService.checkMongoHealth("mongodb://localhost:27017"));
        System.out.println("Mongodb "+status);
        return status;
    }

    @Operation(summary = "Monstache 서버 상태 점검", description = "Docker Monstache 상태를 점검할 수 있습니다.")
    @GetMapping("/health/monstache")
    public Map<String, String> healthCheckMonstache() {
        Map<String, String> status = new HashMap<>();
        status.put("monstache", healthService.checkHealth("http://localhost:8787/healthz"));
        System.out.println("monstache "+status);
        return status;
    }
}
