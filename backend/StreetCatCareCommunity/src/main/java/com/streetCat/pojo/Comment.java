package com.streetCat.pojo;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class Comment {
    private String id;
    private String content;
    private UserInfo author;
    private String parentId;
    private Integer likeCount;
    private String photos;
    private LocalDateTime createdAt;
    private String targetType;   // 新增
    private String targetId;     // 新增
}
