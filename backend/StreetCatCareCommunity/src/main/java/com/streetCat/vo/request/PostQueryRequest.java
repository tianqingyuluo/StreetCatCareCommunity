package com.streetCat.vo.request;

import lombok.Data;

@Data
public class PostQueryRequest {
    private String keyword;
    private PostType postType;
    private SortType sort = SortType.CREATED_AT_DESC;
    private Integer page = 1;
    private Integer size;

    /**
     * 帖子类型枚举
     */
    public enum PostType {
        DISCUSSION,   // 讨论
        EXPERIENCE,   // 经验
        HELP          // 求助
    }

    /**
     * 排序类型枚举
     */
    public enum SortType {
        CREATED_AT_DESC,  // 创建时间倒序
        CREATED_AT_ASC,   // 创建时间正序
        LIKE_COUNT_DESC,  // 点赞数倒序
        VIEW_COUNT_DESC   // 浏览数倒序
    }
}