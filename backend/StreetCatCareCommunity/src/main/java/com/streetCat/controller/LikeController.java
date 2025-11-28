package com.streetCat.controller;

import com.streetCat.service.LikeService;
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

    @PatchMapping
    public ResponseEntity<Object> like(@RequestHeader("Authorization") String token,
                                       @RequestBody LikeRequest request) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        boolean success = likeService.like(request.getTargetType(), request.getTargetId(), Long.parseLong(userId));
        return success ? ResponseEntity.status(HttpStatus.CREATED).build() : ResponseEntity.badRequest().body("Already liked");
    }

    @DeleteMapping
    public ResponseEntity<Object> unlike(@RequestHeader("Authorization") String token,
                                         @RequestParam String targetType,
                                         @RequestParam Long targetId) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        boolean success = likeService.unlike(targetType, targetId, Long.parseLong(userId));
        return success ? ResponseEntity.noContent().build() : ResponseEntity.badRequest().body("Not liked");
    }

    @GetMapping
    public ResponseEntity<?> getLikes(@RequestHeader("Authorization") String token) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        List<Long> likes = likeService.getLikesByUserId(Long.parseLong(userId));
        return ResponseEntity.ok(likes);
    }
}