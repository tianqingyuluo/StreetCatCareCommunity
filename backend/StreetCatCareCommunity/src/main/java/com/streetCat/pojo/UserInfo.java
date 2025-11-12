package com.streetCat.pojo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "用户信息")
public class UserInfo {

    @Schema(description = "用户ID", example = "123")
    private String id;

    @Schema(description = "昵称", example = "猫奴小张")
    private String nickname;

    @Schema(description = "头像地址", example = "https://example.com/avatar.jpg")
    private String avatarUrl;
}