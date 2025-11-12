package com.streetCat.vo.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "创建评论请求")
public class CreateCommentRequest {

    @NotNull(message = "目标类型不能为空")
    @Schema(description = "目标类型", example = "CAT", allowableValues = {"CAT", "POST"})
    private String targetType;

    @NotNull(message = "目标ID不能为空")
    @Schema(description = "目标ID", example = "123")
    private String targetId;

    @Schema(description = "父评论ID", example = "456")
    private String parentId;

    @NotNull(message = "评论内容不能为空")
    @Size(max = 1000, message = "评论内容不能超过1000字符")
    @Schema(description = "评论内容", example = "这只猫真可爱！")
    private String content;

    @Schema(description = "图片地址", example = "[\"https://example.com/photo1.jpg\"]")
    private String photos;
}