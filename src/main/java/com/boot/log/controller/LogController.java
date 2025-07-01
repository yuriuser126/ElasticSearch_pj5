package com.boot.log.controller;

import com.boot.log.model.Logs;
import com.boot.log.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LogController {
    @Autowired
    private LogService logService;


    @GetMapping("/logs")
    public List<Logs> getAllLogs() {
        return logService.findAllLogs();
    }

}
