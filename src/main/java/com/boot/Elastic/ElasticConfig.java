package com.boot.Elastic;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import org.apache.http.HttpHost;
import org.apache.http.message.BasicHeader;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.Arrays;

@Component
public class ElasticConfig {
    private ElasticsearchClient client;

    @Value("${elasticsearch.apiKey}")
    private String apiKey;

    @PostConstruct
    public void init() {
        RestClientBuilder builder = RestClient.builder(
                new HttpHost("localhost", 9200, "https")
        ).setHttpClientConfigCallback(httpClientBuilder ->
                httpClientBuilder.setDefaultHeaders(Arrays.asList(
                        new BasicHeader("Authorization", "ApiKey " + apiKey)
                ))
        );
        RestClient restClient = builder.build();
        RestClientTransport transport = new RestClientTransport(restClient, new JacksonJsonpMapper());
        client = new ElasticsearchClient(transport);
    }

    public ElasticsearchClient getClient() {
        return client;
    }
}
