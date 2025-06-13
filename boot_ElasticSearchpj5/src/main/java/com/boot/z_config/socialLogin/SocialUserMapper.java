package com.boot.z_config.socialLogin;

import com.boot.user.dto.UserDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface  SocialUserMapper
{
    UserDTO findByUserId(String userId);
    void insertSocialUser(UserDTO user);
}
