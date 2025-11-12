package com.streetCat.service.impl;

import com.streetCat.dao.AdminMapper;
import com.streetCat.exception.BizCode;
import com.streetCat.pojo.Admin;
import com.streetCat.service.AdminService;
import com.streetCat.utils.JwtUtil;
import com.streetCat.utils.PasswordGeneratorUtil;
import com.streetCat.utils.R;
import com.streetCat.utils.RandomUtil;
import com.streetCat.vo.request.Web_AdminLoginRequest;
import com.streetCat.vo.request.Web_AdminRegisterRequest;
import com.streetCat.vo.response.Web_LoginResponse;
import com.streetCat.vo.response.Web_RegisterResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final AdminMapper adminMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public R<Web_RegisterResponse> register(Web_AdminRegisterRequest req) {
        if(adminMapper.existsByPhone(req.getPhone())){
            return R.fail(BizCode.DUPLICATE_RESOURCE);
        }
        String password = PasswordGeneratorUtil.random(8);
        Admin admin = Admin
                .builder()
                .id(String.valueOf(RandomUtil.nextId()))
                .realName(req.getRealName())
                .phone(req.getPhone())
                .role(req.getRole())
                .password(passwordEncoder.encode(password))
                .build();
        adminMapper.insert(admin);
        admin = adminMapper.getByPhone(req.getPhone());
        Web_RegisterResponse webRegisterResponse = new Web_RegisterResponse();
        BeanUtils.copyProperties(admin, webRegisterResponse);
        webRegisterResponse.setPassword(password);     //返回原密码
        return R.creat_ok(webRegisterResponse);
    }

    @Override
    public R<Web_LoginResponse> login(Web_AdminLoginRequest req) {
        Admin admin = adminMapper.getByPhone(req.getPhone());
        if(admin == null||!passwordEncoder.matches(req.getPassword(), admin.getPassword())){
            return R.fail(BizCode.AUTH_FAIL);
        }
        else{
            String accessToken = JwtUtil.create(admin.getId());
            admin.setPassword((null));
            Web_LoginResponse web_loginResponse = new Web_LoginResponse();
            Web_LoginResponse.adminInfo info = new Web_LoginResponse.adminInfo();
            BeanUtils.copyProperties(admin, info);
            web_loginResponse.setAdminInfo(info);
            web_loginResponse.setAccessToken(accessToken);
            web_loginResponse.setExpiresIn("7200");     //返回原密码
            return R.ok(web_loginResponse);
        }
    }
}
