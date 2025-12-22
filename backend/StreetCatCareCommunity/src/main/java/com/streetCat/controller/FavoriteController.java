package com.streetCat.controller;

import com.streetCat.dao.MainCatMapper;
import com.streetCat.dao.PostMapper;
import com.streetCat.service.FavoriteService;
import com.streetCat.utils.BusinessException;
import com.streetCat.utils.JwtUtil;
import com.streetCat.vo.request.FavoriteRequest;
import com.streetCat.vo.response.FavoriteDetailResponse;
import com.streetCat.vo.response.FavoriteDetailResponseWithListPhotos;
import com.streetCat.vo.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Tag(name = "收藏模块")
public class FavoriteController {
    private final  FavoriteService favoriteService;
    @Autowired
    private MainCatMapper mainCatMapper;
    @Autowired
    private PostMapper postMapper;
    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PatchMapping("/favorites")
    @Operation(summary = "添加收藏")
    public ResponseEntity<Object> addFavorite(@RequestHeader("Authorization") String token,
                                              @RequestBody FavoriteRequest favoriteRequest) {
        try {
            String userId = JwtUtil.parse(token.replace("Bearer ", ""));
            ifInCatOrPost(favoriteRequest.getTargetType(),favoriteRequest.getTargetId());
            favoriteService.addFavorite(favoriteRequest.getTargetType(), userId, favoriteRequest.getTargetId());
            return ResponseEntity.ok("收藏成功");
        } catch (BusinessException e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        }
    }

    @DeleteMapping("/favorites")
    @Operation(summary = "取消收藏")
    public ResponseEntity<Object> removeFavorite(@RequestHeader("Authorization") String token,
                                                 @RequestBody FavoriteRequest favoriteRequest) {
        try {
            String userId = JwtUtil.parse(token.replace("Bearer ", ""));
            ifInCatOrPost(favoriteRequest.getTargetType(),favoriteRequest.getTargetId());
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

    @GetMapping("/favorites/CAT")
    @Operation(summary = "获取用户收藏的猫咪列表(仅id)")
    public ResponseEntity<Object> getFavoriteCats(@RequestHeader("Authorization") String token) {
        try {
            String userId = JwtUtil.parse(token.replace("Bearer ", ""));
            List<String> result = favoriteService.getFavoriteCats(userId);
            return ResponseEntity.ok(result);
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

    @GetMapping("/favorites/POST")
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

    @GetMapping("/favorites/ALL")
    @Operation(summary = "获取用户所有收藏")
    public ResponseEntity<?> getAllFavorites(@RequestHeader("Authorization") String token) {
        try {
            String userId = JwtUtil.parse(token.replace("Bearer ", ""));
            // 获取原始的 FavoriteDetailResponse 数据
            List<FavoriteDetailResponse> favoriteList = favoriteService.getAllFavorites(userId);

            // 将 FavoriteDetailResponse 转换为 FavoriteDetailResponseWithListPhotos
            List<FavoriteDetailResponseWithListPhotos> convertedFavorites = favoriteList.stream()
                    .map(FavoriteDetailResponseWithListPhotos::new) // 使用构造函数进行转换
                    .toList();
            // 返回转换后的数据
            return ResponseEntity.ok(PageResponse.of(convertedFavorites));
        } catch (Exception e) {
            // 处理异常情况
            return ResponseEntity.badRequest().body("Error occurred: " + e.getMessage());
        }
    }
    public void ifInCatOrPost(String targetType,String targetId) {
        if (targetType.equals("CAT")) {
            if (mainCatMapper.selectCatById(Long.valueOf(targetId))==null){
                throw new BusinessException("不存在的猫id");
            }
        }else{
            if (postMapper.getPostById(Long.valueOf(targetId))==null){
                throw new BusinessException("不存在的帖子id");
            }
        }
    }

}