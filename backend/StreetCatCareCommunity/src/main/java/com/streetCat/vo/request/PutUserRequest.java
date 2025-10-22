package com.streetCat.vo.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "更新用户信息请求")
public class PutUserRequest {

    @Schema(description = "昵称", example = "爱猫人士")
    private String nickname;

    @Schema(description = "头像URL", example = "https://example.com/avatar.jpg")
    private String avatarUrl;

    @Schema(description = "手机号", example = "13812345678")
    private String phone;

    @Schema(description = "邮箱", example = "user@example.com")
    private String email;
}