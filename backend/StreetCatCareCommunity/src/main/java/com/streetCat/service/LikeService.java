package com.streetCat.service;

import java.util.List;

public interface LikeService {
    boolean like(String targetType, Long targetId, Long userId);

    boolean unlike(String targetType, Long targetId, Long userId);

    List<Long> getLikesByUserId(Long userId);
}