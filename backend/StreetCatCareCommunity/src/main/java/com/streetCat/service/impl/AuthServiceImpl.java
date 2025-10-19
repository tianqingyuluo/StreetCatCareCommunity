package com.streetCat.service.impl;

import com.streetCat.dao.UserMapper;
import com.streetCat.pojo.User;
import com.streetCat.service.AuthService;
import com.streetCat.utils.JwtUtil;
import com.streetCat.utils.RandomUtil;
import com.streetCat.utils.WxApiUtil;
import com.streetCat.vo.response.UserLoginResponse;
import com.streetCat.vo.response.WxSessionResp;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserMapper userMapper;
    public UserLoginResponse loginWechat(String code) {
        // 1. 拿微信 session
        WxSessionResp wx = WxApiUtil.code2session(code);
        String openid = wx.getOpenid();
        String unionid = wx.getUnionid();
        // 2. 根据 openid 查库
        User user = userMapper.selectByOpenid(openid);

        String type;
        if (user == null) {
            // 3. 注册
            Long uid = RandomUtil.nextId();                 // 程序生成ID
            String nickname = RandomUtil.randomNickname();  // 随机昵称

            // 入库：只插核心字段
            userMapper.insertUser(uid, openid, unionid, nickname);
            user = new User();
            user.setId(String.valueOf(uid));
            user.setNickname(nickname);
            type = "REGISTER";
        } else {
            // 4. 登录
            type = "LOGIN";
        }

        // 5. 生成自己系统的 token
        String accessToken = JwtUtil.create(user.getId());
        UserLoginResponse resp = new UserLoginResponse();

        resp.setType(type);
        resp.setAccessToken(accessToken);
        resp.setExpiresIn(7200);
        resp.setUser(user);
        return resp;
    }

}
