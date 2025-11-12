package com.streetCat.vo.response;

import lombok.Data;

@Data
public class Web_LoginResponse {
    private adminInfo adminInfo;
    private String accessToken;
    private String expiresIn;
    @Data
    public static class adminInfo {
        private String id;
        private String phone;
        private String realName;
        private String loginFail;
        private String role;
    }
}
