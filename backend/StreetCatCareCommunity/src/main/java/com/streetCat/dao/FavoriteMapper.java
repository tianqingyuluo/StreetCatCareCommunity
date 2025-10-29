package com.streetCat.dao;

import com.streetCat.vo.response.FavoriteDetailResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

@Mapper
public interface FavoriteMapper {

    /**
     * 插入收藏记录
     */
    int insertFavorite(@Param("userId") Long userId, @Param("targetType") String targetType, @Param("targetId") Long targetId);

    /**
     * 删除收藏记录
     */
    int deleteFavorite(@Param("userId") Long userId, @Param("targetType") String targetType, @Param("targetId") Long targetId);

    /**
     * 获取用户的所有收藏（包括猫咪和帖子）
     */
    List<FavoriteDetailResponse> getAllFavorites(@Param("userId") Long userId);

    /**
     * 获取用户收藏的猫咪ID列表
     */
    List<Long> getFavoriteCatIds(@Param("userId") Long userId);

    /**
     * 获取用户收藏的帖子ID列表
     */
    List<Long> getFavoritePostIds(@Param("userId") Long userId);
}