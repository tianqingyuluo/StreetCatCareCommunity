package com.streetCat.service.impl;

import com.streetCat.dao.LikeMapper;
import com.streetCat.pojo.Like;
import com.streetCat.service.LikeService;
import com.streetCat.utils.RedisCountUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeServiceImpl implements LikeService {

    @Autowired
    private LikeMapper likeMapper;

    @Autowired
    private RedisCountUtil redisCountUtil;

    @Override
    public boolean like(String targetType, Long targetId, Long userId) {
        // 检查是否已经点赞过
        if (redisCountUtil.incrementLikeCount(targetType, targetId, userId)) {
            // 插入数据库记录
            Like like = new Like();
            like.setUserId(userId);
            like.setTargetType(targetType);
            like.setTargetId(targetId);
            likeMapper.insertLike(like);
            return true;
        }
        return false;
    }

    @Override
    public boolean unlike(String targetType, Long targetId, Long userId) {
        // 检查是否有点赞记录
        if (redisCountUtil.decrementLikeCount(targetType, targetId, userId)) {
            // 删除数据库记录
            likeMapper.deleteLike(userId, targetType, targetId);
            return true;
        }
        return false;
    }

    @Override
    public List<Long> getLikesByUserId(Long userId) {
        return likeMapper.getLikesByUserId(userId);
    }
}