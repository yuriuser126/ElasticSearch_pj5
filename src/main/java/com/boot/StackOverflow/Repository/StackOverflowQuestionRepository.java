package com.boot.StackOverflow.Repository;


import com.boot.StackOverflow.DTO.StackOverflowQuestion;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StackOverflowQuestionRepository extends MongoRepository<StackOverflowQuestion, Integer> {
//	public interface StackOverflowQuestionRepository extends MongoRepository<StackOverflowQuestion, String> {
}
