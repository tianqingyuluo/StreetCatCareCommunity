package com.streetCat.controller;

import com.streetCat.dao.CatMapper;
import com.streetCat.dao.MainCatMapper;
import com.streetCat.dao.PostMapper;
import com.streetCat.pojo.PostWithUser;
import com.streetCat.service.LikeService;
import com.streetCat.utils.BusinessException;
import com.streetCat.utils.JwtUtil;
import com.streetCat.vo.request.LikeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/like")
public class LikeController {
    @Autowired
    private LikeService likeService;
    @Autowired
    private MainCatMapper mainCatMapper;
    @Autowired
    private PostMapper postMapper;

    @PatchMapping
    public ResponseEntity<Object> like(@RequestHeader("Authorization") String token,
                                       @RequestBody LikeRequest request) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        try{
            ifInCatOrPost(request.getTargetType(),request.getTargetId());
        }catch (BusinessException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        boolean success = likeService.like(request.getTargetType(), request.getTargetId(), userId);
        return success ? ResponseEntity.status(HttpStatus.CREATED).build() : ResponseEntity.badRequest().body("Already liked");
    }

    @DeleteMapping
    public ResponseEntity<Object> unlike(@RequestHeader("Authorization") String token,
                                         @RequestParam String targetType,
                                         @RequestParam String targetId) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        try{
            ifInCatOrPost(targetType,targetId);
        }catch (BusinessException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        boolean success = likeService.unlike(targetType, targetId, userId);
        return success ? ResponseEntity.noContent().build() : ResponseEntity.badRequest().body("Not liked");
    }

    @GetMapping
    public ResponseEntity<?> getLikes(@RequestHeader("Authorization") String token) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        List<String> likes = likeService.getLikesByUserId(userId);
        return ResponseEntity.ok(likes);
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