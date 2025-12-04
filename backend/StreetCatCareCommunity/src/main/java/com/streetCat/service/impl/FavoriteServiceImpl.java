package com.streetCat.service.impl;

import com.streetCat.dao.FavoriteMapper;
import com.streetCat.service.FavoriteService;
import com.streetCat.utils.BusinessException;
import com.streetCat.utils.RedisCountUtil;
import com.streetCat.vo.response.FavoriteDetailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {
    private final FavoriteMapper favoriteMapper;
    private final RedisCountUtil redisCountUtil;

    @Override
    public void addFavorite(String type, String userId, String targetId) {
        if (Objects.equals(type, "POST")){
            List<Long> favoritePostIds = favoriteMapper.getFavoritePostIds(Long.valueOf(userId));
            if (favoritePostIds.contains(Long.valueOf(targetId))) {
                throw new BusinessException("已经收藏过该帖子");
            }
        }
        if (Objects.equals(type, "CAT")){
            List<Long> favoriteCATIds = favoriteMapper.getFavoriteCatIds(Long.valueOf(userId));
            if (favoriteCATIds.contains(Long.valueOf(targetId))) {
                throw new BusinessException("已经收藏过该哈吉咪");
            }
        }
        if (favoriteMapper.insertFavorite(Long.valueOf(userId), type, Long.valueOf(targetId)) != 1) {
            throw new BusinessException("数据库插入错误");
        }
        if (!redisCountUtil.incrementCollectCount(type, Long.valueOf(targetId), Long.valueOf(userId))) {
            throw new BusinessException("已经收藏过该" + ("CAT".equals(type) ? "猫咪" : "帖子"));
        }
    }

    @Override
    public void removeFavorite(String type, String userId, String targetId) {
        Long userIdLong = Long.valueOf(userId);
        Long targetIdLong = Long.valueOf(targetId);

        // 先删除数据库记录
        int deleted = favoriteMapper.deleteFavorite(userIdLong, type, targetIdLong);
        if (deleted != 1) {
            throw new BusinessException("取消收藏失败，可能尚未收藏");
        }

        // 再更新Redis计数
        if (!redisCountUtil.decrementCollectCount(type, targetIdLong, userIdLong)) {
            System.err.println("Redis取消收藏计数失败，但数据库记录已删除。userId: " + userId + ", targetId: " + targetId);
        }
    }
    @Override
    public List<FavoriteDetailResponse> getAllFavorites(String userId) {
        Long userIdLong = Long.valueOf(userId);
        List<FavoriteDetailResponse> favoriteDetailResponse = Collections.singletonList(new FavoriteDetailResponse());
        try {
             favoriteDetailResponse = favoriteMapper.getAllFavorites(userIdLong);
        }
        catch (Exception e) {
            System.err.println(e.getMessage());
        }
        return favoriteDetailResponse;
    }

    @Override
    public List<Long> getFavoriteCats(String userId) {
        Long userIdLong = Long.valueOf(userId);
        return favoriteMapper.getFavoriteCatIds(userIdLong);
    }

    @Override
    public List<Long> getFavoritePosts(String userId) {
        Long userIdLong = Long.valueOf(userId);
        return favoriteMapper.getFavoritePostIds(userIdLong);
    }
}