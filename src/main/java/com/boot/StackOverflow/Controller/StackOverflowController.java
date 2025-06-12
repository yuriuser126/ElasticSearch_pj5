package com.boot.StackOverflow.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boot.StackOverflow.Service.StackOverflowService;

import io.swagger.v3.oas.annotations.Operation;


@RestController
@RequestMapping("/api/stackoverflow")
public class StackOverflowController {

    @Autowired
    private StackOverflowService stackOverflowService;

    @GetMapping("/questions")
    public Object getQuestions(@RequestParam("tag") String tag) {
        return stackOverflowService.fetchLatestQuestions(tag);
    }

    @PostMapping("/fetch")
    public String fetchQuestions() {
        stackOverflowService.saveQuestions();
        return "Saved Stack Overflow questions to MongoDB.";
    }
    

    @Operation(summary = "Elasticsearch에 질문 1개 저장", description = "StackOverflow에서 최신 질문 중 하나를 Elasticsearch에 저장합니다.")
    @PostMapping("/fetch/elastic/one")
    public String fetchAndSaveOneToElastic() {
    	 try {
    	        System.out.println("🔍 API 호출 시작");
    	        stackOverflowService.saveOneQuestionToElastic();
    	        System.out.println("✅ API 호출 성공");
    	        return "Elasticsearch에 StackOverflow 질문 1개 저장 완료";
    	    } catch (Exception e) {
    	        System.out.println("❌ API 호출 실패: " + e.getMessage());
    	        e.printStackTrace();
    	        return "오류 발생: " + e.getMessage();
    	    }
    	}
    }
