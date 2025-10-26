package com.streetCat.pojo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class User {

    @Schema(description = "手机号", example = "13812345678")
    private String phone;

    @Schema(description = "邮箱", example = "cat@example.com")
    private String email;

    @Schema(description = "经度", example = "121.473701")
    private String lon;

    @Schema(description = "纬度", example = "31.230416")
    private String lat;

    @Schema(description = "地址文字描述", example = "上海市黄浦区南京东路")
    private String address;

    @Schema(description = "userid")
    private String id;

    @Schema(description = "用户头像")
    private String avatarUrl;

    @Schema(description = "昵称")
    private String nickname;

    private String locationWkt;


}