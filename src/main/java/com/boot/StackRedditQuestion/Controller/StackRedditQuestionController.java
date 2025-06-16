package com.boot.StackRedditQuestion.Controller;

import com.boot.StackRedditQuestion.Model.StackRedditQuestion;
import com.boot.StackRedditQuestion.Service.StackRedditQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stackredditquestions")
public class StackRedditQuestionController {

    @Autowired
    private StackRedditQuestionService stackRedditQuestionService;

	 
    //POST /stackredditquestions?keyword=java&limit=15 이런식으로 호출해야함
    // keyword 기준으로 Reddit과 StackOverflow에서 각각 15개씩 데이터를 가져와서
    // MongoDB에 저장(Insert 또는 Update) 하는 동작
    @PostMapping
    public String createQuestions(
        @RequestParam(name = "keyword")  String keyword,
        @RequestParam(name = "limit",defaultValue = "10") int limit
    ) {
        stackRedditQuestionService.fetchAndSaveAll(keyword, limit);
        return "Reddit & StackOverflow questions fetched and saved.";
    }
    
    @GetMapping("/source")
    public List<StackRedditQuestion> getQuestionsByKeyword(
		// keyword 파라미터는 선택 사항이며, 없을 경우 기본값으로 빈 문자열("")이 할당됩니다.
		// 이를 통해 클라이언트가 keyword를 보내지 않아도 메서드가 정상적으로 동작하도록 처리합니다.
		// 빈 문자열을 기준으로 전체 조회 또는 조건별 조회 로직을 분기할 수 있습니다.
        @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword
        
    ) {
        return stackRedditQuestionService.findByKeyword(keyword);
    }
}
