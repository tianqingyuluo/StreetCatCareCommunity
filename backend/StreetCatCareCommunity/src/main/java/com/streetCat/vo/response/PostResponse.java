package com.streetCat.vo.response;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.streetCat.pojo.Post;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// 创建新的响应类
@Data
public class PostResponse {
    private String id;
    private String title;
    private String content;
    private String authorId;
    private String postType;
    private List<String> images; // 直接使用List类型
    private Boolean isTop;
    private Boolean isElite;
    private String mark;
    private Integer likeCount;
    private Integer commentCount;
    private Integer viewCount;
    private String status;
    private LocalDateTime createdAt;

    // 从Post转换的构造方法
    public PostResponse(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.authorId = post.getAuthorId();
        this.postType = post.getPostType();
        this.isTop = post.getIsTop();
        this.isElite = post.getIsElite();
        this.mark = post.getMark();
        this.likeCount = post.getLikeCount();
        this.commentCount = post.getCommentCount();
        this.viewCount = post.getViewCount();
        this.status = post.getStatus();
        this.createdAt = post.getCreatedAt();

        // 转换images
        if (post.getImages() != null) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                this.images = objectMapper.readValue(post.getImages(), new TypeReference<List<String>>() {});
            } catch (Exception e) {
                this.images = new ArrayList<>();
            }
        } else {
            this.images = new ArrayList<>();
        }
    }
}
