package com.streetCat.vo.response;

import com.streetCat.pojo.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class UserLoginResponse {

    @Schema(description = "LOGIN=登录；REGISTER=注册", example = "LOGIN")
    private String type;
    @Schema(description = "验证用token")
    private String accessToken;
    @Schema(example = "7200")
    private Integer expiresIn;
    private User user;
}
