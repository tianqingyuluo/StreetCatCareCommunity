package com.streetCat.vo.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class Web_AdminLoginRequest {
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

    @NotBlank(message = "密码不能为空")
    @Pattern(regexp = "^[A-Za-z0-9]{6,20}$", message = "密码格式或位数不正确")
    private String password;
}
