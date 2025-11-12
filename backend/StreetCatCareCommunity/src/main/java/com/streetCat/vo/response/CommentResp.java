package com.streetCat.vo.response;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.streetCat.pojo.Comment;
import com.streetCat.pojo.UserInfo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Schema(description = "评论响应")
public class CommentResp {

    @Schema(description = "评论ID", example = "123")
    private String id;

    @Schema(description = "评论内容")
    private String content;

    @Schema(description = "作者ID")
    private String authorId;

    @Schema(description = "作者信息")
    private UserInfo author;

    @Schema(description = "父评论ID")
    private String parentId;

    @Schema(description = "点赞数", example = "10")
    private Integer likeCount;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "子评论列表")
    private List<CommentResp> child;
    private String targetType;   // 新增
    private String targetId;     // 新增

    @Schema(description = "图片地址")
    private List<String> photos;
    public CommentResp(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.author = comment.getAuthor();
        this.parentId = comment.getParentId();
        this.likeCount = comment.getLikeCount();
        this.createdAt = comment.getCreatedAt();
        this.targetType = comment.getTargetType();
        this.targetId = comment.getTargetId();

        this.photos = new ArrayList<>();
        if (comment.getPhotos() != null && !comment.getPhotos().trim().isEmpty()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                this.photos = mapper.readValue(comment.getPhotos(), new TypeReference<List<String>>() {});
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }

    public CommentResp() {

    }
}