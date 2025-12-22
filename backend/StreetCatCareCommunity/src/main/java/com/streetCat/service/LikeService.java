package com.streetCat.service;

import java.util.List;

public interface LikeService {
    boolean like(String targetType, String targetId, String userId);

    boolean unlike(String targetType, String targetId, String userId);

    List<String> getLikesByUserId(String userId);
}