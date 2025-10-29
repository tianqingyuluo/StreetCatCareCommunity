package com.streetCat.controller;

import com.streetCat.service.FavoriteService;
import com.streetCat.utils.BusinessException;
import com.streetCat.utils.JwtUtil;
import com.streetCat.vo.request.FavoriteRequest;
import com.streetCat.vo.response.GetUserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@Tag(name = "收藏模块")
public class FavoriteController {
    private final  FavoriteService favoriteService;
    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PatchMapping("/users/favorite")
    @Operation(summary = "添加收藏")
    public ResponseEntity<Object> addFavorite(@RequestHeader("Authorization") String token,
                                              @RequestBody FavoriteRequest favoriteRequest) {
        try {
            String userId = JwtUtil.parse(token.replace("Bearer ", ""));
            favoriteService.addFavorite(favoriteRequest.getTargetType(), userId, favoriteRequest.getTargetId());
            return ResponseEntity.ok("收藏成功");
        } catch (BusinessException e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "系统错误，请稍后重试");
            return ResponseEntity.status(500).body(result);
        }
    }

    @DeleteMapping("/users/favorite")
    @Operation(summary = "取消收藏")
    public ResponseEntity<Object> removeFavorite(@RequestHeader("Authorization") String token,
                                                 @RequestBody FavoriteRequest favoriteRequest) {
        try {
            String userId = JwtUtil.parse(token.replace("Bearer ", ""));
            favoriteService.removeFavorite(favoriteRequest.getTargetType(), userId, favoriteRequest.getTargetId());
            return ResponseEntity.ok("取消收藏成功");
        } catch (BusinessException e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "系统错误，请稍后重试");
            return ResponseEntity.status(500).body(result);
        }
    }

    @GetMapping("/users/favorite/cats")
    @Operation(summary = "获取用户收藏的猫咪列表(仅id)")
    public ResponseEntity<Object> getFavoriteCats(@RequestHeader("Authorization") String token) {
        try {
            String userId = JwtUtil.parse(token.replace("Bearer ", ""));
            return ResponseEntity.ok(favoriteService.getFavoriteCats(userId));
        } catch (BusinessException e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "系统错误，请稍后重试");
            return ResponseEntity.status(500).body(result);
        }
    }

    @GetMapping("/users/favorite/posts")
    @Operation(summary = "获取用户收藏的帖子列表(仅id)")
    public ResponseEntity<Object> getFavoritePosts(@RequestHeader("Authorization") String token) {
        try {
            String userId = JwtUtil.parse(token.replace("Bearer ", ""));
            return ResponseEntity.ok(favoriteService.getFavoritePosts(userId));
        } catch (BusinessException e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "系统错误，请稍后重试");
            return ResponseEntity.status(500).body(result);
        }
    }

    @GetMapping("/users/favorite/all")
    @Operation(summary = "获取用户所有收藏")
    public ResponseEntity<Object> getAllFavorites(@RequestHeader("Authorization") String token) {
        try {
            String userId = JwtUtil.parse(token.replace("Bearer ", ""));
            return ResponseEntity.ok(favoriteService.getAllFavorites(userId));
        } catch (BusinessException e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "系统错误，请稍后重试");
            return ResponseEntity.status(500).body(result);
        }
    }

}