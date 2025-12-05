package com.streetCat.pojo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Admin {
    String id;
    String phone;
    String realName;
    String loginFail;
    String role;
    String password;
}
