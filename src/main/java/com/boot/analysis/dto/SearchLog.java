package com.boot.analysis.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.Instant; // LocalDateTime 대신 Instant를 import 합니다.

@Document(indexName = "search_logs")
@Getter
@Setter
public class SearchLog {

    @Id
    private String id;

    @Field(type = FieldType.Text, name = "keyword")
    private String keyword;

    // ★★★ 이 부분이 수정되었습니다! ★★★
    // 타입을 Instant로 변경하여 항상 UTC 기준으로 시간을 저장합니다.
    @Field(type = FieldType.Date, name = "search_time", format = DateFormat.date_optional_time)
    private Instant searchTime;

    @Field(type = FieldType.Keyword, name = "userId")
    private String userId;

    public SearchLog() {}

    // 생성자도 Instant 타입을 받도록 수정합니다.
    public SearchLog(String keyword, Instant searchTime, String userId) {
        this.keyword = keyword;
        this.searchTime = searchTime;
        this.userId = userId;
    }
}
