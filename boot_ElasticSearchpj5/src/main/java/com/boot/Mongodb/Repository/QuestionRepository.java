package com.boot.Mongodb.Repository;


import com.boot.Mongodb.Model.Question;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface QuestionRepository extends MongoRepository<Question, String> {
}