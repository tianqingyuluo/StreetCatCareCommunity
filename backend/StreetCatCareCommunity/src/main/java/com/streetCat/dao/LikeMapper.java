package com.streetCat.dao;

import com.streetCat.pojo.Like;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface LikeMapper {
    @Insert("INSERT INTO likes (user_id, target_type, target_id) VALUES (#{userId}, #{targetType}, #{targetId})")
    void insertLike(Like like);

    @Delete("DELETE FROM likes WHERE user_id = #{userId} AND target_type = #{targetType} AND target_id = #{targetId}")
    void deleteLike(Long userId, String targetType, Long targetId);

    @Select("SELECT target_id FROM likes WHERE user_id = #{userId}")
    List<Long> getLikesByUserId(Long userId);
}