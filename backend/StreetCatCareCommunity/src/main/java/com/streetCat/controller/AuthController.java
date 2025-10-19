package com.streetCat.controller;

import com.streetCat.service.AuthService;
import com.streetCat.utils.WxApiUtil;
import com.streetCat.vo.response.UserLoginResponse;
import com.streetCat.vo.response.WxSessionResp;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 用户相关接口
 * @author your-name
 */
@RestController
@Tag(name = "用户模块")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PatchMapping("/user/me")
    @Operation(summary = "修改个人资料（字段可空）")
    public Object updateMe(@RequestBody Object dto) {
        // TODO
        return null;
    }

    @PostMapping("/auth/login-wechat")
    @Operation(summary = "微信openid一键登录/注册")
    public ResponseEntity<UserLoginResponse> loginWechat(@RequestBody String code) {
        UserLoginResponse resp = authService.loginWechat(code);
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/user/location")
    @Operation(summary = "更新常驻地理位置")
    public Object updateLocation(@RequestBody Object dto) {
        // TODO
        return null;
    }

    @GetMapping("/user/{userid}")
    @Operation(summary = "查看某个id对应的用户（小程序端）")
    public Object getUser(@PathVariable String userid) {
        // TODO
        return null;
    }
}