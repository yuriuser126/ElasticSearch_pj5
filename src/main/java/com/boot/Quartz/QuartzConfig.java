//package com.boot.Quartz;
//
//import org.quartz.JobDetail;
//import org.quartz.Trigger;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.scheduling.quartz.JobDetailFactoryBean;
//import org.springframework.scheduling.quartz.SimpleTriggerFactoryBean;
//
//
//@Configuration
//public class QuartzConfig {
//
//    @Bean
//    public JobDetailFactoryBean jobDetail() {
//        JobDetailFactoryBean factory = new JobDetailFactoryBean();
//        factory.setJobClass(MyJob.class);
//        factory.setDurability(true);
//        return factory;
//    }
//
//    @Bean
//    public SimpleTriggerFactoryBean trigger(JobDetail jobDetail) {
//        SimpleTriggerFactoryBean factory = new SimpleTriggerFactoryBean();
//        factory.setJobDetail(jobDetail);
//        factory.setRepeatInterval(5000); // 5초마다 실행
//        factory.setRepeatCount(-1);
//        return factory;
//    }
//}