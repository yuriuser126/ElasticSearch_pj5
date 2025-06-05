package com.boot.StackOverflow.Repository;


import org.springframework.data.mongodb.repository.MongoRepository;

<<<<<<< HEAD
public interface StackOverflowQuestionRepository extends MongoRepository<StackOverflowQuestion, Integer> {
//	public interface StackOverflowQuestionRepository extends MongoRepository<StackOverflowQuestion, String> {
=======
import com.boot.StackOverflow.DTO.StackOverflowQuestion;

public interface StackOverflowQuestionRepository extends MongoRepository<StackOverflowQuestion, Integer> {
//	public interface StackOverflowQuestionRepository extends MongoRepository<StackOverflowQuestion, String> {

>>>>>>> b12a7da398c62077fabda95522c2895a001acddf
}
