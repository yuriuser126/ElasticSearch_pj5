package com.boot.StackRedditQuestion.Repository;


import com.boot.Mongodb.Model.Question;
import com.boot.StackRedditQuestion.Model.StackRedditQuestion;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;


public interface StackRedditQuestionRepository extends MongoRepository<StackRedditQuestion, String> {
    // keyword 필드에 대해 포함 검색 (IgnoreCase 옵션은 없으니 필요하면 직접 처리)
    List<StackRedditQuestion> findByKeywordContaining(String keyword);
}
