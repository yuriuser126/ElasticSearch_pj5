package com.boot.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressUserDTO {
	private int userNumber;
	private String userId;
	private String userName;
	private String userEmail;
	private String userTel;
	private String userBirth;
	private String userZipCode;
	private String userAddress;
	private String userDetailAddress;
	private int userAdmin;
	private String userRegdate;

	public AddressUserDTO(UserDTO userDTO) {
		this.userNumber = userDTO.getUserNumber();
		this.userId = userDTO.getUserId();
		this.userName = userDTO.getUserName();
		this.userEmail = userDTO.getUserEmail();
		this.userTel = userDTO.getUserTel();
		this.userBirth = userDTO.getUserBirth();
		this.userZipCode = userDTO.getUserZipCode();
		this.userAddress = userDTO.getUserAddress();
		this.userDetailAddress = userDTO.getUserDetailAddress();
		this.userAdmin = userDTO.getUserAdmin();
		this.userRegdate = userDTO.getUserRegdate();
	}
}
