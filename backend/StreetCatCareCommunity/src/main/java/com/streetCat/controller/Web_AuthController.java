package com.streetCat.controller;

import com.streetCat.service.AdminService;
import com.streetCat.utils.R;
import com.streetCat.vo.request.Web_AdminLoginRequest;
import com.streetCat.vo.request.Web_AdminRegisterRequest;
import com.streetCat.vo.response.Web_AuthResponse;
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
        R<Web_AuthResponse> r = adminService.register(request);
        return ResponseEntity.status(r.getCode()).body(r.getData());
    }

    @PostMapping("/auth/login-web")
    public ResponseEntity<Object> login(@Valid @RequestBody Web_AdminLoginRequest request) {
        R<Web_AuthResponse> r = adminService.login(request);
        return ResponseEntity.status(r.getCode()).body(r.getData());
    }
}
