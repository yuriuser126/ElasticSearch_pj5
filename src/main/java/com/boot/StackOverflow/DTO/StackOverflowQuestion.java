package com.boot.StackOverflow.DTO;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "stackoverflowquestions")
public class StackOverflowQuestion {
    @Id
    private Integer question_id;
    private String title;
    private String body;
    private List<String> tags;
    private Integer score;
    private Integer view_count;
    private Integer answer_count;
    private String link;
    private String source;
}
