package com.boot.favorites.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CollectionHistoryDTO {
    private String id;
    private String datasetName;
    private String collectedAt;
    private String status;
    private Number recordCount;
    private String fileSize;
    private String format;
    private String source;
    private String error;
    private String URL;
}
