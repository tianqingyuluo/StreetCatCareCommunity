package com.streetCat.service;

import com.streetCat.vo.request.PutUserLocationRequest;
import com.streetCat.vo.request.PutUserRequest;
import com.streetCat.vo.response.GetUserResponse;
import com.streetCat.vo.response.UserLoginResponse;

public interface AuthService {
    UserLoginResponse loginWechat(String code);//微信一键登录注册方法
    GetUserResponse getUserById(String userid);

    GetUserResponse putUserById(String userId, PutUserRequest putUserRequest);

    void updateLocationById(String userId, PutUserLocationRequest putUserLocationRequest);
}
