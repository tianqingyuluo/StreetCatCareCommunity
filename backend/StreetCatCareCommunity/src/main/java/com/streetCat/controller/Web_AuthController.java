package com.streetCat.controller;

import com.streetCat.service.AdminService;
import com.streetCat.utils.JwtUtil;
import com.streetCat.utils.R;
import com.streetCat.vo.request.UpdateAdminRequest;
import com.streetCat.vo.request.UpdatePasswordRequest;
import com.streetCat.vo.request.Web_AdminLoginRequest;
import com.streetCat.vo.request.Web_AdminRegisterRequest;
import com.streetCat.vo.response.AdminResponse;
import com.streetCat.vo.response.Web_LoginResponse;
import com.streetCat.vo.response.Web_RegisterResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class Web_AuthController {
    private final AdminService adminService;

    @PostMapping("/admin/create-account")
    public ResponseEntity<Object> register(@Valid @RequestBody Web_AdminRegisterRequest request) {
        R<Web_RegisterResponse> r = adminService.register(request);
        if(r.getData()==null){
            return ResponseEntity.status(r.getCode()).body(r.getMsg());
        }
        return ResponseEntity.status(r.getCode()).body(r.getData());
    }

    @PostMapping("/auth/login-web")
    public ResponseEntity<Object> login(@Valid @RequestBody Web_AdminLoginRequest request) {
        R<Web_LoginResponse> r = adminService.login(request);
        if(r.getData()==null){
            return ResponseEntity.status(r.getCode()).body(r.getMsg());
        }
        return ResponseEntity.status(r.getCode()).body(r.getData());
    }

    @PutMapping("/admin/password")
    public ResponseEntity<Object> updatePassword(@RequestHeader("Authorization") String token,@Valid @RequestBody UpdatePasswordRequest request) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        R<String> r = adminService.updatePassword(userId, request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.status(r.getCode()).body(r.getMsg());
    }

    @PatchMapping("/admin/{adminId}")
    public ResponseEntity<Object> updateAdmin(@RequestHeader("Authorization") String token,@Valid @RequestBody UpdateAdminRequest request,@PathVariable String adminId) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        R<AdminResponse> r = adminService.updateAdmin(userId,request,adminId);
        if(r.getData()==null){
            return ResponseEntity.status(r.getCode()).body(r.getMsg());
        }
        return ResponseEntity.status(r.getCode()).body(r.getData());
    }
}
