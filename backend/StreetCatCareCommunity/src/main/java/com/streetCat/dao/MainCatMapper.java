package com.streetCat.dao;

import com.streetCat.pojo.Cat;
import com.streetCat.vo.request.CatSaveRequest;
import com.streetCat.vo.response.CatResponse;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MainCatMapper {

    /**
     * 写入数据库
     */
    void insertCat(@Param("id") Long id,
                   @Param("req") CatSaveRequest req);

    /**
     * 根据主键查询完整 VO（含统计字段）
     */
    Cat selectCatById(@Param("id") Long id);
    List<Cat> listCats(@Param("shelterId") String shelterId);

    /**
     * 按条件计数
     */
    Long countCats(@Param("shelterId") String shelterId);

    void updateCatById(@Param("id") Long id,
                       @Param("req") CatSaveRequest req);
    void deleteCatById(@Param("id") Long id);
    void updateCatStatus(@Param("id") Long id,
                         @Param("status") String status);
}