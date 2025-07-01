package com.boot.log.service;

import com.boot.log.model.Logs;
import com.boot.log.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    public Logs saveLog(Logs log) {
        return logRepository.save(log);
    }
    public Logs findLog(String id) {
        return logRepository.findById(id).orElse(null);
    }
    public Logs deleteLog(String id) {
        Logs log = logRepository.findById(id).orElse(null);
        if (log != null) {
            logRepository.delete(log);
        }
        return log;
    }
    public List<Logs> findAllLog() {
        return logRepository.findAll();
    }
}
