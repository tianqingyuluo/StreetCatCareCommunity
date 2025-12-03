package com.streetCat.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.streetCat.dao.MainCatMapper;
import com.streetCat.dao.PostMapper;
import com.streetCat.pojo.Comment;
import com.streetCat.service.CommentService;
import com.streetCat.utils.BusinessException;
import com.streetCat.utils.JwtUtil;
import com.streetCat.vo.request.CreateCommentRequest;
import com.streetCat.vo.response.CommentResp;
import com.streetCat.vo.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/comments")
@Tag(name = "评论模块")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final PostMapper postMapper;
    private final MainCatMapper catMapper;

    @PostMapping
    @Operation(summary = "发布评论")
    public ResponseEntity<Object> createComment(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> requestBody) {

        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("未携带token或token格式错误");
        }

        try {
            String userId = JwtUtil.parse(token.replace("Bearer ", ""));

            // 手动构建评论请求对象
            CreateCommentRequest createCommentRequest = new CreateCommentRequest();
            createCommentRequest.setTargetType((String) requestBody.get("targetType"));
            createCommentRequest.setTargetId((String) requestBody.get("targetId"));
            createCommentRequest.setParentId((String) requestBody.get("parentId"));
            createCommentRequest.setContent((String) requestBody.get("content"));

            // 处理photos字段 - 统一转为JSON字符串
            Object photos = requestBody.get("photos");
            if (photos != null) {
                ObjectMapper objectMapper = new ObjectMapper();
                String imagesJson = objectMapper.writeValueAsString(photos);
                createCommentRequest.setPhotos(imagesJson);
            } else {
                createCommentRequest.setPhotos("[]");
            }
            if ("POST".equals(createCommentRequest.getTargetType())) {
                if (postMapper.getPostById(Long.valueOf(createCommentRequest.getTargetId())) == null)
                    throw new BusinessException("帖子不存在");
            }
            else {
                if (catMapper.selectCatById(Long.valueOf(createCommentRequest.getTargetId())) == null)
                    throw new BusinessException("猫咪帖不存在");
            }
            Comment response = commentService.createComment(userId, createCommentRequest);
            CommentResp res = new CommentResp(response);
            return ResponseEntity.status(HttpStatus.CREATED).body(res);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("创建评论失败: " + e.getMessage());
        }
    }

    @GetMapping
    @Operation(summary = "评论列表")
    public ResponseEntity<PageResponse<CommentResp>> listComments(
            @RequestParam String targetType,
            @RequestParam String targetId) {

        PageResponse<CommentResp> response = commentService.listComments(targetType, targetId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/delete")
    @Operation(summary = "批量删除评论")
    public ResponseEntity<String> deleteComments(
            @RequestHeader("Authorization") String token,
            @RequestBody List<String> ids) {
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("未携带token或token格式错误");
            }
            //权限管理在service层
            String userId = JwtUtil.parse(token.replace("Bearer ", ""));
            commentService.deleteComments(ids, userId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("删除成功");
        }catch (Exception e) {
            return ResponseEntity.badRequest().body("删除评论失败:"+e.getMessage());
        }
    }
}