package com.boot.log.repository;

import com.boot.log.model.Logs;
import lombok.extern.java.Log;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LogRepository extends MongoRepository<Logs, String> {
}
