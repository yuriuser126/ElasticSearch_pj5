package com.boot.StackRedditQuestion.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "stackreddit")
public class StackRedditQuestion {
    @Id
    private String id;
    private String title;
    private String body;
    private String author;
    private String link;
    private List<String> tags;
    private String keyword;
    private String source; // "Reddit" or "StackOverflow"
}
