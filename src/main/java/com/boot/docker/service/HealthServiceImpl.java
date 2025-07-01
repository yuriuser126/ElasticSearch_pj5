package com.boot.docker.service;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class HealthServiceImpl implements HealthService {

    @Value("${elasticsearch.apiKey}")
    private String apiKey;

    @Override
    public String checkHealth(String urlString) {
        try {
            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(2000); // 2초
            conn.setReadTimeout(2000);
            conn.setRequestMethod("GET");
            int responseCode = conn.getResponseCode();
            if (responseCode >= 200 && responseCode < 400) {
                return "UP";
            } else {
                return "DOWN";
            }
        } catch (Exception e) {
            return "DOWN";
        }
    }

    @Override
    public String checkMongoHealth(String urlString) {
        try (MongoClient mongoClient = MongoClients.create(urlString)) {
            MongoDatabase db = mongoClient.getDatabase("admin");
            Document ping = new Document("ping", 1);
            Document result = db.runCommand(ping);
            if (result.getDouble("ok") == 1.0) {
                return "UP";
            }
        } catch (Exception e) {
            // 로그 등 필요시 추가
        }
        return "DOWN";
    }

    @Override
    public String checkElasticHealth(String urlString) {
        try {
            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(2000);
            conn.setReadTimeout(2000);
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Authorization", "ApiKey " + apiKey);

            int responseCode = conn.getResponseCode();
            if (responseCode >= 200 && responseCode < 400) {
                // 응답 본문 파싱
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder response = new StringBuilder();
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                // JSON 파싱
                JSONObject json = new JSONObject(response.toString());
                String status = json.optString("status", "").toLowerCase();
                if ("green".equals(status) || "yellow".equals(status)) {
                    return "UP";
                } else {
                    return "DOWN";
                }
            } else {
                System.out.println("else start"+responseCode);
                return "DOWN";
            }
        } catch (Exception e) {
            return "DOWN";
        }
    }
}
