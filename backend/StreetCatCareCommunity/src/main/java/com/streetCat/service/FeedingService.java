package com.streetCat.service;


import com.streetCat.pojo.Feeding;
import com.streetCat.vo.request.CreateFeedingRequest;
import com.streetCat.vo.request.FeedingStatRequest;
import com.streetCat.vo.response.FeedingStatResponse;

import java.util.List;


public interface FeedingService {
    /**
     * 新建投喂记录
     */
    Feeding create(CreateFeedingRequest request);
    List<Feeding> listFeedings(Long catId, Long userId, Long shelterId);
    FeedingStatResponse statistics(FeedingStatRequest req);
}