package com.boot.Reddit.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.boot.Reddit.DTO.RedditItem;

/**
 * RedditItem 객체를 MongoDB에 저장하거나 불러오기 위한 인터페이스
 * MongoRepository를 상속받아 CRUD(생성, 조회, 수정, 삭제) 기능을 자동으로 제공받음
 *
 * - RedditItem: 저장할 데이터의 형식 (DTO)
 * - String: 각 RedditItem의 기본 키(id)의 자료형
 */

public interface RedditRepository extends MongoRepository<RedditItem, String> {
	 // 기본적인 save(), findAll(), findById() 등의 메서드는 자동으로 제공됨
	
}
