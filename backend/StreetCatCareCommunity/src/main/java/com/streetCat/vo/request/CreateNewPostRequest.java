package com.streetCat.vo.request;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.util.List;

@Data
public class CreateNewPostRequest {

    @Schema(description = "帖子标题", example = "今日街拍")
    private String title;

    @Schema(description = "帖子正文", example = "今天在路上拍到一只超酷的猫～")
    private String content;

    @Schema(description = "帖子类型", example = "street")
    private String postType;

    @Schema(description = "图片地址列表")
    private List<String> images;

    @Schema(description = "是否置顶", example = "false")
    private Boolean isTop;

    @Schema(description = "是否加精", example = "false")
    private Boolean isElite;

    public String getImagesJson() {
        if (images == null || images.isEmpty()) {
            return null;
        }
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsString(images);
        } catch (JsonProcessingException e) {
            return null;
        }
    }
}