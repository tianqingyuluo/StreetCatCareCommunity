package com.streetCat.vo.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "用户信息响应VO")
public class GetUserResponse {

    @Schema(description = "用户地址")
    private String address;

    @Schema(description = "邮箱")
    private String email;

    @Schema(description = "纬度")
    private String lat;

    @Schema(description = "经度")
    private String lon;

    @Schema(description = "手机号")
    private String phone;

    @Schema(description = "用户基本信息")
    private UserInfo userInfo;

    @Data
    @Schema(description = "用户基本信息")
    public static class UserInfo {

        @Schema(description = "头像URL")
        private String avatarUrl;

        @Schema(description = "用户ID")
        private String id;

        @Schema(description = "昵称")
        private String nickname;

        public UserInfo(String postAuthorId, String postAuthorAvatarUrl, String postAuthorNickname) {
            this.avatarUrl = postAuthorAvatarUrl;
            this.id = postAuthorId;
            this.nickname = postAuthorNickname;
        }

        public UserInfo() {

        }
    }
}