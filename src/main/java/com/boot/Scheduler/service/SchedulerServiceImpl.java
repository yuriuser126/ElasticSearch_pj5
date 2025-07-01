package com.boot.Scheduler.service;

import com.boot.HackerNews.Service.HackerNewsService;
import com.boot.Reddit.Service.RedditService;
import com.boot.StackOverflow.Service.StackOverflowService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;

import java.util.concurrent.ScheduledFuture;

@Service
public class SchedulerServiceImpl implements SchedulerService {
    @Autowired
    private TaskScheduler taskScheduler;

    @Autowired
    private HackerNewsService hackerNewsService;

    @Autowired
    private StackOverflowService stackOverflowService;

    @Autowired
    private RedditService redditService;



    private ScheduledFuture<?> scheduledFuture;
    private String currentCron;

    // 서버 시작 시 자동 실행
    @PostConstruct
    public void init() {
        // 초기 cron 설정
//        currentCron = "0/10 * * * * *"; // 10초마다 실행
        currentCron = "0 0/30 * * * ?"; // 30분마다 실행
        schedule(currentCron);
    }

    @Override
    // 스케줄 등록/갱신
    public void schedule(String cron) {
        // 기존 작업이 있으면 취소
        if (scheduledFuture != null && !scheduledFuture.isCancelled()) {
            scheduledFuture.cancel(false);
        }
        // 새로운 주기로 등록
        scheduledFuture = taskScheduler.schedule(
                () -> myTask(), // 실행할 작업
                new CronTrigger(cron)
        );
    }

    @Override
    // 실제 실행할 작업
    public void myTask() {
        System.out.println("작업 실행: " + System.currentTimeMillis());
        // 필요한 작업 수행
        hackerNewsService.saveToMongo();
        stackOverflowService.saveQuestionsToMongo();
        redditService.schedule();
    }
    
    @Override
    public void stopScheduler() {
        if (scheduledFuture != null && !scheduledFuture.isCancelled()) {
            scheduledFuture.cancel(false);
            scheduledFuture = null;
        }
    }
}
