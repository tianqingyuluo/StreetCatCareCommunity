package com.streetCat.service.impl;

import com.streetCat.dao.FeedingMapper;
import com.streetCat.dao.MainCatMapper;
import com.streetCat.pojo.Feeding;
import com.streetCat.service.FeedingService;
import com.streetCat.utils.BusinessException;
import com.streetCat.utils.RandomUtil;
import com.streetCat.vo.request.CreateFeedingRequest;
import com.streetCat.vo.request.FeedingStatRequest;
import com.streetCat.vo.response.FeedingStatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedingServiceImpl implements FeedingService {

    private final FeedingMapper feedingMapper;
    private final MainCatMapper catMapper;
    @Override
    public Feeding create(CreateFeedingRequest req) {
        String catId =req.getCatId();
        if (catMapper.selectCatById(Long.valueOf(catId))==null){
            throw new BusinessException("没有这个猫");
        }
        Long id = RandomUtil.nextId();
        feedingMapper.insertFeeding(id, req);
        return feedingMapper.selectFeedingById(id);
    }

    @Override
    public List<Feeding> listFeedings(Long catId, Long userId, Long shelterId) {
        return feedingMapper.listFeedings(catId, userId, shelterId);
    }
    @Override
    public FeedingStatResponse statistics(FeedingStatRequest req) {
        String startStr = req.getStart() == null ? null : req.getStart().replace(' ', '+');
        String endStr   = req.getEnd()   == null ? null : req.getEnd().replace(' ', '+' );
        List<Feeding> list = feedingMapper.statList(req.getCatId(), startStr, endStr);

        // 2. 汇总
        long totalCount = list.size();
        int totalFood = list.stream()
                .mapToInt(Feeding::getFoodAmount)   // int 值
                .filter(amount -> amount > 0)        // 可选：过滤负数/0
                .sum();

        // 3. 转 VO
        List<Feeding> records = list.stream()
                .map(f -> {
                    Feeding r = new Feeding();
                    BeanUtils.copyProperties(f, r);
                    return r;
                })
                .collect(Collectors.toList());

        FeedingStatResponse resp = new FeedingStatResponse();
        resp.setCatId(String.valueOf(req.getCatId()));
        resp.setStart(req.getStart());
        resp.setEnd(req.getEnd());
        resp.setTotalCount((int) totalCount);
        resp.setTotalFoodAmount(totalFood);
        resp.setRecords(records);
        return resp;
    }
}