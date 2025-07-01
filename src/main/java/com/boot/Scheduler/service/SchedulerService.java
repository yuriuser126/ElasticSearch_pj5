package com.boot.Scheduler.service;



import org.springframework.stereotype.Service;


public interface SchedulerService {
    public void schedule(String cron);
    public void myTask();
    public void stopScheduler();
}
