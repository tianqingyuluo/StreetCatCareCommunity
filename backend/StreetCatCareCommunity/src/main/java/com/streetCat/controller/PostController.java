package com.streetCat.controller;

import com.streetCat.pojo.Post;
import com.streetCat.service.AuthService;
import com.streetCat.service.PostService;
import com.streetCat.utils.JwtUtil;
import com.streetCat.vo.request.CreateNewPostRequest;
import com.streetCat.vo.request.PutUserRequest;
import com.streetCat.vo.response.GetUserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "帖子模块")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }
    @PostMapping("/posts")
    @Operation(summary = "新建帖子")
    public ResponseEntity<Object> updateMe(@RequestHeader("Authorization") String token,
                                           @RequestBody CreateNewPostRequest createNewPostRequest) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("未携带token或token格式错误");
        }
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));

        Post response= postService.createNewPost(Long.valueOf(userId),createNewPostRequest);
        return ResponseEntity.ok(response);
    }
}
