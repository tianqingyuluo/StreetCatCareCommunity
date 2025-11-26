package com.streetCat.vo.response;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class FavoriteDetailResponseWithListPhotos {
    private String targetType;
    private Long targetId;
    private LocalDateTime createdAt;

    private PostWithUserResponse post; // 使用 PostWithUserResponse 封装帖子信息
    private CatResponse cat; // 使用 CatResponse 封装猫咪信息

    // 构造函数：从 FavoriteDetailResponse 转换
    public FavoriteDetailResponseWithListPhotos(FavoriteDetailResponse favoriteDetailResponse) {
        this.targetType = favoriteDetailResponse.getTargetType();
        this.targetId = favoriteDetailResponse.getTargetId();
        this.createdAt = favoriteDetailResponse.getCreatedAt();

        // 初始化 PostWithUserResponse 对象
        if (favoriteDetailResponse.getPostId() != null) {
            this.post = new PostWithUserResponse();
            this.post.setId(String.valueOf(favoriteDetailResponse.getPostId()));
            this.post.setTitle(favoriteDetailResponse.getPostTitle());
            this.post.setContent(favoriteDetailResponse.getPostContent());
            this.post.setAuthorId(String.valueOf(favoriteDetailResponse.getPostAuthorId()));
            this.post.setPostType(favoriteDetailResponse.getPostType());
            this.post.setLikeCount(favoriteDetailResponse.getPostLikeCount());
            this.post.setCommentCount(favoriteDetailResponse.getPostCommentCount());
            this.post.setViewCount(favoriteDetailResponse.getPostViewCount());
            this.post.setStatus(favoriteDetailResponse.getPostStatus());
            this.post.setCreatedAt(favoriteDetailResponse.getPostCreatedAt());
            this.post.setAuthorInfo(String.valueOf(favoriteDetailResponse.getPostAuthorId()),
                    favoriteDetailResponse.getPostAuthorAvatarUrl(),favoriteDetailResponse.getPostAuthorNickname());
            // 转换帖子图片字段
            this.post.setImages(convertStringToList(favoriteDetailResponse.getPostImages()));
        }

        // 初始化 CatResponse 对象
        if (favoriteDetailResponse.getCatId() != null) {
            this.cat = new CatResponse();
            this.cat.setId(String.valueOf(favoriteDetailResponse.getCatId()));
            this.cat.setName(favoriteDetailResponse.getCatName());
            this.cat.setBreed(favoriteDetailResponse.getCatBreed());
            this.cat.setGender(favoriteDetailResponse.getCatGender());
            this.cat.setAgeMonths(favoriteDetailResponse.getCatAgeMonths());
            this.cat.setHealthStatus(favoriteDetailResponse.getCatHealthStatus());
            this.cat.setDescription(favoriteDetailResponse.getCatDescription());
            this.cat.setIsNeutered(favoriteDetailResponse.getCatIsNeutered());
            this.cat.setVaccinationStatus(favoriteDetailResponse.getCatVaccinationStatus());
            this.cat.setStatus(favoriteDetailResponse.getCatStatus());
            this.cat.setShelterId(String.valueOf(favoriteDetailResponse.getCatShelterId()));
            this.cat.setCreatedBy(String.valueOf(favoriteDetailResponse.getCatCreatedBy()));
            this.cat.setCreatedAt(favoriteDetailResponse.getCatCreatedAt());
            this.cat.setUpdatedAt(favoriteDetailResponse.getCatUpdatedAt());
            this.cat.setFavorite(favoriteDetailResponse.getCatFavoriteCount());
            this.cat.setComment(favoriteDetailResponse.getCatCommentCount());
            this.cat.setView(favoriteDetailResponse.getCatViewCount());
            this.cat.setLike(favoriteDetailResponse.getCatLikeCount());

            // 转换猫咪图片字段
            this.cat.setPhotos(convertStringToList(favoriteDetailResponse.getCatPhotos()));
        }
    }

    // 辅助方法：将字符串转换为列表
    private List<String> convertStringToList(String jsonString) {
        if (jsonString == null || jsonString.trim().isEmpty()) {
            return new ArrayList<>();
        }
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(jsonString, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}