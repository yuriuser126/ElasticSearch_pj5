package com.boot.Mongodb.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "questions")
public class Question {
    @Id
    private String id;
    private String title;
    private String body;
    private String author;
    private String link;

    private List<String> tags;
}
