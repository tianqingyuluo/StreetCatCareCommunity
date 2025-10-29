package com.streetCat.vo.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class Web_AdminRegisterRequest {
    @NotBlank(message = "用户名不能为空")
    @Size(min = 2, max = 10, message = "用户名长度必须在2-10之间")
    @Pattern(regexp = "^[\\u4e00-\\u9fa5]+$", message = "用户名只能包含中文汉字")
    private String realName;

    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

    @NotBlank(message = "权限设置不能为空")
    @Pattern(regexp = "^(SHELTER_MEMBER|SHELTER_MANAGER|SYSTEM_ADMIN)$", message = "权限设置不正确")
    private String role;
}
