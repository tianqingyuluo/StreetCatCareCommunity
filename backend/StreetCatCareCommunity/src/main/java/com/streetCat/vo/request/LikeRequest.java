package com.streetCat.vo.request;

import lombok.Data;

@Data
public class LikeRequest {
    private Long userId;
    private String targetType;
    private Long targetId;
}