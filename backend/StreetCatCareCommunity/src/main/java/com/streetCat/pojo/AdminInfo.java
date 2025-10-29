package com.streetCat.pojo;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class AdminInfo {
    String id;
    String phone;
    String realName;
    String loginFail;
    String role;
    String password;
}
