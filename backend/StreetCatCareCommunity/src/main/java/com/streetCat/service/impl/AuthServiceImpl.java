package com.streetCat.service.impl;

import com.streetCat.dao.UserMapper;
import com.streetCat.pojo.User;
import com.streetCat.service.AuthService;
import com.streetCat.utils.JwtUtil;
import com.streetCat.utils.RandomUtil;
import com.streetCat.utils.WxApiUtil;
import com.streetCat.vo.request.PutUserLocationRequest;
import com.streetCat.vo.request.PutUserRequest;
import com.streetCat.vo.response.GetUserResponse;
import com.streetCat.vo.response.UserLoginResponse;
import com.streetCat.vo.response.WxSessionResp;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserMapper userMapper;
    public UserLoginResponse loginWechat(String code) {
        // 1. 拿微信 session
        WxSessionResp wx = WxApiUtil.code2session(code);
//        if (wx == null || wx.getOpenid() == null) {
//            throw new RuntimeException("微信登录失败：无法获取用户信息");
//        }
        String openid = wx.getOpenid();
        String unionid = wx.getUnionid();
        // 2. 根据 openid 查库
        User user = userMapper.selectByOpenid(openid);
        user = userMapper.selectById("1979906218117959680");
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

    @Override
    public GetUserResponse getUserById(String userid) {
        User user = userMapper.selectById(userid);
        if (user == null) {
            return null;
        }

        GetUserResponse resp = new GetUserResponse();
        BeanUtils.copyProperties(user, resp);

        GetUserResponse.UserInfo userInfo = new GetUserResponse.UserInfo();
        userInfo.setAvatarUrl(user.getAvatarUrl());
        userInfo.setId(user.getId());
        userInfo.setNickname(user.getNickname());
        resp.setUserInfo(userInfo);

        return resp;
    }

    @Override
    public GetUserResponse putUserById(String userId, PutUserRequest putUserRequest) {
        int updated = userMapper.putUserById(userId,putUserRequest);
        if (updated == 0) {
            throw new RuntimeException("更新失败");
        }
        return getUserById(userId);
    }

    @Override
    public void updateLocationById(String userId, PutUserLocationRequest putUserLocationRequest) {
        if (putUserLocationRequest.getLon() != null && putUserLocationRequest.getLat() != null) {
            Double lon = putUserLocationRequest.getLon();
            Double lat = putUserLocationRequest.getLat();

            if (lon < -180 || lon > 180) {
                throw new RuntimeException("经度范围错误，应在 -180 到 180 之间");
            }
            if (lat < -90 || lat > 90) {
                throw new RuntimeException("纬度范围错误，应在 -90 到 90 之间");
            }
        }
        userMapper.putUserLocationById(userId,putUserLocationRequest);
    }

}
