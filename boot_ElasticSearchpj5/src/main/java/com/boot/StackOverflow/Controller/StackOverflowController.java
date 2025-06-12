package com.boot.StackOverflow.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    
    @Operation(summary = "Stack Overflow 실제 데이터 저장", description = "Stack Overflow API에서 실제 질문 데이터 500개를 가져와 MongoDB에 저장합니다.")
    @PostMapping("/fetch-real-data")
    public ResponseEntity<String> fetchAndSaveRealData() {
        try {
            // deleteAll()을 먼저 호출하여 기존 데이터를 지우고 새로 시작
            stackOverflowService.repository.deleteAll(); 
            // 실제 데이터를 가져와 저장하는 서비스 메소드 호출
            stackOverflowService.saveQuestions(); 
            return ResponseEntity.ok("실제 데이터 500개가 성공적으로 저장되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("데이터 저장 중 오류 발생: " + e.getMessage());
        }
    }
//    @Operation(summary = "Stack Overflow 더미 데이터 생성", description = "테스트용 더미 데이터 100개를 생성합니다.")
//    @PostMapping("/add-dummy-data")
//    public ResponseEntity<String> addDummyData() {
//        try {
//            stackOverflowService.addDummyData();
//            return ResponseEntity.ok("더미 데이터 100개가 성공적으로 생성되었습니다.");
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("더미 데이터 생성 중 오류 발생: " + e.getMessage());
//        }
//    }
}