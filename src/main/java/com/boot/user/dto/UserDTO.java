package com.boot.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
// 데이터 불러올 때 비밀번호가 필요한 서비스일때만 이거 사용
public class UserDTO {
	private int userNumber;
	private String userId;
	@JsonIgnore
	private String userPw;
	private String userName;
	private String userEmail;
	private String userTel;
	private String userBirth;
	private String userZipCode;
	private String userAddress;
	@JsonIgnore
	private String userDetailAddress = "";
	private int userAdmin;
	private String userRegdate;
	
	@Override
	public String toString() {
	    return "UserDTO(userNumber=" + userNumber + 
	           ", userId=" + userId + 
	           ", userPw=[PROTECTED]" + // 비밀번호 해시 숨김
	           ", userName=" + userName + 
	           ", userEmail=" + userEmail + 
	           ", userTel=" + userTel + 
	           ", userBirth=" + userBirth + 
	           ", userZipCode=" + userZipCode + 
	           ", userAddress=" + userAddress + 
	           ", userDetailAddress=[PROTECTED]"+
	           ", userAdmin=" + userAdmin + 
	           ", userRegdate=" + userRegdate + ")";
	}
}
