package com.streetCat.pojo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Like {
    private String id;
    private String userId;
    private String targetType;
    private String targetId;
    private LocalDateTime createdAt;
}