package com.streetCat.vo.response;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.streetCat.pojo.PostWithUser;
import com.streetCat.vo.response.GetUserResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Schema(description = "帖子详情响应（包含用户信息）")
public class PostWithUserResponse {

    @Schema(description = "帖子ID", example = "0")
    private String id;

    @Schema(description = "标题", example = "今日街拍")
    private String title;

    @Schema(description = "内容", example = "今天拍到一只超酷的猫～")
    private String content;

    @Schema(description = "作者ID", example = "0")
    private String authorId;

    @Schema(description = "帖子类型", example = "DISCUSSION")
    private String postType;

    @Schema(description = "图片地址列表")
    private List<String> images;

    @Schema(description = "点赞数", example = "0")
    private Integer likeCount;

    @Schema(description = "评论数", example = "0")
    private Integer commentCount;

    @Schema(description = "浏览数", example = "0")
    private Integer viewCount;

    @Schema(description = "是否置顶", example = "true")
    private Boolean isTop;

    @Schema(description = "是否加精", example = "true")
    private Boolean isElite;

    @Schema(description = "状态", example = "PUBLISHED")
    private String status;

    @Schema(description = "创建时间", example = "2019-08-24T14:15:22.123Z")
    private LocalDateTime createdAt;

    @Schema(description = "作者信息")
    private GetUserResponse.UserInfo authorInfo;

    public PostWithUserResponse(PostWithUser postWithUser) {
        this.id = postWithUser.getId();
        this.title = postWithUser.getTitle();
        this.content = postWithUser.getContent();
        this.authorId = postWithUser.getAuthorId();
        this.postType = postWithUser.getPostType();
        this.likeCount = postWithUser.getLikeCount();
        this.commentCount = postWithUser.getCommentCount();
        this.viewCount = postWithUser.getViewCount();
        this.isTop = postWithUser.getIsTop();
        this.isElite = postWithUser.getIsElite();
        this.status = postWithUser.getStatus();
        this.createdAt = postWithUser.getCreatedAt();
        this.authorInfo = postWithUser.getAuthorInfo();

        // 转换images字段
        this.images = convertImagesToArray(postWithUser.getImages());
    }
    public PostWithUserResponse() {

    }

    private List<String> convertImagesToArray(String imagesJson) {
        if (imagesJson == null || imagesJson.trim().isEmpty()) {
            return new ArrayList<>();
        }
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(imagesJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public void setAuthorInfo(String postAuthorId, String postAuthorAvatarUrl, String postAuthorNickname) {
        this.setAuthorInfo(new GetUserResponse.UserInfo(postAuthorId,postAuthorAvatarUrl,postAuthorNickname));
    }
}