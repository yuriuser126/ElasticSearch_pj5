package com.boot.favorites.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteDTO {
    private String id;
    private String userId;
    private String userName;
    private String documentId;
    private String title;
    private String url;
    private java.sql.Timestamp createdAt;
}
