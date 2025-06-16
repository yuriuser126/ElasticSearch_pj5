package com.boot.analysis.repository;

import com.boot.analysis.dto.SearchLog;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface SearchLogRepository extends ElasticsearchRepository<SearchLog, String> {
}