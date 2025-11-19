package com.streetCat.dao;

import com.streetCat.pojo.Feeding;
import com.streetCat.vo.request.CreateFeedingRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.OffsetDateTime;
import java.util.List;

@Mapper
public interface FeedingMapper {

    /**
     * 插入一条投喂记录，主键自增并回填
     */
    void insertFeeding(@Param("id") Long id,
                      @Param("feeding") CreateFeedingRequest feeding);
    Feeding selectFeedingById(@Param("id") Long id);
    List<Feeding> listFeedings(@Param("catId") Long catId,
                               @Param("userId") Long userId,
                               @Param("shelterId") Long shelterId);
    List<Feeding> statList(@Param("catId") Long catId,
                           @Param("start") String start,
                           @Param("end") String end);
}