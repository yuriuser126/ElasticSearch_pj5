//package com.boot.Quartz;
//
//import com.boot.HackerNews.DTO.HackerNewsItem;
//import com.boot.HackerNews.Service.HackerNewsService;
//import org.quartz.Job;
//import org.quartz.JobExecutionContext;
//import org.quartz.JobExecutionException;
//import org.springframework.beans.factory.annotation.Autowired;
//
//import java.util.List;
//
//public class MyJob implements Job {
//
//    @Autowired
//    private HackerNewsService hackerNewsService;
//
//    @Override
//    public void execute(JobExecutionContext context) throws JobExecutionException {
//        System.out.println("Quartz Job 실행");
//        List<HackerNewsItem> list =  hackerNewsService.getTopStories(10);
//        System.out.println(list);
//    }
//}