package com.streetCat.pojo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Like {
    private Long id;
    private Long userId;
    private String targetType;
    private Long targetId;
    private LocalDateTime createdAt;
}