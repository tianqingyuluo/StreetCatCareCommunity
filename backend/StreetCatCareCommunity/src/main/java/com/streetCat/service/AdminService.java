package com.streetCat.service;

import com.streetCat.utils.R;
import com.streetCat.vo.request.UpdateAdminRequest;
import com.streetCat.vo.request.Web_AdminLoginRequest;
import com.streetCat.vo.request.Web_AdminRegisterRequest;
import com.streetCat.vo.response.AdminResponse;
import com.streetCat.vo.response.Web_LoginResponse;
import com.streetCat.vo.response.Web_RegisterResponse;

public interface AdminService {
    R<Web_RegisterResponse> register(Web_AdminRegisterRequest req);
    R<Web_LoginResponse> login(Web_AdminLoginRequest req);
    R<String> updatePassword(String id,String oldPassword,String newPassword);
    R<AdminResponse> updateAdmin(String id, UpdateAdminRequest req,String adminId);
}
