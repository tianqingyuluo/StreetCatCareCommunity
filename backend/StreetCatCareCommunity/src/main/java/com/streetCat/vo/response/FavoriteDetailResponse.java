package com.streetCat.vo.response;

import com.streetCat.pojo.Cat;
import com.streetCat.pojo.PostWithUser;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FavoriteDetailResponse {
    private String targetType;
    private String targetId;
    private LocalDateTime createdAt;

    // 帖子相关字段
    private String postId;
    private String postTitle;
    private String postContent;
    private String postType;
    private String postAuthorId;
    private Integer postLikeCount;
    private Integer postCommentCount;
    private Integer postViewCount;
    private String postImages; // 帖子图片，存储为字符串
    private String postStatus;
    private LocalDateTime postCreatedAt;
    private String postMark;
    private Integer postFavoriteCount;

    private String postAuthorAvatarUrl;
    private String postAuthorNickname;

    // 猫咪相关字段
    private String catId;
    private String catName;
    private String catBreed;
    private String catGender;
    private Integer catAgeMonths;
    private String catHealthStatus;
    private String catDescription;
    private String catPhotos; // 猫咪图片，存储为字符串
    private Boolean catIsNeutered;
    private String catVaccinationStatus;
    private String catStatus;
    private String catShelterId;
    private String catCreatedBy;
    private Long catLikeCount;
    private Long catCommentCount;
    private Long catViewCount;
    private Long catFavoriteCount;
    private LocalDateTime catCreatedAt;
    private LocalDateTime catUpdatedAt;
}