package com.streetCat.vo.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FavoriteDetailResponse {
    private String targetType;
    private Long targetId;
    private LocalDateTime createdAt;
    private PostInfo post;
    private CatInfo cat;

    @Data
    public static class PostInfo {
        private Long id;
        private String title;
        private String content;
        private String postType;
        private String images;
        private Long authorId;
        private Integer likeCount;
        private Integer commentCount;
        private Integer viewCount;
        private String status;
        private LocalDateTime createdAt;
        private String mark;
        private Integer favoriteCount;
    }

    @Data
    public static class CatInfo {
        private Long id;
        private String name;
        private String breed;
        private String gender;
        private Integer ageMonths;
        private String healthStatus;
        private String description;
        private String photos;
        private Boolean isNeutered;
        private String vaccinationStatus;
        private String status;
        private Long shelterId;
        private Long createdBy;
        private Integer likeCount;
        private Integer commentCount;
        private Integer viewCount;
        private Integer favoriteCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}