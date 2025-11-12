package com.streetCat.pojo;

import com.streetCat.vo.response.GetUserResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "帖子详情（包含用户信息）")
public class PostWithUser extends Post {

    @Schema(description = "作者信息")
    private GetUserResponse.UserInfo authorInfo;
}
