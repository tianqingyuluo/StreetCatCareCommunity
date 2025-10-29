package com.streetCat.service.impl;

import com.streetCat.dao.AdminInfoMapper;
import com.streetCat.exception.BizCode;
import com.streetCat.pojo.AdminInfo;
import com.streetCat.service.AdminService;
import com.streetCat.utils.JwtUtil;
import com.streetCat.utils.PasswordGenerator;
import com.streetCat.utils.R;
import com.streetCat.vo.request.Web_AdminLoginRequest;
import com.streetCat.vo.request.Web_AdminRegisterRequest;
import com.streetCat.vo.response.Web_AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final AdminInfoMapper adminInfoMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public R<Web_AuthResponse> register(Web_AdminRegisterRequest req) {
        if(adminInfoMapper.existsByPhone(req.getPhone())){
            return R.fail(BizCode.DUPLICATE_RESOURCE);
        }
        String password = PasswordGenerator.random(8);

        AdminInfo adminInfo = AdminInfo
                .builder()
                .realName(req.getRealName())
                .phone(req.getPhone())
                .role(req.getRole())
                .password(passwordEncoder.encode(password))
                .build();
        adminInfoMapper.insert(adminInfo);
        adminInfo.setPassword((password));
        Web_AuthResponse web_authResponse = new Web_AuthResponse(adminInfo,null,null);
        return R.ok(web_authResponse);
    }

    @Override
    public R<Web_AuthResponse> login(Web_AdminLoginRequest req) {
        AdminInfo adminInfo = adminInfoMapper.getByPhone(req.getPhone());
        if(adminInfo==null||!passwordEncoder.matches(req.getPassword(),adminInfo.getPassword())){
            return R.fail(BizCode.AUTH_FAIL);
        }
        else{
            String accessToken = JwtUtil.create(adminInfo.getId());
            adminInfo.setPassword((null));
            Web_AuthResponse web_authResponse = new Web_AuthResponse(adminInfo,accessToken,7200);
            return R.ok(web_authResponse);
        }
    }
}
