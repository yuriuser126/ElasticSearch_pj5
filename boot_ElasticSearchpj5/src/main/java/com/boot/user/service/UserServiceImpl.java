package com.boot.user.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.boot.user.dao.UserDAO;
import com.boot.user.dto.UserDTO;

@Service
public class UserServiceImpl implements UserService {
	@Autowired
	private SqlSession sqlSession;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	@Override
	public int userJoin(HashMap<String, String> param) {
		int re = -1;
		UserDAO dao = sqlSession.getMapper(UserDAO.class);
		
		// 비밀번호 암호화
	    String rawPassword = param.get("userPw");
	    String encodedPassword = passwordEncoder.encode(rawPassword);
	    param.put("userPw", encodedPassword);

		re = dao.userJoin(param);
		return re;
	}


	@Override
	public ArrayList<UserDTO> userLogin(HashMap<String, String> param) {
		UserDAO dao = sqlSession.getMapper(UserDAO.class);
		ArrayList<UserDTO> list = dao.userLogin(param);
//		System.out.println("실행됨");
		return list;
	}

	@Override
	public UserDTO checkId(HashMap<String, String> param) {
		UserDAO dao = sqlSession.getMapper(UserDAO.class);
		UserDTO dto = dao.checkId(param);
		return dto;
	}

	@Override
	public UserDTO getUserInfo(HashMap<String, String> param) {
		UserDAO dao = sqlSession.getMapper(UserDAO.class);
		UserDTO dto = dao.getUserInfo(param);
//		System.out.println("실행됨");
		return dto;
	}

	@Override
	public int updateUserInfo(HashMap<String, String> param) {
		UserDAO dao = sqlSession.getMapper(UserDAO.class);
		int re = dao.updateUserInfo(param);
		return re;
	}

//	@Override
//	public int updateUserPwInfo(HashMap<String, String> param) {
//		UserDAO dao = sqlSession.getMapper(UserDAO.class);
//		int re = dao.updateUserPwInfo(param);
//		return re;
//	}
	@Override
	public int updateUserPwInfo(HashMap<String, String> param) {
		UserDAO dao = sqlSession.getMapper(UserDAO.class);
	    // 새 비밀번호 암호화 - 명시적으로 확인
	    if (!param.containsKey("encodedPassword")) {
	        String newPassword = param.get("userNewPw");
	        String encodedPassword = passwordEncoder.encode(newPassword);
	        param.put("encodedPassword", encodedPassword);
	    }
	    
	    return dao.updateUserPwInfo(param);
	}

	@Override
	public boolean verifyPassword(HashMap<String, String> param) {
	    try {
	        // 필요한 파라미터 검증
	        if (!param.containsKey("userId") || !param.containsKey("userPw")) {
	            return false;
	        }
	        
	        UserDAO dao = sqlSession.getMapper(UserDAO.class);
	        // 1. 사용자 ID로 사용자 정보 조회 (암호화된 비밀번호 포함)
	        UserDTO user = dao.getUserInfo(param);
	        
	        // 2. 사용자가 존재하지 않으면 false 반환
	        if (user == null) {
	            return false;
	        }
	        
	        String rawPassword = param.get("userPw");
	        // 3. BCryptPasswordEncoder를 사용하여 비밀번호 일치 여부 확인
	        // matches 메서드는 평문 비밀번호와 암호화된 비밀번호를 비교
	        return passwordEncoder.matches(rawPassword, user.getUserPw());
	    } catch (Exception e) {
	        // 로깅 추가
	        e.printStackTrace();
	        return false;
	    }
	}


	@Override
	public boolean checkEmail(String email) {
		UserDAO dao = sqlSession.getMapper(UserDAO.class);
		int count = dao.checkEmail(email);
		return count > 0;
	}
}
