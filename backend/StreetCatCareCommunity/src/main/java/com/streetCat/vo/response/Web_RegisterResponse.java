package com.streetCat.vo.response;

import lombok.Data;

@Data
public class Web_RegisterResponse {
    private String id;
    private String phone;
    private String realName;
    private String loginFail;
    private String role;
    private String password;
}
