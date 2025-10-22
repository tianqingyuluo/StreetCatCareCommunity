package com.streetCat.controller;

import com.streetCat.service.AuthService;
import com.streetCat.utils.JwtUtil;
import com.streetCat.utils.WxApiUtil;
import com.streetCat.vo.request.PutUserLocationRequest;
import com.streetCat.vo.request.PutUserRequest;
import com.streetCat.vo.response.GetUserResponse;
import com.streetCat.vo.response.UserLoginResponse;
import com.streetCat.vo.response.WxSessionResp;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<Object> updateMe(@RequestHeader("Authorization") String token,
                                           @RequestBody PutUserRequest putUserRequest) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("未携带token或token格式错误");
        }
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        GetUserResponse response = authService.putUserById(userId,putUserRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth/login-wechat")
    @Operation(summary = "微信openid一键登录/注册")
    public ResponseEntity<Object> loginWechat(@RequestBody String code) {
        try {
            UserLoginResponse resp = authService.loginWechat(code);
            return ResponseEntity.ok(resp);
        } catch (RuntimeException e) {
            // 微信登录失败的情况，返回 400 Bad Request
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("传入code无法解析出openid");
        } catch (Exception e) {
            // 其他异常，返回 500 Internal Server Error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/user/location")
    @Operation(summary = "更新常驻地理位置")
    public Object updateLocation(@RequestHeader("Authorization") String token,
                                 @RequestBody PutUserLocationRequest putUserLocationRequest) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("未携带token或token格式错误");
        }
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        authService.updateLocationById(userId,putUserLocationRequest);
        return ResponseEntity.status(HttpStatus.OK).body("更新位置信息成功");
    }

    @GetMapping("/user/{userid}")
    @Operation(summary = "查看某个id对应的用户（小程序端）")
    public ResponseEntity<GetUserResponse> getUser(@PathVariable String userid) {
        GetUserResponse response = authService.getUserById(userid);
        return ResponseEntity.ok(response);
    }
}