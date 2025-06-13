package com.boot.user.service;

import java.util.ArrayList;
import java.util.HashMap;

import com.boot.user.dto.UserDTO;

public interface UserService {
	public int userJoin(HashMap<String, String> param);

	public ArrayList<UserDTO> userLogin(HashMap<String, String> param);

	public UserDTO checkId(HashMap<String, String> param);

	public UserDTO getUserInfo(HashMap<String, String> param);

	public int updateUserInfo(HashMap<String, String> param);

	public int updateUserPwInfo(HashMap<String, String> param);

	public boolean verifyPassword(HashMap<String, String> param);

	public boolean checkEmail(String email);
}
