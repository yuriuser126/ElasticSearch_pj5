package com.boot.log.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "logs")
public class Logs {
    @Id
    private String logId;
    private String activityType;
    private String actorType;
    private String actorId;
    private String actorName;
    private String action;
    private String actionStatus;
    private String actionDetail;
    private LocalDateTime timestamp;
}
