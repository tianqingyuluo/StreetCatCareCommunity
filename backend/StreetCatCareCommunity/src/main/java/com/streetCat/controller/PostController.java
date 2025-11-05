package com.streetCat.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.streetCat.pojo.Post;
import com.streetCat.service.PostService;
import com.streetCat.utils.JwtUtil;
import com.streetCat.vo.request.CreateNewPostRequest;
import com.streetCat.vo.request.UpdatePostStatusRequest;
import com.streetCat.vo.response.PostResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@Tag(name = "帖子模块")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }
    @PostMapping("/posts")
    @Operation(summary = "新建帖子")
    public ResponseEntity<Object> CreateNewPost(@RequestHeader("Authorization") String token,
                                           @RequestBody Map<String, Object> requestBody) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("未携带token或token格式错误");
        }
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));

        try {
            // 手动解析请求体
            CreateNewPostRequest createNewPostRequest = new CreateNewPostRequest();
            createNewPostRequest.setTitle((String) requestBody.get("title"));
            createNewPostRequest.setContent((String) requestBody.get("content"));
            createNewPostRequest.setPostType((String) requestBody.get("postType"));

            // 处理images字段 - 无论是数组还是字符串都转为JSON字符串
            Object images = requestBody.get("images");
            if (images != null) {
                ObjectMapper objectMapper = new ObjectMapper();
                String imagesJson = objectMapper.writeValueAsString(images);
                createNewPostRequest.setImages(imagesJson);
            } else {
                createNewPostRequest.setImages("[]");
            }

            System.out.println("转换后的images: " + createNewPostRequest.getImages());

            Post response = postService.createNewPost(userId, createNewPostRequest);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("=== 创建帖子详细错误信息 ===");
            System.out.println("错误类型: " + e.getClass().getName());
            System.out.println("错误消息: " + e.getMessage());
            System.out.println("=== 请求参数信息 ===");
            System.out.println("userId: " + userId);
            System.out.println("requestBody: " + requestBody);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("创建帖子失败: " + e.getMessage());
        }
    }

    @GetMapping("/posts/pending")
    @Operation(summary = "拉取待处理帖子")
    public Object FindPendingPosts(){
        ArrayList<Post> response = postService.findPendingPosts();
        List<PostResponse> processedResponse = response.stream()
                .map(PostResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(processedResponse);
    }
    @GetMapping("/posts")
    @Operation(summary = "分页获取帖子")
    public ResponseEntity<Object> listPosts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String postType,
            @RequestParam(defaultValue = "CREATED_AT_DESC") String sort,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size){
        return ResponseEntity.ok(postService.listPosts(keyword, postType, sort, page, size));
    }

    @PatchMapping("/posts/{id}/status")
    public ResponseEntity<String> updatePostStatus(
            @RequestHeader("Authorization") String token,
            @PathVariable String id,
            @RequestBody @Valid UpdatePostStatusRequest request) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
         postService.updatePostStatus(id,userId, request.getStatus(), request.getRemark());
        return ResponseEntity.ok("更新成功");
    }
    @GetMapping("/posts/me")
    public ResponseEntity<Object> listPostsByUserId(@RequestHeader("Authorization") String token){
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        List<Post> response = postService.listPostsByUserId(userId);

        // 转换为PostResponse列表
        List<PostResponse> convertedResponse = response.stream()
                .map(PostResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(convertedResponse);
    }
    @PutMapping("/posts/{id}")
    @Operation(summary = "编辑帖子")
    public ResponseEntity<Object> updatePost(
            @RequestHeader("Authorization") String token,
            @PathVariable String id,
            @RequestBody CreateNewPostRequest postSaveReq) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        if (!postService.isPostAuthor(userId, id)) {
            return ResponseEntity.badRequest().body("你不是这篇帖子的作者");
        }
        Post response= postService.updatePost(id,userId,postSaveReq);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/posts/{id}")
    @Operation(summary = "删帖子")
    public ResponseEntity<String> deletePost(@RequestHeader("Authorization") String token,@PathVariable String id) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        if (!postService.isPostAuthor(userId,id) && !postService.isSysAdmin(userId)) {
            return ResponseEntity.badRequest().body("你不是这篇帖子的作者");
        }
        postService.deletePost(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("删除成功");
    }

    @PatchMapping("/posts/{id}/top")
    @Operation(summary = "置顶")
    public ResponseEntity<String> updatePostTopStatus(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> topRequest) {
        Boolean isTop = topRequest.get("isTop");
        postService.updatePostTopStatus(id, isTop);
        return ResponseEntity.ok("置顶操作成功");
    }

    @PatchMapping("/posts/{id}/elite")
    @Operation(summary = "加精")
    public ResponseEntity<String> updatePostEliteStatus(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> eliteRequest) {
        Boolean isElite = eliteRequest.get("isElite");
        postService.updatePostEliteStatus(id, isElite);
        return ResponseEntity.ok("加精操作成功");
    }

}
