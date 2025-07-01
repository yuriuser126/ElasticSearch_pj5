package com.boot.Elastic;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import jakarta.annotation.PostConstruct;
import org.apache.http.Header;
import org.apache.http.HttpHost;
import org.apache.http.message.BasicHeader;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;

import jakarta.annotation.PostConstruct;
import java.util.Arrays;
import java.util.Collections;

// @Component 대신 @Configuration을 사용하여 설정 파일임을 명확히 합니다.
@Configuration
public class ElasticConfig {

    // 이 클래스가 개인적으로 소유할 클라이언트 인스턴스입니다.
    private ElasticsearchClient client;

    // --- application.properties 에서 설정 값들을 읽어옵니다. ---
    @Value("${elasticsearch.host}")
    private String host;

    @Value("${elasticsearch.port}")
    private int port;

    @Value("${elasticsearch.apiKey}")
    private String apiKey;

    /**
     * @PostConstruct는 이 컴포넌트가 준비된 후 한 번 실행됩니다.
     * 팀원의 기존 로직을 유지하여 클라이언트를 생성하고 private 필드에 저장합니다.
     */
    @PostConstruct
    public void init() {
        RestClient restClient = RestClient.builder(
            // application.properties에서 읽어온 값으로 연결을 시도합니다.
            new HttpHost(host, port, "https")
        ).setHttpClientConfigCallback(httpClientBuilder ->
            httpClientBuilder.setDefaultHeaders(
                Collections.singletonList(
                    new BasicHeader("Authorization", "ApiKey " + apiKey)
                )
            )
        ).build();

        ElasticsearchTransport transport = new RestClientTransport(restClient, new JacksonJsonpMapper());

        this.client = new ElasticsearchClient(transport);
    }

    /**
     * @Bean 어노테이션을 getClient() 메소드에 붙입니다.
     * 이제 스프링은 이 메소드를 호출하여 그 결과(private 필드에 저장된 client)를
     * 공용 부품으로 등록하고, 다른 곳에서 주입할 수 있게 됩니다.
     * @return init()에서 생성된 ElasticsearchClient 인스턴스
     */
    @Bean
    public ElasticsearchClient getClient() {
        return this.client;
    }
    

}
