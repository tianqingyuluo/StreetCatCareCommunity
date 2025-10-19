package com.streetCat.service;

import com.streetCat.vo.response.UserLoginResponse;

public interface AuthService {
    UserLoginResponse loginWechat(String code);//微信一键登录注册方法
}
