package com.streetCat.vo.request;

import lombok.Data;

@Data
public class LikeRequest {
    private String userId;
    private String targetType;
    private String targetId;
}