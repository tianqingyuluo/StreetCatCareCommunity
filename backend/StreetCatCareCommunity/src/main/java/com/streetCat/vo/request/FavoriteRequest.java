package com.streetCat.vo.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class FavoriteRequest {

    @Schema(
            description = "收藏目标类型",
            example = "CAT",
            allowableValues = {"CAT", "POST"}
    )
    private String targetType;

    @Schema(
            description = "收藏目标ID",
            example = "123456789"
    )
    private String targetId;
}