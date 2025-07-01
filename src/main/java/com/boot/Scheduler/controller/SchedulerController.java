package com.boot.Scheduler.controller;

import com.boot.Scheduler.service.SchedulerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SchedulerController {
    @Autowired
    private SchedulerService schedulerService;

    @PostMapping("/update-cron")
    public String updateCron(@RequestParam String cron) {
        schedulerService.schedule(cron);
        return "schedule updated "+cron;
    }

    @PostMapping("/update-cron-stop")
    public String stopSchedule() {
        schedulerService.stopScheduler();
        return "스케줄이 중지되었습니다.";
    }
}
