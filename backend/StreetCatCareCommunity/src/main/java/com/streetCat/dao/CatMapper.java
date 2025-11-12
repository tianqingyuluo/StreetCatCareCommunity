package com.streetCat.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface CatMapper {
    @Select("SELECT COUNT(*) FROM stray_cats")
    int getCurrentCatNumber();
}
