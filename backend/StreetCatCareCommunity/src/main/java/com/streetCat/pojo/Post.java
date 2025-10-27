package com.streetCat.pojo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Schema(description = "帖子内容实体")
public class Post {

    @Schema(description = "标题", example = "今日街拍")
    private String title;

    @Schema(description = "内容", example = "今天拍到一只超酷的猫～")
    private String content;

    @Schema(description = "帖子类型", example = "DISCUSSION")
    private String postType;

    @Schema(description = "图片地址列表")
    private List<String> images;

    @Schema(description = "是否置顶", example = "true")
    private Boolean isTop;

    @Schema(description = "是否加精", example = "true")
    private Boolean isElite;

    @Schema(description = "帖子ID", example = "0")
    private String id;

    @Schema(description = "作者ID", example = "0")
    private String authorId;

    @Schema(description = "拒绝理由或备注")
    private String mark;

    @Schema(description = "点赞数", example = "0")
    private Integer likeCount;

    @Schema(description = "评论数", example = "0")
    private Integer commentCount;

    @Schema(description = "浏览数", example = "0")
    private Integer viewCount;

    @Schema(description = "状态", example = "PUBLISHED")
    private String status;

    @Schema(description = "创建时间", example = "2019-08-24T14:15:22.123Z")
    private LocalDateTime createdAt;
}