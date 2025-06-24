package com.boot.docker.service;

import org.springframework.stereotype.Service;


public interface HealthService {
    public String checkHealth(String urlString);
    public String checkMongoHealth(String urlString);
    public String checkElasticHealth(String urlString);
}
