package com.boot.StackOverflow.Repository;


import org.springframework.data.mongodb.repository.MongoRepository;

import com.boot.StackOverflow.DTO.StackOverflowQuestion;

public interface StackOverflowQuestionRepository extends MongoRepository<StackOverflowQuestion, Integer> {
//	public interface StackOverflowQuestionRepository extends MongoRepository<StackOverflowQuestion, String> {
}
