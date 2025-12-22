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
            List<String> favoritePostIds = favoriteMapper.getFavoritePostIds(userId);
            if (favoritePostIds.contains(targetId)) {
                throw new BusinessException("已经收藏过该帖子");
            }
        }
        if (Objects.equals(type, "CAT")){
            List<String > favoriteCATIds = favoriteMapper.getFavoriteCatIds(userId);
            if (favoriteCATIds.contains(targetId)) {
                throw new BusinessException("已经收藏过该哈吉咪");
            }
        }
        if (favoriteMapper.insertFavorite(userId, type, targetId) != 1) {
            throw new BusinessException("数据库插入错误");
        }
        if (!redisCountUtil.incrementCollectCount(type, targetId, userId)){
            throw new BusinessException("已经收藏过该" + ("CAT".equals(type) ? "猫咪" : "帖子"));
        }
    }

    @Override
    public void removeFavorite(String type, String userId, String targetId) {

        // 先删除数据库记录
        int deleted = favoriteMapper.deleteFavorite(userId, type, targetId);
        if (deleted != 1) {
            throw new BusinessException("取消收藏失败，可能尚未收藏");
        }

        // 再更新Redis计数
        if (!redisCountUtil.decrementCollectCount(type, targetId, userId)) {
            System.err.println("Redis取消收藏计数失败，但数据库记录已删除。userId: " + userId + ", targetId: " + targetId);
        }
    }
    @Override
    public List<FavoriteDetailResponse> getAllFavorites(String userId) {
        List<FavoriteDetailResponse> favoriteDetailResponse = Collections.singletonList(new FavoriteDetailResponse());
        try {
             favoriteDetailResponse = favoriteMapper.getAllFavorites(userId);
        }
        catch (Exception e) {
            System.err.println(e.getMessage());
        }
        return favoriteDetailResponse;
    }

    @Override
    public List<String> getFavoriteCats(String userId) {
        return favoriteMapper.getFavoriteCatIds(userId);
    }

    @Override
    public List<String> getFavoritePosts(String userId) {
        return favoriteMapper.getFavoritePostIds(userId);
    }

}