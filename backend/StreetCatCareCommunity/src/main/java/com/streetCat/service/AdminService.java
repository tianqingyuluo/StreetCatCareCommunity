package com.streetCat.service;

import com.streetCat.utils.R;
import com.streetCat.vo.request.Web_AdminLoginRequest;
import com.streetCat.vo.request.Web_AdminRegisterRequest;
import com.streetCat.vo.response.Web_AuthResponse;

public interface AdminService {
    R<Web_AuthResponse> register(Web_AdminRegisterRequest req);
    R<Web_AuthResponse> login(Web_AdminLoginRequest req);
}
