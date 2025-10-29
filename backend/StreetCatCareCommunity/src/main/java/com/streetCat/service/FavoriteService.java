package com.streetCat.service;

import com.streetCat.vo.response.FavoriteDetailResponse;

import java.util.List;
import java.util.Map;

public interface FavoriteService {
    void addFavorite(String type, String userId, String targetId);
    void removeFavorite(String type, String userId, String targetId);
    List<FavoriteDetailResponse> getAllFavorites(String userId);
    List<Long> getFavoriteCats(String userId);
    List<Long> getFavoritePosts(String userId);
}