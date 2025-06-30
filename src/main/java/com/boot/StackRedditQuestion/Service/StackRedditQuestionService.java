package com.boot.StackRedditQuestion.Service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.Reddit.Service.RedditService;
import com.boot.StackOverflow.Service.StackOverflowService;
import com.boot.StackRedditQuestion.Model.StackRedditQuestion;
import com.boot.StackRedditQuestion.Repository.StackRedditQuestionRepository;


@Service
public class StackRedditQuestionService {

    @Autowired
    private StackOverflowService stackOverflowService;

    @Autowired
    private StackRedditQuestionRepository stackRedditQuestionRepository;

    @Autowired
    private RedditService redditService;

    public void fetchAndSaveAll(String keyword, int limit) {
        // 1. Reddit 데이터 저장
    	redditService.fetchAndSaveHotPostsAsQuestions(keyword, limit);

        // 2. 스택오버 질문 저장 (예: 별도 API 호출하거나 DB 저장)
    	stackOverflowService.saveQuestionsToMongo(keyword,limit);
        
        // 필요하면 Elasticsearch 색인도 통합 관리 가능
    }
    
    //조회
    public List<StackRedditQuestion> findByKeyword(String keyword) {
        if (keyword == null || keyword.isEmpty()) {
            return stackRedditQuestionRepository.findAll();
        }
        return stackRedditQuestionRepository.findByKeywordContaining(keyword);
    }
}
