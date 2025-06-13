package com.boot.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
public class TrendsController {
    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/api/trends")
    public String getTrends(@RequestParam List<String> keyword) {
        URI uri = UriComponentsBuilder.fromHttpUrl("http://localhost:5000/trends")
                .queryParam("keyword", keyword.toArray())
                .build()
                .toUri();
        return restTemplate.getForObject(uri, String.class);
    }
}
